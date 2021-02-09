// 特性信息
import { formatMIoTSpecs } from 'homebridge-mi-devices'

export const Specs = formatMIoTSpecs({
  // 启动状态
  AirConditionerSwitchStatus: { siid: 2, piid: 1 },
  // 运行模式
  AirConditionerMode: { siid: 2, piid: 2 },
  // 目标温度
  AirConditionerTargetTemperature: { siid: 2, piid: 4 },
  // 节能模式
  AirConditionerECOMode: { siid: 2, piid: 7 },
  // 制热模式
  AirConditionerHeaterMode: { siid: 2, piid: 9 },
  // 除湿模式
  AirConditionerDryerMode: { siid: 2, piid: 10 },
  // 睡眠模式
  AirConditionerSleepMode: { siid: 2, piid: 11 },
  // 风扇级别
  FanLevel: { siid: 3, piid: 2 },
  // 风扇摆动
  FanVerticalSwing: { siid: 3, piid: 4 },
  // 环境温度
  EnvironmentTemperature: { siid: 4, piid: 7 },
  // 提示声音
  Alarm: { siid: 5, piid: 1 },
  // 指示照明
  IndicatorLightSwitchStatus: { siid: 6, piid: 1 },
})

// 运行模式枚举
export enum AirConditionerModeCode { Cool = 2, Dry = 3, Fan = 4, Heat = 5}

// 风扇级别枚举
export enum FanLevelCode { Auto, Level1, Level2, Level3, Level4, Level5, Level6, Level7 }
export const FanLevelCodeVolumeMapping = {
  [FanLevelCode.Auto]: 0,
  [FanLevelCode.Level1]: 14,
  [FanLevelCode.Level2]: 28,
  [FanLevelCode.Level3]: 42,
  [FanLevelCode.Level4]: 56,
  [FanLevelCode.Level5]: 70,
  [FanLevelCode.Level6]: 84,
  [FanLevelCode.Level7]: 100,
}
