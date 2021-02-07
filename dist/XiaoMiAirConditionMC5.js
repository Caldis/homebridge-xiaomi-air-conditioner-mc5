"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoMiAirConditionMC5 = void 0;
const XiaoMiAirConditionMC5_constant_1 = require("./XiaoMiAirConditionMC5.constant");
const homebridge_miot_devices_1 = require("homebridge-miot-devices");
class XiaoMiAirConditionMC5 {
    constructor(props) {
        this.AirConditionSetup = () => {
            this.AirConditionDevice.addMIoTSpec(XiaoMiAirConditionMC5_constant_1.Specs);
            this.AirConditionDevice.addMIoTCharacteristicListener(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.Active, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerSwitchStatus.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerSwitchStatus.name,
                    formatter: (value) => value === 1
                },
            });
            this.AirConditionDevice.addMIoTCharacteristicListener(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.CurrentHeaterCoolerState, {
                get: {
                    formatter: (valueMapping) => {
                        if (!valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerSwitchStatus.name])
                            return 0;
                        return valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerMode.name] === XiaoMiAirConditionMC5_constant_1.AirConditionerModeCode.Heat ? 2 : 3;
                    }
                },
            });
            this.AirConditionDevice.addMIoTCharacteristicListener(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.TargetHeaterCoolerState, {
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
            this.AirConditionDevice.addMIoTCharacteristicListener(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.CurrentTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.EnvironmentTemperature.name]
                },
            });
            this.AirConditionDevice.addMIoTCharacteristicListener(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.CoolingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.AirConditionDevice.addMIoTCharacteristicListener(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.HeatingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.AirConditionDevice.addMIoTCharacteristicListener(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.SwingMode, {
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
        // Information
        this.informationService = new homebridge_miot_devices_1.SharedFoundation.hap.Service.AccessoryInformation()
            .setCharacteristic(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.Manufacturer, 'XiaoMi')
            .setCharacteristic(homebridge_miot_devices_1.SharedFoundation.hap.Characteristic.Model, 'MC5');
        // AirCondition
        this.AirConditionService = new homebridge_miot_devices_1.SharedFoundation.hap.Service.HeaterCooler(props.identify.name);
        this.AirConditionDevice = new homebridge_miot_devices_1.MIoTDevice({ ...props, characteristicsService: this.AirConditionService });
        this.AirConditionSetup();
    }
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify() {
        homebridge_miot_devices_1.SharedFoundation.log.info(`Identifying ${this.name} ${this.address}`);
    }
    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices() {
        return [
            this.informationService,
            this.AirConditionService,
        ];
    }
}
exports.XiaoMiAirConditionMC5 = XiaoMiAirConditionMC5;
//# sourceMappingURL=XiaoMiAirConditionMC5.js.map