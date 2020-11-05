export const getDeviceId = (id: string) => {
  return id.replace(/miio:/, '')
}

export const sleep = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}
