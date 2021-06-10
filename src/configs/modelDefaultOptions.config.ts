import { DocumentType } from '@typegoose/typegoose'

export const getModelDefaultOptions = <Model>() => ({
  toJSON: {
    transform: (doc: DocumentType<Model>, ret: any) => {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
    },
  },
})
