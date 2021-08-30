export default function normalizeFields<T extends string[]>(
  fields: T,
  response: { [key: string]: any }
) {
  const normalizedResponse: { [key: string]: any } = {}

  fields.forEach(field => {
    normalizedResponse[field] = response[field]
  })

  return normalizedResponse
}
