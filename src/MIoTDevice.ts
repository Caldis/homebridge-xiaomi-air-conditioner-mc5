/// <reference path = "global.d.ts" />
import {
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP, Logging, Service,
} from 'homebridge'
import { sleep } from './MIoTDevice.utils'
import miio, { DeviceInstance, Spec, SpecsGetQuery } from 'miio'

export type MIoTDeviceIdentify = { name: string; token: string; address: string; }

type Props = {
  hap: HAP
  log: Logging
  characteristicsService: Service
  identify: MIoTDeviceIdentify
}
type RegisterConfig = {
  get: { properties: string[]; formatter: (value: { [property: string]: any }) => any }
  set: { property: string; formatter: (value: any) => any }
}
enum ErrorMessages {
  NotConnect = 'Device not connected.',
  SpecNotFound = 'Spec not found.',
}

export default class MIoTDevice {

  // Requirement
  private readonly log: Logging
  private readonly hap: HAP
  private readonly characteristicsService: Service
  // Device
  private readonly identify: MIoTDeviceIdentify
  protected device?: DeviceInstance
  // Properties
  private specs: { [name: string]: Spec } = {}

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
    return !!this.device
  }

  // Connection
  private connect = async () => {
    // Device
    try {
      // Create miio device instance
      const device = await miio.device({
        address: this.identify.address,
        token: this.identify.token,
      })
      // Extract deviceId and attach to instance
      device.did = device.id.replace(/miio:/, '')
      // Logger
      this.device = device
      this.log(`${this.identify.name} ${this.identify.address} connected.`)
      return true
    } catch (e) {
      // Retry if failure
      if (!this.isConnected) {
        this.log(`${this.identify.name} ${this.identify.address} connect failure, reconnecting ...`, e)
        await sleep(5000)
        await this.connect()
      }
      return true
    }
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
    // Action
    if (!name) return Object.values(this.specs).map(i => ({ ...i, did }))
    const targetSpecs: SpecsGetQuery = []
    if (Array.isArray(name)) {
      name.forEach(i => {
        const spec = this.specs[i]
        if (spec) targetSpecs.push({ ...spec, did })
      })
    } else {
      const spec = this.specs[name]
      if (spec) {
        targetSpecs.push({ ...spec, did })
      }
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
  private pullProperty = async <T extends any> (name?: string | string[]) => {

  }
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
  public addCharacteristicListener(type: any, config: RegisterConfig) {
    const characteristic = this.characteristicsService.getCharacteristic(type)
    if ('get' in config) {
      characteristic.on(CharacteristicEventTypes.GET, async (callback: CharacteristicGetCallback) => {
        try {
          const res = await this.getProperty(config.get.properties)
          const resMapped = config.get.formatter(res.reduce((acc, cur, idx) => (
            { acc, [config.get.properties[idx]]: cur.value }
          ), {} as { [property: string]: any }))
          const resFormatted = config.get.formatter(resMapped)
          this.log(`${config.get.properties} GET`, resMapped)
          callback(undefined, resFormatted)
        } catch (e) {
          this.log(`${config.get.properties} ERROR`, e)
          callback(e)
        }
      })
    }
    if ('set' in config) {
      characteristic.on(CharacteristicEventTypes.SET, async (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        try {
          const valueFormatted = config.set.formatter(value)
          await this.setProperty(config.set.property, valueFormatted)
          this.log(`${config.set.property} SET`, value, valueFormatted)
          callback(undefined, value)
        } catch (e) {
          this.log(`${config.set.property} ERROR`, e)
          callback(e)
        }
      })
    }
  }
}
