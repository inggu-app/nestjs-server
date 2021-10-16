import { QueryOptions, Types } from 'mongoose'
import fieldsArrayToProjection from './utils/fieldsArrayToProjection'
import { DocumentType } from '@typegoose/typegoose'
import { UserModel } from '../modules/user/user.model'
import { AvailableFunctionality } from '../modules/functionality/functionality.constants'

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

export interface ServiceGetOptions<T, K = { [key: string]: any }> {
  fields?: T[] | ReturnType<typeof fieldsArrayToProjection>
  queryOptions?: QueryOptions
  functionality?: AvailableFunctionality<K>
  user?: DocumentType<UserModel>
}

export type MongoIdString = string
