export type ModelByFields<T extends string, K = any> = {
  [key in T]?: K
}
