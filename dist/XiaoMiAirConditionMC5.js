"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoMiAirConditionMC5 = void 0;
const MIoTDevice_1 = __importDefault(require("./MIoTDevice"));
const XiaoMiAirConditionMC5_constant_1 = require("./XiaoMiAirConditionMC5.constant");
class XiaoMiAirConditionMC5 {
    constructor(props) {
        this.registrySpecs = () => {
            Object.values(XiaoMiAirConditionMC5_constant_1.Specs).forEach(i => this.device.addSpec(i));
        };
        this.registryCharacters = () => {
            this.device.addCharacteristicListener(this.hap.Characteristic.Active, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerSwitchStatus.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerSwitchStatus.name,
                    formatter: (value) => value === 1
                },
            });
            this.device.addCharacteristicListener(this.hap.Characteristic.CurrentHeaterCoolerState, {
                get: {
                    formatter: (valueMapping) => {
                        if (!valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerSwitchStatus.name])
                            return 0;
                        return valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerMode.name] === XiaoMiAirConditionMC5_constant_1.AirConditionerModeCode.Heat ? 2 : 3;
                    }
                },
            });
            this.device.addCharacteristicListener(this.hap.Characteristic.TargetHeaterCoolerState, {
                get: {
                    formatter: (valueMapping) => {
                        if (!valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerSwitchStatus.name])
                            return 0;
                        return valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerMode.name] === XiaoMiAirConditionMC5_constant_1.AirConditionerModeCode.Heat ? 1 : 2;
                    }
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerMode.name,
                    formatter: (value) => value === 1 ? XiaoMiAirConditionMC5_constant_1.AirConditionerModeCode.Heat : XiaoMiAirConditionMC5_constant_1.AirConditionerModeCode.Cool
                },
            });
            this.device.addCharacteristicListener(this.hap.Characteristic.CurrentTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.EnvironmentTemperature.name]
                },
            });
            this.device.addCharacteristicListener(this.hap.Characteristic.CoolingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.device.addCharacteristicListener(this.hap.Characteristic.HeatingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.device.addCharacteristicListener(this.hap.Characteristic.SwingMode, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.FanVerticalSwing.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.FanVerticalSwing.name,
                    formatter: (value) => value === 1
                },
            });
        };
        // Requirement
        this.name = props.identify.name;
        this.token = props.identify.token;
        this.address = props.identify.address;
        // Foundation
        this.hap = props.hap;
        this.log = props.log;
        // Services
        this.informationService = new props.hap.Service.AccessoryInformation()
            .setCharacteristic(this.hap.Characteristic.Manufacturer, 'XiaoMi')
            .setCharacteristic(this.hap.Characteristic.Model, 'MC5');
        this.characteristicsService = new this.hap.Service.HeaterCooler(props.identify.name);
        // device
        this.device = new MIoTDevice_1.default({ ...props, characteristicsService: this.characteristicsService });
        // Registry
        this.registrySpecs();
        this.registryCharacters();
    }
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify() {
        this.log.info(`Identifying ${this.name} ${this.address}`);
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