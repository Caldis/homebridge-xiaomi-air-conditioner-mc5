import { AccessoryPlugin, Service } from 'homebridge'
import { AirConditionerModeCode, Specs } from './XiaoMiAirConditionMC5.constant'
import { MIoTDevice, MIoTDeviceIdentify, SharedFoundation } from 'homebridge-miot-devices'

type Props = {
  identify: MIoTDeviceIdentify
}

export class XiaoMiAirConditionMC5 implements AccessoryPlugin {

  // Requirement
  private readonly name: string
  private readonly token: string
  private readonly address: string
  // Services
  private readonly informationService: Service
  private readonly AirConditionService: Service
  // Device
  private AirConditionDevice: MIoTDevice

  constructor (props: Props) {
    // Requirement
    this.name = props.identify.name
    this.token = props.identify.token
    this.address = props.identify.address
    // Information
    this.informationService = new SharedFoundation.hap.Service.AccessoryInformation()
      .setCharacteristic(SharedFoundation.hap.Characteristic.Manufacturer, 'XiaoMi')
      .setCharacteristic(SharedFoundation.hap.Characteristic.Model, 'MC5')
    // AirCondition
    this.AirConditionService = new SharedFoundation.hap.Service.HeaterCooler(props.identify.name)
    this.AirConditionDevice = new MIoTDevice({ ...props, characteristicsService: this.AirConditionService })
    this.AirConditionSetup()
  }

  AirConditionSetup = () => {
    this.AirConditionDevice.addMIoTSpec(Specs)
    this.AirConditionDevice.addMIoTCharacteristicListener(SharedFoundation.hap.Characteristic.Active, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerSwitchStatus.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerSwitchStatus.name,
        formatter: (value) => value === 1
      },
    })
    this.AirConditionDevice.addMIoTCharacteristicListener(SharedFoundation.hap.Characteristic.CurrentHeaterCoolerState, {
      get: {
        formatter: (valueMapping) => {
          if (!valueMapping[Specs.AirConditionerSwitchStatus.name]) return 0
          return valueMapping[Specs.AirConditionerMode.name] === AirConditionerModeCode.Heat ? 2 : 3
        }
      },
    })
    this.AirConditionDevice.addMIoTCharacteristicListener(SharedFoundation.hap.Characteristic.TargetHeaterCoolerState, {
      get: {
        formatter: (valueMapping) => {
          if (!valueMapping[Specs.AirConditionerSwitchStatus.name]) return 0
          return valueMapping[Specs.AirConditionerMode.name] === AirConditionerModeCode.Heat ? 1 : 2
        }
      },
      set: {
        property: Specs.AirConditionerMode.name,
        formatter: (value) => value === 1 ? AirConditionerModeCode.Heat : AirConditionerModeCode.Cool
      },
    })
    this.AirConditionDevice.addMIoTCharacteristicListener(SharedFoundation.hap.Characteristic.CurrentTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.EnvironmentTemperature.name]
      },
    })
    this.AirConditionDevice.addMIoTCharacteristicListener(SharedFoundation.hap.Characteristic.CoolingThresholdTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value
      },
    })
    this.AirConditionDevice.addMIoTCharacteristicListener(SharedFoundation.hap.Characteristic.HeatingThresholdTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value
      },
    })
    this.AirConditionDevice.addMIoTCharacteristicListener(SharedFoundation.hap.Characteristic.SwingMode, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.FanVerticalSwing.name] ? 1 : 0
      },
      set: {
        property: Specs.FanVerticalSwing.name,
        formatter: (value) => value === 1
      },
    })
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify (): void {
    SharedFoundation.log.info(`Identifying ${this.name} ${this.address}`)
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices (): Service[] {
    return [
      this.informationService,
      this.AirConditionService,
    ]
  }

}
