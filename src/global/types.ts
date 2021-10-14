import { QueryOptions, Types } from 'mongoose'
import fieldsArrayToProjection from './utils/fieldsArrayToProjection'

export type DeviceId = string

export interface ModelBase {
  _id: Types.ObjectId
}

export interface CustomModelBase {
  id: Types.ObjectId
}

export type ObjectByInterface<T, F = any, K = any> = Partial<
  {
    [key in keyof T | keyof F]: K
  }
>

export interface ServiceGetOptions<T> {
  fields?: T[] | ReturnType<typeof fieldsArrayToProjection>
  queryOptions?: QueryOptions
}

export type MongoIdString = string
