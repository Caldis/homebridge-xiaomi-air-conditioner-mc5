import { XiaoMiAirConditionerMC5 } from './XiaoMiAirConditionerMC5'
import { AccessoryPlugin, API, Logging, PlatformConfig, StaticPlatformPlugin, } from 'homebridge'
import { DeviceConfigs, initMiDevice, Shared } from 'homebridge-mi-devices'

const PLATFORM_NAME = 'XiaoMiAirConditionerMC5'

export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, Platform)
}

class Platform implements StaticPlatformPlugin {

  private readonly devices: DeviceConfigs

  constructor (logging: Logging, platformConfig: PlatformConfig, api: API) {
    // Foundation
    initMiDevice({ hap: api.hap, log: logging })
    // Devices
    this.devices = platformConfig.devices
  }

  /*
   * This method is called to retrieve all accessories exposed by the platform.
   * The Platform can delay the response my invoking the callback at a later time,
   * it will delay the bridge startup though, so keep it to a minimum.
   * The set of exposed accessories CANNOT change over the lifetime of the plugin!
   */
  accessories (callback: (foundAccessories: AccessoryPlugin[]) => void): void {
    callback(this.devices.map(identify => new XiaoMiAirConditionerMC5({ identify })))
    Shared.log.info(`${PLATFORM_NAME} platform is initialized`)
  }
}
