export const OSs = ['android', 'ios'] as const
export const hashSalt = 8
export interface EmptyEnum<T = any> {
  [id: string]: T
}
