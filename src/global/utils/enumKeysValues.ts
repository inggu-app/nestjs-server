import { objectKeys } from './objectKeys'

export const getEnumValues = <T>(e: T) => {
  return objectKeys(e).map(k => e[k])
}
