"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanLevelCode = exports.ModeCode = exports.IndicatorLight = exports.Alarm = exports.Environment = exports.FanControl = exports.AirConditioner = void 0;
// 空调信息
const XiaoMiAirConditionMC5_utils_1 = require("./XiaoMiAirConditionMC5.utils");
exports.AirConditioner = XiaoMiAirConditionMC5_utils_1.withNames({
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
}, 'AirConditioner');
// 风扇控制
exports.FanControl = XiaoMiAirConditionMC5_utils_1.withNames({
    // 风扇级别
    FanLevel: { siid: 3, piid: 2 },
    // 风扇摆动
    VerticalSwing: { siid: 3, piid: 4 },
}, 'FanControl');
// 环境传感
exports.Environment = XiaoMiAirConditionMC5_utils_1.withNames({
    // 环境温度
    Temperature: { siid: 4, piid: 7 },
}, 'Environment');
// 提示声音
exports.Alarm = XiaoMiAirConditionMC5_utils_1.withNames({
    // 提示声音
    Alarm: { siid: 5, piid: 1 },
}, 'Alarm');
// 指示照明
exports.IndicatorLight = XiaoMiAirConditionMC5_utils_1.withNames({
    // 指示照明
    SwitchStatus: { siid: 6, piid: 1 },
}, 'IndicatorLight');
// 运行模式代码
var ModeCode;
(function (ModeCode) {
    ModeCode[ModeCode["Cool"] = 2] = "Cool";
    ModeCode[ModeCode["Dry"] = 3] = "Dry";
    ModeCode[ModeCode["Fan"] = 4] = "Fan";
    ModeCode[ModeCode["Heat"] = 5] = "Heat";
})(ModeCode = exports.ModeCode || (exports.ModeCode = {}));
// 风扇级别代码
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
//# sourceMappingURL=XiaoMiAirConditionMC5.constant.js.map