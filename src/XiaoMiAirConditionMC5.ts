// @ts-ignore
import { AccessoryPlugin, HAP, Logging, Service } from 'homebridge'
import MIoTDevice, { MIoTDeviceIdentify } from './MIoTDevice'
import { AirConditionerModeCode, Specs } from './XiaoMiAirConditionMC5.constant'

type Props = {
  hap: HAP
  log: Logging
  identify: MIoTDeviceIdentify
}

export class XiaoMiAirConditionMC5 implements AccessoryPlugin {

  // Requirement
  private readonly name: string
  private readonly token: string
  private readonly address: string
  // Foundation
  private readonly hap: HAP
  private readonly log: Logging
  // Services
  private readonly informationService: Service
  private readonly characteristicsService: Service
  // Device
  private device: MIoTDevice

  constructor (props: Props) {
    // Requirement
    this.name = props.identify.name
    this.token = props.identify.token
    this.address = props.identify.address
    // Foundation
    this.hap = props.hap
    this.log = props.log
    // Services
    this.informationService = new props.hap.Service.AccessoryInformation()
      .setCharacteristic(this.hap.Characteristic.Manufacturer, 'XiaoMi')
      .setCharacteristic(this.hap.Characteristic.Model, 'MC5')
    this.characteristicsService = new this.hap.Service.HeaterCooler(props.identify.name)
    // device
    this.device = new MIoTDevice({ ...props, characteristicsService: this.characteristicsService })
    // Registry
    this.registrySpecs()
    this.registryCharacters()
  }

  registrySpecs = () => {
    Object.values(Specs).forEach(i => this.device.addSpec(i))
  }
  registryCharacters = () => {
    this.device.addCharacteristicListener(this.hap.Characteristic.Active, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerSwitchStatus.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerSwitchStatus.name,
        formatter: (value) => value === 1
      },
    })
    this.device.addCharacteristicListener(this.hap.Characteristic.CurrentHeaterCoolerState, {
      get: {
        formatter: (valueMapping) => {
          if (!valueMapping[Specs.AirConditionerSwitchStatus.name]) return 0
          return valueMapping[Specs.AirConditionerMode.name] === AirConditionerModeCode.Heat ? 2 : 3
        }
      },
    })
    this.device.addCharacteristicListener(this.hap.Characteristic.TargetHeaterCoolerState, {
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
    this.device.addCharacteristicListener(this.hap.Characteristic.CurrentTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.EnvironmentTemperature.name]
      },
    })
    this.device.addCharacteristicListener(this.hap.Characteristic.CoolingThresholdTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value
      },
    })
    this.device.addCharacteristicListener(this.hap.Characteristic.HeatingThresholdTemperature, {
      get: {
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value
      },
    })
    this.device.addCharacteristicListener(this.hap.Characteristic.SwingMode, {
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
    this.log.info(`Identifying ${this.name} ${this.address}`)
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices (): Service[] {
    return [
      this.informationService,
      this.characteristicsService,
    ]
  }

}
