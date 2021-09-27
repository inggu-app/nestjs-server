import { EmptyEnum } from '../constants/other.constants'
import { getEnumValues } from './enumKeysValues'

interface Options<T> {
  fields: T
  forbiddenFields?: EmptyEnum
}

export default async function normalizeFields<T extends string[]>(
  response: { [key: string]: any },
  data: Options<T>
) {
  if (!data.fields) return response

  if (response instanceof Promise) {
    response = await response
  }

  if (Array.isArray(response)) {
    return response.map(item => normalize(item, data))
  }

  return normalize(response, data)
}

function normalize<T extends string[]>(response: { [key: string]: any }, data: Options<T>) {
  const normalizedResponse: { [key: string]: any } = {}

  const forbiddenFields: string[] = []
  if (data.forbiddenFields) forbiddenFields.push(...getEnumValues(data.forbiddenFields))

  data.fields.forEach(field => {
    if (!forbiddenFields.includes(field)) {
      normalizedResponse[field] = response[field]
    }
  })

  return normalizedResponse
}
