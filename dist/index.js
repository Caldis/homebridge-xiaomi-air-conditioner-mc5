"use strict";
const XiaoMiAirConditionMC5_1 = require("./XiaoMiAirConditionMC5");
const PLATFORM_NAME = 'XiaoMiAirCondition';
let hap;
class Platform {
    constructor(logging, platformConfig, api) {
        this.log = logging;
        this.devices = platformConfig.devices;
        // Initialization log
        this.log.info(`${PLATFORM_NAME} platform is initialized`, platformConfig);
    }
    /*
     * This method is called to retrieve all accessories exposed by the platform.
     * The Platform can delay the response my invoking the callback at a later time,
     * it will delay the bridge startup though, so keep it to a minimum.
     * The set of exposed accessories CANNOT change over the lifetime of the plugin!
     */
    accessories(callback) {
        callback(this.devices.map(item => new XiaoMiAirConditionMC5_1.XiaoMiAirConditionMC5(hap, this.log, item)));
    }
}
module.exports = (api) => {
    hap = api.hap;
    api.registerPlatform(PLATFORM_NAME, Platform);
};
//# sourceMappingURL=index.js.map