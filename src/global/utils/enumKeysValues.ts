import { objectKeys } from './objectKeys'

export const getEnumValues = <T>(e: T) => {
  return objectKeys(e).map(k => e[k])
}

export function enumKeyValuesMatch<T>(kv: { [K in keyof T]: K }) {
  return kv
}
