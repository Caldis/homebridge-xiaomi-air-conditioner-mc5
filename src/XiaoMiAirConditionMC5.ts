// @ts-ignore
import {
  AccessoryPlugin,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service
} from 'homebridge'
import MIoTDevice, { MIoTDeviceIdentify } from './MIoTDevice'
import {
  AirConditioner,
  Alarm,
  Environment,
  FanControl,
  IndicatorLight,
  ModeCode
} from './XiaoMiAirConditionMC5.constant'

export class XiaoMiAirConditionMC5 implements AccessoryPlugin {

  // Requirement
  private readonly hap: HAP
  private readonly log: (...strings: Parameters<Logging>) => void
  private readonly name: string
  private readonly informationService: Service
  private readonly characteristicsService: Service
  // Identify
  private deviceIdentify: MIoTDeviceIdentify
  // Data
  private device: MIoTDevice
  // DEBUG
  private debug = false

  constructor (hap: HAP, log: Logging, identify: MIoTDeviceIdentify) {
    // Basic
    this.hap = hap
    this.log = (...args) => this.debug && log(...args)
    this.name = identify.name
    this.deviceIdentify = identify
    // Register
    this.informationService = new this.hap.Service.AccessoryInformation()
      .setCharacteristic(this.hap.Characteristic.Manufacturer, 'XiaoMi')
      .setCharacteristic(this.hap.Characteristic.Model, 'MC5')
    // Characteristics Service
    this.characteristicsService = new this.hap.Service.HeaterCooler(this.deviceIdentify.name)
    // Init device
    this.device = new MIoTDevice(identify, log)
    this.registrySpecs()
    this.registryCharacters()
  }

