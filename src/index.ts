import { DeviceConfigs } from 'miio'
import { XiaoMiAirConditionMC5 } from './XiaoMiAirConditionMC5'
import { AccessoryPlugin, API, HAP, Logging, PlatformConfig, StaticPlatformPlugin, } from 'homebridge'

const PLATFORM_NAME = 'XiaoMiAirConditionMC5'

export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, Platform)
}

class Platform implements StaticPlatformPlugin {

  private readonly hap: HAP
  private readonly log: Logging
  private readonly devices: DeviceConfigs

  constructor (logging: Logging, platformConfig: PlatformConfig, api: API) {
    this.hap = api.hap
    this.log = logging
    this.devices = platformConfig.devices
  }

  /*
   * This method is called to retrieve all accessories exposed by the platform.
   * The Platform can delay the response my invoking the callback at a later time,
   * it will delay the bridge startup though, so keep it to a minimum.
   * The set of exposed accessories CANNOT change over the lifetime of the plugin!
   */
  accessories (callback: (foundAccessories: AccessoryPlugin[]) => void): void {
    callback(this.devices.map(item =>
      new XiaoMiAirConditionMC5({
        hap: this.hap,
        log: this.log,
        identify: item,
      })
    ))
    this.log.info(`${PLATFORM_NAME} platform is initialized`)
  }
}
