import { DocumentType } from '@typegoose/typegoose'
import { SchemaOptions } from 'mongoose'

export const getModelDefaultOptions = <Model>(schemaOptions?: SchemaOptions): SchemaOptions => ({
  ...schemaOptions,
  toObject: {
    ...schemaOptions?.toObject,
    transform: (doc: DocumentType<Model>, ret: any, options: any) => {
      if (schemaOptions?.toJSON?.transform) {
        schemaOptions?.toJSON?.transform(doc, ret, options)
      }
      delete ret.__v
      if (ret._id) ret.id = ret._id
      delete ret._id
    },
  },
  toJSON: {
    ...schemaOptions?.toJSON,
    transform: (doc: DocumentType<Model>, ret: any, options: any) => {
      if (schemaOptions?.toJSON?.transform) {
        schemaOptions?.toJSON?.transform(doc, ret, options)
      }
      delete ret.__v
      if (ret._id) ret.id = ret._id
      delete ret._id
    },
  },
})
