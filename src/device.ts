import { AccessoryPlugin, Service, Categories } from 'homebridge'
import {
  AirConditionerModeCode,
  FanLevelCode,
  FanLevelCodeVolumeMapping,
  Specs
} from './device.constant'
import { MIoTDevice, MiIdentify, Shared } from 'homebridge-mi-devices'

type Props = {
  identify: MiIdentify
}

export class Device implements AccessoryPlugin {

  // Requirement
  private readonly name: string
  private readonly token: string
  private readonly address: string
  // Services
  private readonly informationService: Service
  private readonly AirConditionerService: Service
  private readonly AirConditionerECOModeService: Service
  private readonly AirConditionerHeaterModeService: Service
  private readonly AirConditionerDryerModeService: Service
  private readonly AirConditionerSleepModeService: Service
  private readonly AirConditionerAlarmService: Service
  private readonly AirConditionerIndicatorLightService: Service
  // Device
  private AirConditionerDevice: MIoTDevice

  constructor (props: Props) {
    // Requirement
    this.name = props.identify.name
    this.token = props.identify.token
    this.address = props.identify.address
    // Information
    this.informationService = new Shared.hap.Service.AccessoryInformation()
      .setCharacteristic(Shared.hap.Characteristic.Category, Categories.AIR_CONDITIONER)
      .setCharacteristic(Shared.hap.Characteristic.Manufacturer, 'XiaoMi')
      .setCharacteristic(Shared.hap.Characteristic.Model, 'MC5')
    // AirConditioner
    this.AirConditionerService = new Shared.hap.Service.HeaterCooler(props.identify.name)
    this.AirConditionerDevice = new MIoTDevice({ ...props, service: this.AirConditionerService, specs: Specs })
    this.AirConditionerSetup()
    // AirConditioner: Extra Modes
    // 注意这里的 displayName 和 subType 都需要设置, 不然可能会有 UUID 重复的错误, 原因未知
    this.AirConditionerECOModeService = new Shared.hap.Service.Switch(`ECOMode`, 'ECOMode')
    this.AirConditionerECOModeService.getCharacteristic(Shared.hap.Characteristic.ConfiguredName).updateValue('ECOMode')
    this.AirConditionerECOModeSetup(this.AirConditionerECOModeService)
    this.AirConditionerHeaterModeService = new Shared.hap.Service.Switch(`HeaterMode`, 'HeaterMode')
    this.AirConditionerHeaterModeService.getCharacteristic(Shared.hap.Characteristic.ConfiguredName).updateValue('HeaterMode')
    this.AirConditionerHeaterModeSetup(this.AirConditionerHeaterModeService)
    this.AirConditionerDryerModeService = new Shared.hap.Service.Switch(`DryerMode`, 'DryerMode')
    this.AirConditionerDryerModeService.getCharacteristic(Shared.hap.Characteristic.ConfiguredName).updateValue('DryerMode')
    this.AirConditionerDryerModeSetup(this.AirConditionerDryerModeService)
    this.AirConditionerSleepModeService = new Shared.hap.Service.Switch(`SleepMode`, 'SleepMode')
    this.AirConditionerSleepModeService.getCharacteristic(Shared.hap.Characteristic.ConfiguredName).updateValue('SleepMode')
    this.AirConditionerSleepModeSetup(this.AirConditionerSleepModeService)
    this.AirConditionerSleepModeService = new Shared.hap.Service.Switch(`SleepMode`, 'SleepMode')
    this.AirConditionerSleepModeService.getCharacteristic(Shared.hap.Characteristic.ConfiguredName).updateValue('SleepMode')
    this.AirConditionerSleepModeSetup(this.AirConditionerSleepModeService)
    // AirConditioner: Sound & Light
    this.AirConditionerAlarmService = new Shared.hap.Service.Switch(`Alarm`, 'Alarm')
    this.AirConditionerAlarmService.getCharacteristic(Shared.hap.Characteristic.ConfiguredName).updateValue('Alarm')
    this.AirConditionerAlarmSetup(this.AirConditionerAlarmService)
    this.AirConditionerIndicatorLightService = new Shared.hap.Service.Switch(`IndicatorLight`, 'IndicatorLight')
    this.AirConditionerIndicatorLightService.getCharacteristic(Shared.hap.Characteristic.ConfiguredName).updateValue('IndicatorLight')
    this.AirConditionerIndicatorLightSetup(this.AirConditionerIndicatorLightService)
    // AirConditioner: Threshold
    // 某个版本之后 HomeBridge 调整了 HeatingThresholdTemperature 的上下限, Max 仅能到 25, 这里需要重写其上下限, 顺带设置 step
    // @see https://developers.homebridge.io/#/api/characteristics#characteristicsetprops
    this.AirConditionerService.getCharacteristic(Shared.hap.Characteristic.CoolingThresholdTemperature).setProps({
      minValue: 16,
      maxValue: 31,
      minStep: 0.5,
    })
    this.AirConditionerService.getCharacteristic(Shared.hap.Characteristic.HeatingThresholdTemperature).setProps({
      minValue: 16,
      maxValue: 31,
      minStep: 0.5,
    })
    // 设置风量间隔: 10
    this.AirConditionerService.getCharacteristic(Shared.hap.Characteristic.RotationSpeed).setProps({
      minValue: 1,
      maxValue: 100,
      minStep: 10,
    })
  }

