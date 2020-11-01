/// <reference path = "global.d.ts" />
import { Logging } from 'homebridge'
import miio, { DeviceInstance, Spec, SpecsGetQuery } from 'miio'
import { sleep } from './XiaoMiAirConditionMC5.utils'

export type MIoTDeviceIdentify = { name: string; token: string; address: string; }

enum ErrorMessages {
  NotConnect = 'Device not connected.',
  SpecNotFound = 'Spec not found.',
}

export default class MIoTDevice {

  // Basic Status
  protected device?: DeviceInstance
  private readonly identify: MIoTDeviceIdentify
  // Properties
  private specs: { [name: string]: Spec } = {}
  // Utils
  private readonly log: Logging

  constructor (identify: MIoTDeviceIdentify, logger: Logging) {
    this.identify = identify
    this.log = logger
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
      const device = await miio.device({
        address: this.identify.address,
        token: this.identify.token,
      })
      device.did = device.id.replace(/miio:/, '')
      this.device = device
      this.log(`${this.identify.name} ${this.identify.address} connected.`)
      return true
    } catch (e) {
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
}
