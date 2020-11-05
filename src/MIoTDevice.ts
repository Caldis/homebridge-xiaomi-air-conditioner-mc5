import debounce from 'lodash.debounce'
import {
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP, Logging, Service,
} from 'homebridge'
import { getDeviceId, sleep } from './MIoTDevice.utils'
import miio, {
  DeviceInstance,
  Spec,
  SpecMapping,
  SpecsGetQuery,
  SpecsResponseValueMapping
} from 'miio'

export type MIoTDeviceIdentify = { name: string; token: string; address: string; }

type Props = {
  hap: HAP
  log: Logging
  identify: MIoTDeviceIdentify
  characteristicsService: Service
}
type RegisterConfig = {
  name?: string,
  get: { formatter: (valueMapping: SpecsResponseValueMapping) => any }
  set?: { formatter: (value: any) => any; property: string }
}
enum ErrorMessages {
  NotConnect = 'Device not connected.',
  SpecNotFound = 'Spec not found.',
}

const RE_CONNECT_THRESHOLD = 90000
const REQUEST_CONNECT_DEBOUNCE_THRESHOLD = 500
const REQUEST_PROPERTY_DEBOUNCE_THRESHOLD = 500

export default class MIoTDevice {

  // Requirement
  private readonly log: Logging
  private readonly hap: HAP
  private readonly characteristicsService: Service
  // Device
  private readonly identify: MIoTDeviceIdentify
  private device?: DeviceInstance
  private deviceConnectQueue: (() => void)[] = []
  // Properties
  private specs: SpecMapping = {}
  private specsQueue: ((valueMapping: SpecsResponseValueMapping) => void)[] = []

  constructor (props: Props) {
    // HomeBridge
    this.hap = props.hap
    this.log = props.log
    this.characteristicsService = props.characteristicsService
    // Device
    this.identify = props.identify
    // Connect
    ;(async () => this.connect())()
  }

  // Flags
  get isConnected () {
    const now = Date.now()
    const flag = !!this.device && (now - this.device.timeout < RE_CONNECT_THRESHOLD)
    if (!!this.device && flag) {
      this.device.timeout = now
    }
    return flag
  }

  // Connection
  private debounceRequestConnect = debounce(async () => {
    // Device
    try {
      this.log.info(`${this.identify.name} ${this.identify.address} start ${!!this.device ? 're-' : ''}connecting.`)
      // Pull queue
      const queue = [...this.deviceConnectQueue]
      this.deviceConnectQueue = []
      // Create miio device instance
      const device = await miio.device({
        address: this.identify.address,
        token: this.identify.token,
      })
      // Extract deviceId and attach to instance
      device.did = getDeviceId(device.id)
      device.timeout = Date.now()
      // Logger
      this.device = device
      queue.forEach(resolve => resolve())
      this.log.info(`${this.identify.name} ${this.identify.address} connected.`)
      return true
    } catch (e) {
      // Retry if failure
      if (!this.isConnected) {
        this.log.info(`${this.identify.name} ${this.identify.address} connect failure, reconnecting ...`, e)
        await sleep(5000)
        await this.connect()
      }
      return true
    }
  }, REQUEST_CONNECT_DEBOUNCE_THRESHOLD)
  private connect = async () => {
    return new Promise(resolve => {
      // Queue update
      this.deviceConnectQueue.push(resolve)
      // Trigger Property getter
      this.debounceRequestConnect()
    })
  }

  // Spec
  public addSpec = (spec: Spec) => {
    this.specs[spec.name] = spec
  }
  public getSpec = async (name?: string | string[]) => {
    // Guard
    if (!this.isConnected) await this.connect()
    if (!this.device?.did) throw new Error(ErrorMessages.NotConnect)
    const did = this.device.did
    // Action: getAll
    if (!name) return Object.values(this.specs).map(i => ({ ...i, did }))
    // Action: getByName
    const targetSpecs: SpecsGetQuery = []
    if (Array.isArray(name)) {
      name.forEach(i => {
        const spec = this.specs[i]
        if (spec) targetSpecs.push({ ...spec, did })
      })
    } else {
      const spec = this.specs[name]
      if (spec) targetSpecs.push({ ...spec, did })
    }
    return targetSpecs
  }

  // Properties
  public getProperty = async <T extends any> (name?: string | string[]) => {
    // Guard
    if (!this.isConnected) await this.connect()
    if (!this.device?.did) throw new Error(ErrorMessages.NotConnect)
    // Spec
    const targetSpecs = await this.getSpec(name)
    if (!Array.isArray(targetSpecs) || targetSpecs.length === 0) throw new Error(ErrorMessages.SpecNotFound)
    // Action
    return this.device.miioCall<T>('get_properties', targetSpecs)
  }
  // Merging request by debounce
  // When HomeBridge device is in initialization
  // multiple requests will be triggered in order to request the corresponding target value.
  // These fragmentation request will cause the MIoT device to refuse to response or weak performance
  // and cause the Accessory display "Not Response" in iOS Home app.
  private debounceRequestProperty = debounce(async () => {
    // Spec
    const targetSpecs = await this.getSpec()
    // Pull queue
    const queue = [...this.specsQueue]
    this.specsQueue = []
    // Get properties
    const properties = await this.device!.miioCall('get_properties', targetSpecs)
    const mapping = targetSpecs.reduce((acc, cur, idx) => ({
      ...acc,
      [cur.name]: properties[idx].value
    }), {} as SpecsResponseValueMapping)
    this.log.debug(`Merging request of ${this.identify.name} ${this.identify.address}`)
    queue.forEach(resolve => resolve(mapping))
  }, REQUEST_PROPERTY_DEBOUNCE_THRESHOLD)
  public setProperty = async <T extends any> (name: string, value: T) => {
    // Guard
    if (!this.isConnected) await this.connect()
    if (!this.device?.did) throw new Error(ErrorMessages.NotConnect)
    const did = this.device.did
    // Spec
    const targetSpec = this.specs[name]
    if (!targetSpec) throw new Error(ErrorMessages.SpecNotFound)
    // Action
    return this.device.miioCall<T>('set_properties', [Object.assign(targetSpec, { did, value })])
  }

  // Events
  private pullProperty = async (): Promise<SpecsResponseValueMapping> => {
    // Guard
    if (!this.isConnected) await this.connect()
    if (!this.device?.did) throw new Error(ErrorMessages.NotConnect)
    // Action
    return new Promise((resolve => {
      // Queue update
      this.specsQueue.push(resolve)
      // Trigger Property getter
      this.debounceRequestProperty()
    }))
  }
  public addCharacteristicListener(type: any, config: RegisterConfig) {
    const characteristic = this.characteristicsService.getCharacteristic(type)
    if ('get' in config) {
      characteristic.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          this.log.debug(`GET START ${type.name}`, Date.now())
          const property = await this.pullProperty()
          const propertyFormatted = config.get.formatter(property)
          this.log.debug(`GET SUCCESS ${type.name}`, propertyFormatted)
          callback(undefined, propertyFormatted)
        } catch (e) {
          this.log.error(`ERROR ${type.name}`, e)
          callback(e)
        }
      })
    }
    if ('set' in config) {
      const set = config.set
      if (set) {
        characteristic.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
          try {
            this.log.debug(`SET START ${type.name}`, Date.now())
            const valueFormatted = set.formatter(value)
            await this.setProperty(set.property, valueFormatted)
            this.log.debug(`SET SUCCESS ${type.name}`, valueFormatted)
            callback(undefined, value)
          } catch (e) {
            this.log.error(`ERROR ${type.name}`, e)
            callback(e)
          }
        })
      }
    }
  }
}