  AirConditionerSetup = () => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.Active, {
      get: {
        defaultValue: 0,
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerSwitchStatus.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerSwitchStatus.name,
        formatter: (value) => value === 1
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.CurrentHeaterCoolerState, {
      get: {
        defaultValue: 1,
        formatter: (valueMapping) => {
          if (!valueMapping[Specs.AirConditionerSwitchStatus.name]) return 1
          return valueMapping[Specs.AirConditionerMode.name] === AirConditionerModeCode.Heat ? 2 : 3
        }
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.TargetHeaterCoolerState, {
      get: {
        defaultValue: 0,
        formatter: (valueMapping) => {
          switch (valueMapping[Specs.AirConditionerMode.name]) {
            case AirConditionerModeCode.Fan:
              return 0
            case AirConditionerModeCode.Heat:
              return 1
            case AirConditionerModeCode.Cool:
              return 2
          }
          return 0
        }
      },
      set: {
        property: Specs.AirConditionerMode.name,
        formatter: (value) => {
          switch (value) {
            case 0:
              this.AirConditionerService.setCharacteristic(Shared.hap.Characteristic.CurrentHeaterCoolerState, 1)
              break
            case 1:
              this.AirConditionerService.setCharacteristic(Shared.hap.Characteristic.CurrentHeaterCoolerState, 2)
              break
            case 2:
              this.AirConditionerService.setCharacteristic(Shared.hap.Characteristic.CurrentHeaterCoolerState, 3)
              break
          }
          switch (value) {
            case 0:
              // this.AirConditionerECOModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              // this.AirConditionerHeaterModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              // this.AirConditionerDryerModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              // this.AirConditionerSleepModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              return AirConditionerModeCode.Fan
            case 1:
              // this.AirConditionerECOModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              // this.AirConditionerHeaterModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0) // 关电辅热
              // this.AirConditionerDryerModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              // this.AirConditionerSleepModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              return AirConditionerModeCode.Heat
            case 2:
              // this.AirConditionerECOModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              // this.AirConditionerHeaterModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0) // 关电辅热
              // this.AirConditionerDryerModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              // this.AirConditionerSleepModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
              return AirConditionerModeCode.Cool
          }
          return AirConditionerModeCode.Fan // 默認吹風
        }
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.CurrentTemperature, {
      get: {
        defaultValue: 0,
        formatter: (valueMapping) => valueMapping[Specs.EnvironmentTemperature.name]
      },
    })
    // 制冷上限
    // @see https://github.com/apple/HomeKitADK/blob/master/HAP/HAPCharacteristicTypes.h
    // 该特性描述了支持同时加热和冷却的附件的冷却阈值，单位为摄氏度。该特性的值表示在开启冷却之前必须达到的最高温度。
    // 例如，如果 "目标加热冷却状态 "被设置为 "自动"，并且当前温度超过了最高温度，那么冷却机制应该开启，以降低当前温度，直到达到最低温度。
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.CoolingThresholdTemperature, {
      get: {
        defaultValue: 25,
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value as number
      },
    })
    // 制热下限
    // @see https://github.com/apple/HomeKitADK/blob/master/HAP/HAPCharacteristicTypes.h
    // 该特性描述了支持同时加热和冷却的附件的加热阈值，单位为摄氏度。这个特性的值表示在开启加热之前必须达到的最低温度。
    // 例如，如果 "目标加热冷却状态 "被设置为 "自动"，并且当前温度低于最低温度，那么加热机制应该打开以提高当前温度，直到达到最低温度。
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.HeatingThresholdTemperature, {
      get: {
        defaultValue: 25,
        formatter: (valueMapping) => valueMapping[Specs.AirConditionerTargetTemperature.name]
      },
      set: {
        property: Specs.AirConditionerTargetTemperature.name,
        formatter: (value) => value as number
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.SwingMode, {
      get: {
        defaultValue: 0,
        formatter: (valueMapping) => valueMapping[Specs.FanVerticalSwing.name] ? 1 : 0
      },
      set: {
        property: Specs.FanVerticalSwing.name,
        formatter: (value) => value === 1
      },
    })
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.RotationSpeed, {
      get: {
        defaultValue: 0,
        formatter: (valueMapping) => {
          return FanLevelCodeVolumeMapping[valueMapping[Specs.FanLevel.name] as FanLevelCode]
        }
      },
      set: {
        property: Specs.FanLevel.name,
        formatter: (value) => {
          if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Auto]) {
            return FanLevelCode.Auto
          } else if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Level1]) {
            return FanLevelCode.Level1
          } else if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Level2]) {
            return FanLevelCode.Level2
          } else if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Level3]) {
            return FanLevelCode.Level3
          } else if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Level4]) {
            return FanLevelCode.Level4
          } else if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Level5]) {
            return FanLevelCode.Level5
          } else if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Level6]) {
            return FanLevelCode.Level6
          } else if (value <= FanLevelCodeVolumeMapping[FanLevelCode.Level7]) {
            return FanLevelCode.Level7
          }
          return FanLevelCode.Auto
        }
      },
    })
  }
  AirConditionerECOModeSetup = (service: Service) => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.On, {
      service,
      get: {
        defaultValue: 0,
        formatter: (valueMapping) =>
          valueMapping[Specs.AirConditionerECOMode.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerECOMode.name,
        formatter: (value) => !!value
      },
    })
  }
  AirConditionerHeaterModeSetup = (service: Service) => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.On, {
      service,
      get: {
        defaultValue: 0,
        formatter: (valueMapping) =>
          valueMapping[Specs.AirConditionerHeaterMode.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerHeaterMode.name,
        formatter: (value) => !!value
      },
    })
  }
  AirConditionerDryerModeSetup = (service: Service) => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.On, {
      service,
      get: {
        defaultValue: 0,
        formatter: (valueMapping) =>
          valueMapping[Specs.AirConditionerDryerMode.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerDryerMode.name,
        formatter: (value) => !!value
      },
    })
  }
  AirConditionerSleepModeSetup = (service: Service) => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.On, {
      service,
      get: {
        defaultValue: 0,
        formatter: (valueMapping) =>
          valueMapping[Specs.AirConditionerSleepMode.name] ? 1 : 0
      },
      set: {
        property: Specs.AirConditionerSleepMode.name,
        formatter: (value) => !!value
      },
    })
  }
  AirConditionerAlarmSetup = (service: Service) => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.On, {
      service,
      get: {
        defaultValue: 0,
        formatter: (valueMapping) =>
          valueMapping[Specs.Alarm.name] ? 1 : 0
      },
      set: {
        property: Specs.Alarm.name,
        formatter: (value) => !!value
      },
    })
  }
  AirConditionerIndicatorLightSetup = (service: Service) => {
    this.AirConditionerDevice.addCharacteristicListener(Shared.hap.Characteristic.On, {
      service,
      get: {
        defaultValue: 0,
        formatter: (valueMapping) =>
          valueMapping[Specs.IndicatorLightSwitchStatus.name] ? 1 : 0
      },
      set: {
        property: Specs.IndicatorLightSwitchStatus.name,
        formatter: (value) => !!value
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
      this.AirConditionerECOModeService,
      this.AirConditionerHeaterModeService,
      this.AirConditionerDryerModeService,
      this.AirConditionerSleepModeService,
      this.AirConditionerAlarmService,
      this.AirConditionerIndicatorLightService,
    ]
  }

}
