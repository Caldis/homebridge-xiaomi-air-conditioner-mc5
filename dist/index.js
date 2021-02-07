"use strict";
const XiaoMiAirConditionMC5_1 = require("./XiaoMiAirConditionMC5");
const homebridge_miot_devices_1 = require("homebridge-miot-devices");
const PLATFORM_NAME = 'XiaoMiAirConditionMC5';
class Platform {
    constructor(logging, platformConfig, api) {
        // Foundation
        homebridge_miot_devices_1.initMIoT({ hap: api.hap, log: logging, config: platformConfig.devices });
        // Devices
        this.devices = platformConfig.devices;
    }
    /*
     * This method is called to retrieve all accessories exposed by the platform.
     * The Platform can delay the response my invoking the callback at a later time,
     * it will delay the bridge startup though, so keep it to a minimum.
     * The set of exposed accessories CANNOT change over the lifetime of the plugin!
     */
    accessories(callback) {
        callback(this.devices.map(identify => new XiaoMiAirConditionMC5_1.XiaoMiAirConditionMC5({ identify })));
        homebridge_miot_devices_1.SharedFoundation.log.info(`${PLATFORM_NAME} platform is initialized`);
    }
}
module.exports = (api) => {
    api.registerPlatform(PLATFORM_NAME, Platform);
};
//# sourceMappingURL=index.js.map