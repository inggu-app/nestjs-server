import { Projection } from '../pipes/fields.pipe'

type Returnable<T extends string> = {
  data: Projection<T, '_id'>
  getProjection: () => { [key: string]: any }
}

type Options = {
  projection?: { [key: string]: any }
  populate?: { path: string; options: Options }[]
}

export default function fieldsToProjection<T extends string>(
  fields?: Projection<T>,
  requiredFields?: T[]
): Returnable<T> {
  if (!fields) return { data: {}, getProjection: () => ({} as { [key in T]: 0 | 1 }) }

  const projection: Projection<T, '_id'> = JSON.parse(JSON.stringify(fields).replace(/id/g, '_id'))

  requiredFields?.forEach(field => {
    if (field === 'id') {
      projection['_id'] = { projection: 1 }
    } else {
      projection[field] = { projection: 1 }
    }
  })

  return {
    data: projection,
    getProjection() {
      return translate(projection)
    },
  }
}

const translate = <T extends string>(obj: Projection<T, '_id'>) => {
  const options: Options = {}
  ;(Object.keys(obj) as Array<keyof typeof obj>).map(field => {
    if (!obj[field]?.children) {
      if (!options.projection) options.projection = {}
      options.projection[field] = obj[field]?.projection
    } else {
      if (!options.projection) options.projection = {}
      if (!options.populate) options.populate = []

      options.projection[field] = obj[field]?.projection
      options.populate.push({
        path: field,
        options: translate(obj[field]?.children as typeof obj),
      })
    }
  })

  return options
}
