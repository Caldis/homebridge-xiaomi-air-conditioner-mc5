declare module 'miio' {
  // @see http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-conditioner:0000A004:xiaomi-mc5:1
  type Spec = { name: string; siid: number, piid: number }
  type Specs = Spec[]
  type SpecGetQuery = Spec & { did: string }
  type SpecsGetQuery = SpecGetQuery[]
  type SpecSetQuery = Spec & { did: string; value: any }
  type SpecsSetQuery = SpecSetQuery[]
  type SpecsResponse<T> = Spec & { did: string; value: T }

  class DeviceInstance {
    public id: string
    public did: string

    public miioCall<T extends any> (action: 'get_properties', specQuery: SpecsGetQuery): SpecsResponse<T>[]
    public miioCall<T extends any> (action: 'set_properties', specQuery: SpecsSetQuery): SpecsResponse<T>[]
  }

  class miio {
    static device: (args: { address: string; token: string }) => Promise<DeviceInstance>
  }

  export { Spec, Specs, SpecGetQuery, SpecsGetQuery, SpecSetQuery, SpecsSetQuery, DeviceInstance }
  export default miio
}
