// 空调信息
import { withNames } from './XiaoMiAirConditionMC5.utils'

export const AirConditioner = withNames({
  // 启动状态
  SwitchStatus: { siid: 2, piid: 1 },
  // 运行模式
  Mode: { siid: 2, piid: 2 },
  // 目标温度
  TargetTemperature: { siid: 2, piid: 4 },
  // 节能模式
  ECOMode: { siid: 2, piid: 7 },
  // 制热模式
  HeaterMode: { siid: 2, piid: 9 },
  // 除湿模式
  DryerMode: { siid: 2, piid: 10 },
  // 睡眠模式
  SleepMode: { siid: 2, piid: 11 },
}, 'AirConditioner')

// 风扇控制
export const FanControl = withNames({
  // 风扇级别
  FanLevel: { siid: 3, piid: 2 },
  // 风扇摆动
  VerticalSwing: { siid: 3, piid: 4 },
}, 'FanControl')

// 环境传感
export const Environment = withNames({
  // 环境温度
  Temperature: { siid: 4, piid: 7 },
}, 'Environment')

// 提示声音
export const Alarm = withNames({
  // 提示声音
  Alarm: { siid: 5, piid: 1 },
}, 'Alarm')

// 指示照明
export const IndicatorLight = withNames({
  // 指示照明
  SwitchStatus: { siid: 6, piid: 1 },
}, 'IndicatorLight')

// 运行模式代码
export enum ModeCode { Cool = 2, Dry = 3, Fan = 4, Heat = 5}

// 风扇级别代码
export enum FanLevelCode { Auto, Level1, Level2, Level3, Level4, Level5, Level6, Level7 }
