import { Types } from 'mongoose'

export type DeviceId = string

export interface ModelBase {
  _id: Types.ObjectId
}

export interface CustomModelBase {
  id: Types.ObjectId
}

export type ObjectByInterface<T, F = any, K = any> = Partial<{
  [key in keyof T | keyof F]: K
}>

export type MongoIdString = string
