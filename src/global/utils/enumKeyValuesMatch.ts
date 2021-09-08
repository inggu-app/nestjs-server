// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function enumKeyValuesMatch<T>(kv: { [K in keyof T]: K }) {
  return kv
}
