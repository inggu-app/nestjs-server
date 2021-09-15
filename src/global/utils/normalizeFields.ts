export default function normalizeFields<T extends string[]>(
  fields: T | undefined,
  response: { [key: string]: any }
) {
  if (!fields) return response

  const normalizedResponse: { [key: string]: any } = {}

  fields.forEach(field => {
    normalizedResponse[field] = response[field]
  })

  return normalizedResponse
}
