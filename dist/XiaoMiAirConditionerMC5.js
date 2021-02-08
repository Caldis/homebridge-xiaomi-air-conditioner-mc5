"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoMiAirConditionerMC5 = void 0;
const XiaoMiAirConditionerMC5_constant_1 = require("./XiaoMiAirConditionerMC5.constant");
const homebridge_mi_devices_1 = require("homebridge-mi-devices");
class XiaoMiAirConditionerMC5 {
    constructor(props) {
        this.AirConditionerSetup = () => {
            this.AirConditionerDevice.addSpec(XiaoMiAirConditionerMC5_constant_1.Specs);
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.Active, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSwitchStatus.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSwitchStatus.name,
                    formatter: (value) => value === 1
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.CurrentHeaterCoolerState, {
                get: {
                    formatter: (valueMapping) => {
                        if (!valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSwitchStatus.name])
                            return 0;
                        return valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerMode.name] === XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Heat ? 2 : 3;
                    }
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.TargetHeaterCoolerState, {
                get: {
                    formatter: (valueMapping) => {
                        if (!valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSwitchStatus.name])
                            return 0;
                        return valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerMode.name] === XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Heat ? 1 : 2;
                    }
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerMode.name,
                    formatter: (value) => value === 1 ? XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Heat : XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Cool
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.CurrentTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.EnvironmentTemperature.name]
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.CoolingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.HeatingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.SwingMode, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.FanVerticalSwing.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.FanVerticalSwing.name,
                    formatter: (value) => value === 1
                },
            });
        };
        // Requirement
        this.name = props.identify.name;
        this.token = props.identify.token;
        this.address = props.identify.address;
        // Information
        this.informationService = new homebridge_mi_devices_1.SharedFoundation.hap.Service.AccessoryInformation()
            .setCharacteristic(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.Manufacturer, 'XiaoMi')
            .setCharacteristic(homebridge_mi_devices_1.SharedFoundation.hap.Characteristic.Model, 'MC5');
        // AirConditioner
        const AirConditionerName = props.identify.name;
        this.AirConditionerService = new homebridge_mi_devices_1.SharedFoundation.hap.Service.HeaterCooler(AirConditionerName);
        this.AirConditionerDevice = new homebridge_mi_devices_1.MIoTDevice({ ...props, characteristicsName: AirConditionerName, characteristicsService: this.AirConditionerService });
        this.AirConditionerSetup();
    }
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify() {
        homebridge_mi_devices_1.SharedFoundation.log.info(`Identifying ${this.name} ${this.address}`);
    }
    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices() {
        return [
            this.informationService,
            this.AirConditionerService,
        ];
    }
}
exports.XiaoMiAirConditionerMC5 = XiaoMiAirConditionerMC5;
//# sourceMappingURL=XiaoMiAirConditionerMC5.js.map