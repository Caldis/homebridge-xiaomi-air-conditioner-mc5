"use strict";
const device_1 = require("./device");
const homebridge_mi_devices_1 = require("homebridge-mi-devices");
const PLATFORM_NAME = 'XiaoMiAirConditionerMC5';
class Platform {
    constructor(logging, platformConfig, api) {
        // Foundation
        homebridge_mi_devices_1.initMiDevice({ hap: api.hap, log: logging });
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
        callback(this.devices.map(identify => new device_1.Device({ identify })));
        homebridge_mi_devices_1.Shared.log.info(`${PLATFORM_NAME} platform is initialized`);
    }
}
module.exports = (api) => {
    api.registerPlatform(PLATFORM_NAME, Platform);
};
//# sourceMappingURL=index.js.map