"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanLevelCode = exports.AirConditionerModeCode = exports.Specs = void 0;
// 特性信息
exports.Specs = {
    // 启动状态
    AirConditionerSwitchStatus: { name: 'AirConditionerSwitchStatus', siid: 2, piid: 1 },
    // 运行模式
    AirConditionerMode: { name: 'AirConditionerMode', siid: 2, piid: 2 },
    // 目标温度
    AirConditionerTargetTemperature: { name: 'AirConditionerMode', siid: 2, piid: 4 },
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
};
// 运行模式枚举
var AirConditionerModeCode;
(function (AirConditionerModeCode) {
    AirConditionerModeCode[AirConditionerModeCode["Cool"] = 2] = "Cool";
    AirConditionerModeCode[AirConditionerModeCode["Dry"] = 3] = "Dry";
    AirConditionerModeCode[AirConditionerModeCode["Fan"] = 4] = "Fan";
    AirConditionerModeCode[AirConditionerModeCode["Heat"] = 5] = "Heat";
})(AirConditionerModeCode = exports.AirConditionerModeCode || (exports.AirConditionerModeCode = {}));
// 风扇级别枚举
var FanLevelCode;
(function (FanLevelCode) {
    FanLevelCode[FanLevelCode["Auto"] = 0] = "Auto";
    FanLevelCode[FanLevelCode["Level1"] = 1] = "Level1";
    FanLevelCode[FanLevelCode["Level2"] = 2] = "Level2";
    FanLevelCode[FanLevelCode["Level3"] = 3] = "Level3";
    FanLevelCode[FanLevelCode["Level4"] = 4] = "Level4";
    FanLevelCode[FanLevelCode["Level5"] = 5] = "Level5";
    FanLevelCode[FanLevelCode["Level6"] = 6] = "Level6";
    FanLevelCode[FanLevelCode["Level7"] = 7] = "Level7";
})(FanLevelCode = exports.FanLevelCode || (exports.FanLevelCode = {}));
//# sourceMappingURL=XiaoMiAirConditionerMC5.constant.js.map