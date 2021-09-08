export default function fieldsArrayToProjection<T extends string[]>(
  fields?: T,
  requiredFields?: T
): { [key: string]: 0 | 1 } {
  if (!fields) return {}

  const projection: { [key: string]: 0 | 1 } = {}

  if (!fields.includes('id')) {
    projection['_id'] = 0
  }

  fields.forEach(field => {
    if (field != 'id') {
      projection[field] = 1
    }
  })
  requiredFields?.forEach(field => {
    if (field === 'id') {
      projection['_id'] = 1
    } else {
      projection[field] = 1
    }
  })

  return projection
}
