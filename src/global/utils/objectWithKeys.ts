export const objectWithKeys = <T extends string | number>(keys: T[], value: any = null) => {
  const object: any = {}
  keys.forEach(key => (object[key] = value))

  return object as { [key in T]: typeof value }
}
