// 特性信息
export const Specs = {
  // 启动状态
  AirConditionerSwitchStatus: { name: 'AirConditionerSwitchStatus', siid: 2, piid: 1 },
  // 运行模式
  AirConditionerMode: { name: 'AirConditionerMode', siid: 2, piid: 2 },
  // 目标温度
  AirConditionerTargetTemperature: { name: 'AirConditionerTargetTemperature', siid: 2, piid: 4 },
  // 节能模式
  AirConditionerECOMode: { name: 'AirConditionerECOMode', siid: 2, piid: 7 },
  // 制热模式
  AirConditionerHeaterMode: { name: 'AirConditionerHeaterMode', siid: 2, piid: 9 },
  // 除湿模式
  AirConditionerDryerMode: { name: 'AirConditionerDryerMode', siid: 2, piid: 10 },
  // 睡眠模式
  AirConditionerSleepMode: { name: 'AirConditionerSleepMode', siid: 2, piid: 11 },
  // 风扇级别
  FanLevel: { name: 'FanLevel', siid: 3, piid: 2 },
  // 风扇摆动
  FanVerticalSwing: { name: 'FanVerticalSwing', siid: 3, piid: 4 },
  // 环境温度
  EnvironmentTemperature: { name: 'EnvironmentTemperature', siid: 4, piid: 7 },
  // 提示声音
  Alarm: { name: 'Alarm', siid: 5, piid: 1 },
  // 指示照明
  IndicatorLightSwitchStatus: { name: 'IndicatorLightSwitchStatus', siid: 6, piid: 1 },
}

// 运行模式枚举
export enum AirConditionerModeCode { Cool = 2, Dry = 3, Fan = 4, Heat = 5}

// 风扇级别枚举
export enum FanLevelCode { Auto, Level1, Level2, Level3, Level4, Level5, Level6, Level7 }
