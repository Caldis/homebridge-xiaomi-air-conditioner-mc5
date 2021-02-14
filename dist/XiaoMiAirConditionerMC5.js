"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoMiAirConditionerMC5 = void 0;
const XiaoMiAirConditionerMC5_constant_1 = require("./XiaoMiAirConditionerMC5.constant");
const homebridge_mi_devices_1 = require("homebridge-mi-devices");
class XiaoMiAirConditionerMC5 {
    constructor(props) {
        this.AirConditionerSetup = () => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.Active, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSwitchStatus.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSwitchStatus.name,
                    formatter: (value) => value === 1
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, {
                get: {
                    formatter: (valueMapping) => {
                        if (!valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSwitchStatus.name])
                            return 1;
                        return valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerMode.name] === XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Heat ? 2 : 3;
                    }
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.TargetHeaterCoolerState, {
                get: {
                    formatter: (valueMapping) => {
                        switch (valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerMode.name]) {
                            case XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Fan:
                                this.AirConditionerService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, 1);
                                return 0;
                            case XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Heat:
                                this.AirConditionerService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, 2);
                                return 1;
                            case XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Cool:
                                this.AirConditionerService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, 3);
                                return 2;
                        }
                        return 0;
                    }
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerMode.name,
                    formatter: (value) => {
                        switch (value) {
                            case 0:
                                this.AirConditionerECOModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                this.AirConditionerHeaterModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                this.AirConditionerDryerModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                this.AirConditionerSleepModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                return XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Fan;
                            case 1:
                                this.AirConditionerECOModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                this.AirConditionerHeaterModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 1);
                                this.AirConditionerDryerModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                this.AirConditionerSleepModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                return XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Heat;
                            case 2:
                                this.AirConditionerECOModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                this.AirConditionerHeaterModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                // this.AirConditionerDryerModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                this.AirConditionerSleepModeService.updateCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.On, 0);
                                return XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Cool;
                        }
                        return XiaoMiAirConditionerMC5_constant_1.AirConditionerModeCode.Fan;
                    }
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.EnvironmentTemperature.name]
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.CoolingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.HeatingThresholdTemperature, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.SwingMode, {
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.FanVerticalSwing.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.FanVerticalSwing.name,
                    formatter: (value) => value === 1
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.RotationSpeed, {
                get: {
                    formatter: (valueMapping) => {
                        return XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.FanLevel.name]];
                    }
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.FanLevel.name,
                    formatter: (value) => {
                        if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Auto]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Auto;
                        }
                        else if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level1]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level1;
                        }
                        else if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level2]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level2;
                        }
                        else if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level3]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level3;
                        }
                        else if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level4]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level4;
                        }
                        else if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level5]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level5;
                        }
                        else if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level6]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level6;
                        }
                        else if (value <= XiaoMiAirConditionerMC5_constant_1.FanLevelCodeVolumeMapping[XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level7]) {
                            return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Level7;
                        }
                        return XiaoMiAirConditionerMC5_constant_1.FanLevelCode.Auto;
                    }
                },
            });
        };
        this.AirConditionerECOModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerECOMode.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerECOMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerHeaterModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerHeaterMode.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerHeaterMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerDryerModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerDryerMode.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerDryerMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerSleepModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSleepMode.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.AirConditionerSleepMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerAlarmSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.Alarm.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.Alarm.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerIndicatorLightSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    formatter: (valueMapping) => valueMapping[XiaoMiAirConditionerMC5_constant_1.Specs.IndicatorLightSwitchStatus.name] ? 1 : 0
                },
                set: {
                    property: XiaoMiAirConditionerMC5_constant_1.Specs.IndicatorLightSwitchStatus.name,
                    formatter: (value) => !!value
                },
            });
        };
        // Requirement
        this.name = props.identify.name;
        this.token = props.identify.token;
        this.address = props.identify.address;
        // Information
        this.informationService = new homebridge_mi_devices_1.Shared.hap.Service.AccessoryInformation()
            .setCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.Category, 21 /* AIR_CONDITIONER */)
            .setCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.Manufacturer, 'XiaoMi')
            .setCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.Model, 'MC5');
        // AirConditioner
        this.AirConditionerService = new homebridge_mi_devices_1.Shared.hap.Service.HeaterCooler(props.identify.name);
        this.AirConditionerDevice = new homebridge_mi_devices_1.MIoTDevice({ ...props, service: this.AirConditionerService, specs: XiaoMiAirConditionerMC5_constant_1.Specs });
        this.AirConditionerSetup();
        // AirConditioner: Extra Modes
        this.AirConditionerECOModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`${props.identify.name}.ECOMode`, 'ECOMode');
        this.AirConditionerECOModeSetup(this.AirConditionerECOModeService);
        this.AirConditionerHeaterModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`${props.identify.name}.HeaterMode`, 'HeaterMode');
        this.AirConditionerHeaterModeSetup(this.AirConditionerHeaterModeService);
        this.AirConditionerDryerModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`${props.identify.name}.DryerMode`, 'DryerMode');
        this.AirConditionerDryerModeSetup(this.AirConditionerDryerModeService);
        this.AirConditionerSleepModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`${props.identify.name}.SleepMode`, 'SleepMode');
        this.AirConditionerSleepModeSetup(this.AirConditionerSleepModeService);
        this.AirConditionerSleepModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`${props.identify.name}.SleepMode`, 'SleepMode');
        this.AirConditionerSleepModeSetup(this.AirConditionerSleepModeService);
        // AirConditioner: Sound & Light
        this.AirConditionerAlarmService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`${props.identify.name}.Alarm`, 'Alarm');
        this.AirConditionerAlarmSetup(this.AirConditionerAlarmService);
        this.AirConditionerIndicatorLightService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`${props.identify.name}.IndicatorLight`, 'IndicatorLight');
        this.AirConditionerIndicatorLightSetup(this.AirConditionerIndicatorLightService);
    }
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify() {
        homebridge_mi_devices_1.Shared.log.info(`Identifying ${this.name} ${this.address}`);
    }
    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices() {
        return [
            this.informationService,
            this.AirConditionerService,
            this.AirConditionerECOModeService,
            this.AirConditionerHeaterModeService,
            this.AirConditionerDryerModeService,
            this.AirConditionerSleepModeService,
            this.AirConditionerAlarmService,
            this.AirConditionerIndicatorLightService,
        ];
    }
}
exports.XiaoMiAirConditionerMC5 = XiaoMiAirConditionerMC5;
//# sourceMappingURL=XiaoMiAirConditionerMC5.js.map