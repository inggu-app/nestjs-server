import { Projection } from '../pipes/fields.pipe'

export default function normalizeFields<T extends string>(
  fields: Projection<T> | undefined,
  response: { [key: string]: any }
) {
  if (!fields) return response

  return translate(fields, response)
}

const translate = <T extends string>(fields: Projection<T>, response: { [key: string]: any }) => {
  // console.log('fields:', fields, 'response', response)
  const res: { [key: string]: any } = {}

  ;(Object.keys(fields) as Array<keyof typeof fields>).map(field => {
    if (!fields[field]?.children) {
      console.log(field, response, response[field])
      res[field] = response[field]
    } else {
      res[field] = translate(fields[field]?.children as Projection<T>, response[field])
    }
  })

  return res
}
