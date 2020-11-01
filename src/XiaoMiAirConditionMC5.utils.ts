import { Spec } from 'miio'

export const withNames = (value: Object, prefix?: string) => {
  return Object.entries(value).reduce((acc, [name, value]) => {
    return Object.assign(acc, {
      [name]: {
        name: prefix ? `${prefix}.${name}` : name,
        ...value
      }
    })
  }, {} as { [name: string]: Spec })
}

export const sleep = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}
