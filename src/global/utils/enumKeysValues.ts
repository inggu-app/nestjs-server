export function enumKeyValuesMatch<T>(kv: { [K in keyof T]: K }) {
  return kv
}
