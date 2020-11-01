"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoMiAirConditionMC5 = void 0;
const MIoTDevice_1 = __importDefault(require("./MIoTDevice"));
const XiaoMiAirConditionMC5_constant_1 = require("./XiaoMiAirConditionMC5.constant");
class XiaoMiAirConditionMC5 {
    constructor(hap, log, identify) {
        // DEBUG
        this.debug = false;
        this.registrySpecs = () => {
            Object.entries(XiaoMiAirConditionMC5_constant_1.AirConditioner).forEach(([_, spec]) => {
                this.device.addSpec(spec);
            });
            Object.entries(XiaoMiAirConditionMC5_constant_1.FanControl).forEach(([_, spec]) => {
                this.device.addSpec(spec);
            });
            Object.entries(XiaoMiAirConditionMC5_constant_1.Environment).forEach(([_, spec]) => {
                this.device.addSpec(spec);
            });
            Object.entries(XiaoMiAirConditionMC5_constant_1.Alarm).forEach(([_, spec]) => {
                this.device.addSpec(spec);
            });
            Object.entries(XiaoMiAirConditionMC5_constant_1.IndicatorLight).forEach(([_, spec]) => {
                this.device.addSpec(spec);
            });
        };
        this.registryCharacters = () => {
            this.characteristicsService.getCharacteristic(this.hap.Characteristic.Active)
                .on("get" /* GET */, async (callback) => {
                try {
                    const [SwitchStatus] = await this.device.getProperty(XiaoMiAirConditionMC5_constant_1.AirConditioner.SwitchStatus.name);
                    this.log('Characteristic.Active.GET');
                    this.log('AirConditioner.SwitchStatus', SwitchStatus);
                    callback(undefined, SwitchStatus.value ? 1 : 0);
                }
                catch (e) {
                    this.log('Characteristic.Active.GET.ERR', e);
                    callback(e);
                }
            })
                .on("set" /* SET */, async (value, callback) => {
                try {
                    await this.device.setProperty(XiaoMiAirConditionMC5_constant_1.AirConditioner.SwitchStatus.name, !!value);
                    this.log('Characteristic.Active.SET', value);
                    callback(undefined, value);
                }
                catch (e) {
                    this.log('Characteristic.Active.SET.ERR', e);
                    callback(e);
                }
            });
            this.characteristicsService.getCharacteristic(this.hap.Characteristic.CurrentHeaterCoolerState)
                .on("get" /* GET */, async (callback) => {
                try {
                    const [SwitchStatus, Mode] = await this.device.getProperty([
                        XiaoMiAirConditionMC5_constant_1.AirConditioner.SwitchStatus.name,
                        XiaoMiAirConditionMC5_constant_1.AirConditioner.Mode.name,
                    ]);
                    this.log('Characteristic.CurrentHeaterCoolerState.GET');
                    this.log('AirConditioner.SwitchStatus', SwitchStatus);
                    this.log('AirConditioner.Mode', Mode);
                    if (!SwitchStatus.value) {
                        callback(undefined, 0);
                    }
                    else {
                        callback(undefined, Mode.value === XiaoMiAirConditionMC5_constant_1.ModeCode.Heat ? 2 : 3);
                    }
                }
                catch (e) {
                    this.log('Characteristic.CurrentHeaterCoolerState.GET.ERR', e);
                    callback(e);
                }
            });
            this.characteristicsService.getCharacteristic(this.hap.Characteristic.TargetHeaterCoolerState)
                .on("get" /* GET */, async (callback) => {
                try {
                    const [SwitchStatus, Mode] = await this.device.getProperty([
                        XiaoMiAirConditionMC5_constant_1.AirConditioner.SwitchStatus.name,
                        XiaoMiAirConditionMC5_constant_1.AirConditioner.Mode.name,
                    ]);
                    this.log('Characteristic.CurrentHeaterCoolerState.GET');
                    this.log('AirConditioner.SwitchStatus', SwitchStatus);
                    this.log('AirConditioner.Mode', Mode);
                    if (!SwitchStatus.value) {
                        callback(undefined, 0);
                    }
                    else {
                        callback(undefined, Mode.value === XiaoMiAirConditionMC5_constant_1.ModeCode.Heat ? 1 : 2);
                    }
                }
                catch (e) {
                    this.log('Characteristic.CurrentHeaterCoolerState.GET.ERR', e);
                    callback(e);
                }
            })
                .on("set" /* SET */, async (value, callback) => {
                try {
                    await this.device.setProperty(XiaoMiAirConditionMC5_constant_1.AirConditioner.Mode.name, value === 1 ? XiaoMiAirConditionMC5_constant_1.ModeCode.Heat : XiaoMiAirConditionMC5_constant_1.ModeCode.Cool);
                    this.log('Characteristic.TargetHeaterCoolerState.SET', value);
                    callback(undefined, value);
                }
                catch (e) {
                    this.log('Characteristic.TargetHeaterCoolerState.SET.ERR', e);
                    callback(e);
                }
            });
            this.characteristicsService.getCharacteristic(this.hap.Characteristic.CurrentTemperature)
                .on("get" /* GET */, async (callback) => {
                try {
                    const [Temperature] = await this.device.getProperty([
                        XiaoMiAirConditionMC5_constant_1.Environment.Temperature.name,
                    ]);
                    this.log('Characteristic.CurrentTemperature.GET');
                    this.log('AirConditioner.Temperature', Temperature);
                    callback(undefined, Temperature.value);
                }
                catch (e) {
                    this.log('Characteristic.CurrentTemperature.GET.ERR', e);
                    callback(e);
                }
            });
            this.characteristicsService.getCharacteristic(this.hap.Characteristic.CoolingThresholdTemperature)
                .on("get" /* GET */, async (callback) => {
                try {
                    const [TargetTemperature] = await this.device.getProperty([
                        XiaoMiAirConditionMC5_constant_1.AirConditioner.TargetTemperature.name,
                    ]);
                    this.log('Characteristic.CoolingThresholdTemperature.GET');
                    this.log('AirConditioner.TargetTemperature', TargetTemperature);
                    callback(undefined, TargetTemperature.value);
                }
                catch (e) {
                    this.log('Characteristic.CoolingThresholdTemperature.GET.ERR', e);
                    callback(e);
                }
            })
                .on("set" /* SET */, async (value, callback) => {
                try {
                    await this.device.setProperty(XiaoMiAirConditionMC5_constant_1.AirConditioner.TargetTemperature.name, value);
                    this.log('Characteristic.CoolingThresholdTemperature.SET', value);
                    callback(undefined, value);
                }
                catch (e) {
                    this.log('Characteristic.CoolingThresholdTemperature.SET.ERR', e);
                    callback(e);
                }
            });
            this.characteristicsService.getCharacteristic(this.hap.Characteristic.HeatingThresholdTemperature)
                .on("get" /* GET */, async (callback) => {
                try {
                    const [TargetTemperature] = await this.device.getProperty([
                        XiaoMiAirConditionMC5_constant_1.AirConditioner.TargetTemperature.name,
                    ]);
                    this.log('Characteristic.HeatingThresholdTemperature.GET');
                    this.log('AirConditioner.TargetTemperature', TargetTemperature);
                    callback(undefined, TargetTemperature.value);
                }
                catch (e) {
                    this.log('Characteristic.HeatingThresholdTemperature.GET.ERR', e);
                    callback(e);
                }
            })
                .on("set" /* SET */, async (value, callback) => {
                try {
                    await this.device.setProperty(XiaoMiAirConditionMC5_constant_1.AirConditioner.TargetTemperature.name, value);
                    this.log('Characteristic.HeatingThresholdTemperature.SET', value);
                    callback(undefined, value);
                }
                catch (e) {
                    this.log('Characteristic.HeatingThresholdTemperature.SET.ERR', e);
                    callback(e);
                }
            });
            this.characteristicsService.getCharacteristic(this.hap.Characteristic.SwingMode)
                .on("get" /* GET */, async (callback) => {
                try {
                    const [VerticalSwing] = await this.device.getProperty([
                        XiaoMiAirConditionMC5_constant_1.FanControl.VerticalSwing.name,
                    ]);
                    this.log('Characteristic.SwingMode.GET');
                    this.log('FanControl.VerticalSwing', VerticalSwing);
                    callback(undefined, VerticalSwing.value ? 1 : 0);
                }
                catch (e) {
                    this.log('Characteristic.SwingMode.GET.ERR', e);
                    callback(e);
                }
            })
                .on("set" /* SET */, async (value, callback) => {
                try {
                    await this.device.setProperty(XiaoMiAirConditionMC5_constant_1.FanControl.VerticalSwing.name, value === 1);
                    this.log('Characteristic.SwingMode.SET', value);
                    callback(undefined, value);
                }
                catch (e) {
                    this.log('Characteristic.SwingMode.SET.ERR', e);
                    callback(e);
                }
            });
        };
        // Basic
        this.hap = hap;
        this.log = (...args) => this.debug && log(...args);
        this.name = identify.name;
        this.deviceIdentify = identify;
        // Register
        this.informationService = new this.hap.Service.AccessoryInformation()
            .setCharacteristic(this.hap.Characteristic.Manufacturer, 'XiaoMi')
            .setCharacteristic(this.hap.Characteristic.Model, 'MC5');
        // Characteristics Service
        this.characteristicsService = new this.hap.Service.HeaterCooler(this.deviceIdentify.name);
        // Init device
        this.device = new MIoTDevice_1.default(identify, log);
        this.registrySpecs();
        this.registryCharacters();
    }
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify() {
        this.log(`Identifying ${this.deviceIdentify.name} ${this.deviceIdentify.address}`);
    }
    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices() {
        return [
            this.informationService,
            this.characteristicsService,
        ];
    }
}
exports.XiaoMiAirConditionMC5 = XiaoMiAirConditionMC5;
//# sourceMappingURL=XiaoMiAirConditionMC5.js.map