  registrySpecs = () => {
    Object.entries(AirConditioner).forEach(([_, spec]) => {
      this.device.addSpec(spec)
    })
    Object.entries(FanControl).forEach(([_, spec]) => {
      this.device.addSpec(spec)
    })
    Object.entries(Environment).forEach(([_, spec]) => {
      this.device.addSpec(spec)
    })
    Object.entries(Alarm).forEach(([_, spec]) => {
      this.device.addSpec(spec)
    })
    Object.entries(IndicatorLight).forEach(([_, spec]) => {
      this.device.addSpec(spec)
    })
  }
  registryCharacters = () => {
    this.characteristicsService.getCharacteristic(this.hap.Characteristic.Active)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const [SwitchStatus] = await this.device.getProperty<boolean>(AirConditioner.SwitchStatus.name)
          this.log('Characteristic.Active.GET')
          this.log('AirConditioner.SwitchStatus', SwitchStatus)
          callback(undefined, SwitchStatus.value ? 1 : 0)
        } catch (e) {
          this.log('Characteristic.Active.GET.ERR', e)
          callback(e)
        }
      })
      .on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
          await this.device.setProperty<boolean>(AirConditioner.SwitchStatus.name, !!value)
          this.log('Characteristic.Active.SET', value)
          callback(undefined, value)
        } catch (e) {
          this.log('Characteristic.Active.SET.ERR', e)
          callback(e)
        }
      })
    this.characteristicsService.getCharacteristic(this.hap.Characteristic.CurrentHeaterCoolerState)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const [SwitchStatus, Mode] = await this.device.getProperty([
            AirConditioner.SwitchStatus.name,
            AirConditioner.Mode.name,
          ])
          this.log('Characteristic.CurrentHeaterCoolerState.GET')
          this.log('AirConditioner.SwitchStatus', SwitchStatus)
          this.log('AirConditioner.Mode', Mode)
          if (!SwitchStatus.value) {
            callback(undefined, 0)
          } else {
            callback(undefined, Mode.value === ModeCode.Heat ? 2 : 3)
          }
        } catch (e) {
          this.log('Characteristic.CurrentHeaterCoolerState.GET.ERR', e)
          callback(e)
        }
      })
    this.characteristicsService.getCharacteristic(this.hap.Characteristic.TargetHeaterCoolerState)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const [SwitchStatus, Mode] = await this.device.getProperty([
            AirConditioner.SwitchStatus.name,
            AirConditioner.Mode.name,
          ])
          this.log('Characteristic.CurrentHeaterCoolerState.GET')
          this.log('AirConditioner.SwitchStatus', SwitchStatus)
          this.log('AirConditioner.Mode', Mode)
          if (!SwitchStatus.value) {
            callback(undefined, 0)
          } else {
            callback(undefined, Mode.value === ModeCode.Heat ? 1 : 2)
          }
        } catch (e) {
          this.log('Characteristic.CurrentHeaterCoolerState.GET.ERR', e)
          callback(e)
        }
      })
      .on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
          await this.device.setProperty(AirConditioner.Mode.name, value === 1 ? ModeCode.Heat : ModeCode.Cool)
          this.log('Characteristic.TargetHeaterCoolerState.SET', value)
          callback(undefined, value)
        } catch (e) {
          this.log('Characteristic.TargetHeaterCoolerState.SET.ERR', e)
          callback(e)
        }
      })
    this.characteristicsService.getCharacteristic(this.hap.Characteristic.CurrentTemperature)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const [Temperature] = await this.device.getProperty([
            Environment.Temperature.name,
          ])
          this.log('Characteristic.CurrentTemperature.GET')
          this.log('AirConditioner.Temperature', Temperature)
          callback(undefined, Temperature.value as number)
        } catch (e) {
          this.log('Characteristic.CurrentTemperature.GET.ERR', e)
          callback(e)
        }
      })
    this.characteristicsService.getCharacteristic(this.hap.Characteristic.CoolingThresholdTemperature)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const [TargetTemperature] = await this.device.getProperty([
            AirConditioner.TargetTemperature.name,
          ])
          this.log('Characteristic.CoolingThresholdTemperature.GET')
          this.log('AirConditioner.TargetTemperature', TargetTemperature)
          callback(undefined, TargetTemperature.value as number)
        } catch (e) {
          this.log('Characteristic.CoolingThresholdTemperature.GET.ERR', e)
          callback(e)
        }
      })
      .on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
          await this.device.setProperty(AirConditioner.TargetTemperature.name, value)
          this.log('Characteristic.CoolingThresholdTemperature.SET', value)
          callback(undefined, value)
        } catch (e) {
          this.log('Characteristic.CoolingThresholdTemperature.SET.ERR', e)
          callback(e)
        }
      })
    this.characteristicsService.getCharacteristic(this.hap.Characteristic.HeatingThresholdTemperature)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const [TargetTemperature] = await this.device.getProperty([
            AirConditioner.TargetTemperature.name,
          ])
          this.log('Characteristic.HeatingThresholdTemperature.GET')
          this.log('AirConditioner.TargetTemperature', TargetTemperature)
          callback(undefined, TargetTemperature.value as number)
        } catch (e) {
          this.log('Characteristic.HeatingThresholdTemperature.GET.ERR', e)
          callback(e)
        }
      })
      .on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
          await this.device.setProperty(AirConditioner.TargetTemperature.name, value)
          this.log('Characteristic.HeatingThresholdTemperature.SET', value)
          callback(undefined, value)
        } catch (e) {
          this.log('Characteristic.HeatingThresholdTemperature.SET.ERR', e)
          callback(e)
        }
      })
    this.characteristicsService.getCharacteristic(this.hap.Characteristic.SwingMode)
      .on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const [VerticalSwing] = await this.device.getProperty([
            FanControl.VerticalSwing.name,
          ])
          this.log('Characteristic.SwingMode.GET')
          this.log('FanControl.VerticalSwing', VerticalSwing)
          callback(undefined, VerticalSwing.value ? 1 : 0)
        } catch (e) {
          this.log('Characteristic.SwingMode.GET.ERR', e)
          callback(e)
        }
      })
      .on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
          await this.device.setProperty(FanControl.VerticalSwing.name, value === 1)
          this.log('Characteristic.SwingMode.SET', value)
          callback(undefined, value)
        } catch (e) {
          this.log('Characteristic.SwingMode.SET.ERR', e)
          callback(e)
        }
      })
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify (): void {
    this.log(`Identifying ${this.deviceIdentify.name} ${this.deviceIdentify.address}`)
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
