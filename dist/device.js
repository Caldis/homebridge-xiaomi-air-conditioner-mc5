"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const device_constant_1 = require("./device.constant");
const homebridge_mi_devices_1 = require("homebridge-mi-devices");
class Device {
    constructor(props) {
        this.AirConditionerSetup = () => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.Active, {
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.AirConditionerSwitchStatus.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerSwitchStatus.name,
                    formatter: (value) => value === 1
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, {
                get: {
                    defaultValue: 1,
                    formatter: (valueMapping) => {
                        if (!valueMapping[device_constant_1.Specs.AirConditionerSwitchStatus.name])
                            return 1;
                        return valueMapping[device_constant_1.Specs.AirConditionerMode.name] === device_constant_1.AirConditionerModeCode.Heat ? 2 : 3;
                    }
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.TargetHeaterCoolerState, {
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => {
                        switch (valueMapping[device_constant_1.Specs.AirConditionerMode.name]) {
                            case device_constant_1.AirConditionerModeCode.Fan:
                                return 0;
                            case device_constant_1.AirConditionerModeCode.Heat:
                                return 1;
                            case device_constant_1.AirConditionerModeCode.Cool:
                                return 2;
                        }
                        return 0;
                    }
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerMode.name,
                    formatter: (value) => {
                        switch (value) {
                            case 0:
                                this.AirConditionerService.setCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, 1);
                                break;
                            case 1:
                                this.AirConditionerService.setCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, 2);
                                break;
                            case 2:
                                this.AirConditionerService.setCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentHeaterCoolerState, 3);
                                break;
                        }
                        switch (value) {
                            case 0:
                                // this.AirConditionerECOModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                // this.AirConditionerHeaterModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                // this.AirConditionerDryerModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                // this.AirConditionerSleepModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                return device_constant_1.AirConditionerModeCode.Fan;
                            case 1:
                                // this.AirConditionerECOModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                // this.AirConditionerHeaterModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0) // 关电辅热
                                // this.AirConditionerDryerModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                // this.AirConditionerSleepModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                return device_constant_1.AirConditionerModeCode.Heat;
                            case 2:
                                // this.AirConditionerECOModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                // this.AirConditionerHeaterModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0) // 关电辅热
                                // this.AirConditionerDryerModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                // this.AirConditionerSleepModeService.updateCharacteristic(Shared.hap.Characteristic.On, 0)
                                return device_constant_1.AirConditionerModeCode.Cool;
                        }
                        return device_constant_1.AirConditionerModeCode.Fan; // 默認吹風
                    }
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.CurrentTemperature, {
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.EnvironmentTemperature.name]
                },
            });
            // 制冷上限
            // @see https://github.com/apple/HomeKitADK/blob/master/HAP/HAPCharacteristicTypes.h
            // 该特性描述了支持同时加热和冷却的附件的冷却阈值，单位为摄氏度。该特性的值表示在开启冷却之前必须达到的最高温度。
            // 例如，如果 "目标加热冷却状态 "被设置为 "自动"，并且当前温度超过了最高温度，那么冷却机制应该开启，以降低当前温度，直到达到最低温度。
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.CoolingThresholdTemperature, {
                get: {
                    defaultValue: 25,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            // 制热下限
            // @see https://github.com/apple/HomeKitADK/blob/master/HAP/HAPCharacteristicTypes.h
            // 该特性描述了支持同时加热和冷却的附件的加热阈值，单位为摄氏度。这个特性的值表示在开启加热之前必须达到的最低温度。
            // 例如，如果 "目标加热冷却状态 "被设置为 "自动"，并且当前温度低于最低温度，那么加热机制应该打开以提高当前温度，直到达到最低温度。
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.HeatingThresholdTemperature, {
                get: {
                    defaultValue: 25,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.AirConditionerTargetTemperature.name]
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerTargetTemperature.name,
                    formatter: (value) => value
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.SwingMode, {
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.FanVerticalSwing.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.FanVerticalSwing.name,
                    formatter: (value) => value === 1
                },
            });
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.RotationSpeed, {
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => {
                        return device_constant_1.FanLevelCodeVolumeMapping[valueMapping[device_constant_1.Specs.FanLevel.name]];
                    }
                },
                set: {
                    property: device_constant_1.Specs.FanLevel.name,
                    formatter: (value) => {
                        if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Auto]) {
                            return device_constant_1.FanLevelCode.Auto;
                        }
                        else if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Level1]) {
                            return device_constant_1.FanLevelCode.Level1;
                        }
                        else if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Level2]) {
                            return device_constant_1.FanLevelCode.Level2;
                        }
                        else if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Level3]) {
                            return device_constant_1.FanLevelCode.Level3;
                        }
                        else if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Level4]) {
                            return device_constant_1.FanLevelCode.Level4;
                        }
                        else if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Level5]) {
                            return device_constant_1.FanLevelCode.Level5;
                        }
                        else if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Level6]) {
                            return device_constant_1.FanLevelCode.Level6;
                        }
                        else if (value <= device_constant_1.FanLevelCodeVolumeMapping[device_constant_1.FanLevelCode.Level7]) {
                            return device_constant_1.FanLevelCode.Level7;
                        }
                        return device_constant_1.FanLevelCode.Auto;
                    }
                },
            });
        };
        this.AirConditionerECOModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.AirConditionerECOMode.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerECOMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerHeaterModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.AirConditionerHeaterMode.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerHeaterMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerDryerModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.AirConditionerDryerMode.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerDryerMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerSleepModeSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.AirConditionerSleepMode.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.AirConditionerSleepMode.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerAlarmSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.Alarm.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.Alarm.name,
                    formatter: (value) => !!value
                },
            });
        };
        this.AirConditionerIndicatorLightSetup = (service) => {
            this.AirConditionerDevice.addCharacteristicListener(homebridge_mi_devices_1.Shared.hap.Characteristic.On, {
                service,
                get: {
                    defaultValue: 0,
                    formatter: (valueMapping) => valueMapping[device_constant_1.Specs.IndicatorLightSwitchStatus.name] ? 1 : 0
                },
                set: {
                    property: device_constant_1.Specs.IndicatorLightSwitchStatus.name,
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
        this.AirConditionerDevice = new homebridge_mi_devices_1.MIoTDevice({ ...props, service: this.AirConditionerService, specs: device_constant_1.Specs });
        this.AirConditionerSetup();
        // AirConditioner: Extra Modes
        this.AirConditionerECOModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`ECOMode`, 'ECOMode');
        this.AirConditionerECOModeService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.ConfiguredName).updateValue('ECOMode');
        this.AirConditionerECOModeSetup(this.AirConditionerECOModeService);
        this.AirConditionerHeaterModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`HeaterMode`, 'HeaterMode');
        this.AirConditionerHeaterModeService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.ConfiguredName).updateValue('HeaterMode');
        this.AirConditionerHeaterModeSetup(this.AirConditionerHeaterModeService);
        this.AirConditionerDryerModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`DryerMode`, 'DryerMode');
        this.AirConditionerDryerModeService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.ConfiguredName).updateValue('DryerMode');
        this.AirConditionerDryerModeSetup(this.AirConditionerDryerModeService);
        this.AirConditionerSleepModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`SleepMode`, 'SleepMode');
        this.AirConditionerSleepModeService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.ConfiguredName).updateValue('SleepMode');
        this.AirConditionerSleepModeSetup(this.AirConditionerSleepModeService);
        this.AirConditionerSleepModeService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`SleepMode`, 'SleepMode');
        this.AirConditionerSleepModeService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.ConfiguredName).updateValue('SleepMode');
        this.AirConditionerSleepModeSetup(this.AirConditionerSleepModeService);
        // AirConditioner: Sound & Light
        this.AirConditionerAlarmService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`Alarm`, 'Alarm');
        this.AirConditionerAlarmService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.ConfiguredName).updateValue('Alarm');
        this.AirConditionerAlarmSetup(this.AirConditionerAlarmService);
        this.AirConditionerIndicatorLightService = new homebridge_mi_devices_1.Shared.hap.Service.Switch(`IndicatorLight`, 'IndicatorLight');
        this.AirConditionerIndicatorLightService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.ConfiguredName).updateValue('IndicatorLight');
        this.AirConditionerIndicatorLightSetup(this.AirConditionerIndicatorLightService);
        // AirConditioner: Threshold
        // 某个版本之后 HomeBridge 调整了 HeatingThresholdTemperature 的上下限, Max 仅能到 25, 这里需要重写其上下限, 顺带设置 step
        // @see https://developers.homebridge.io/#/api/characteristics#characteristicsetprops
        this.AirConditionerService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.CoolingThresholdTemperature).setProps({
            minValue: 16,
            maxValue: 31,
            minStep: 0.5,
        });
        this.AirConditionerService.getCharacteristic(homebridge_mi_devices_1.Shared.hap.Characteristic.HeatingThresholdTemperature).setProps({
            minValue: 16,
            maxValue: 31,
            minStep: 0.5,
        });
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
exports.Device = Device;
//# sourceMappingURL=device.js.map