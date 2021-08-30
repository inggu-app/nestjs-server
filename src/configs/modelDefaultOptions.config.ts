import { DocumentType } from '@typegoose/typegoose'
import { SchemaOptions } from 'mongoose'

export const getModelDefaultOptions = <Model>(collection?: string): SchemaOptions => ({
  collection,
  toObject: {
    transform: (doc: DocumentType<Model>, ret: any) => {
      delete ret.__v
      if (ret._id) ret.id = ret._id
      delete ret._id
    },
  },
  toJSON: {
    transform: (doc: DocumentType<Model>, ret: any) => {
      delete ret.__v
      if (ret._id) ret.id = ret._id
      delete ret._id
    },
  },
})
