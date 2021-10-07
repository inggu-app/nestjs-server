export const objectKeys = <T extends Record<string, unknown>>(object: T): (keyof T)[] => {
  return Object.keys(object) as Array<keyof typeof object>
}
