import { AccessoryPlugin, Service } from 'homebridge'
import { AirConditionerModeCode, Specs } from './XiaoMiAirConditionerMC5.constant'
import { MIoTDevice, MiIdentify, Shared } from 'homebridge-mi-devices'

type Props = {
  identify: MiIdentify
}

export class XiaoMiAirConditionerMC5 implements AccessoryPlugin {

  // Requirement
  private readonly name: string
  private readonly token: string
  private readonly address: string
  // Services
  private readonly informationService: Service
  private readonly AirConditionerService: Service
  // Device
  private AirConditionerDevice: MIoTDevice

  constructor (props: Props) {
    // Requirement
    this.name = props.identify.name
    this.token = props.identify.token
    this.address = props.identify.address
    // Information
    this.informationService = new Shared.hap.Service.AccessoryInformation()
      .setCharacteristic(Shared.hap.Characteristic.Manufacturer, 'XiaoMi')
      .setCharacteristic(Shared.hap.Characteristic.Model, 'MC5')
    // AirConditioner
    const AirConditionerName = props.identify.name
    this.AirConditionerService = new Shared.hap.Service.HeaterCooler(AirConditionerName)
    this.AirConditionerDevice = new MIoTDevice({ ...props, service: this.AirConditionerService, specs: Specs })
    this.AirConditionerSetup()
  }

  AirConditionerSetup = () => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.Active, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerSwitchStatus.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerSwitchStatus.name,
        formatter: (value) => value === 1
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.CurrentHeaterCoolerState, {
      get: {
        formatter: (valueMapping) => {
          if (!valueMapping[Specs.AirConditionerSwitchStatus.name]) return 0
          return valueMapping[Specs.AirConditionerMode.name] === AirConditionerModeCode.Heat ? 2 : 3
        }
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.TargetHeaterCoolerState, {
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
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.CurrentTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.EnvironmentTemperature.name]
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.CoolingThresholdTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value as number
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.HeatingThresholdTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value as number
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.SwingMode, {
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
    Shared.log.info(`Identifying ${this.name} ${this.address}`)
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices (): Service[] {
    return [
      this.informationService,
      this.AirConditionerService,
    ]
  }

}
