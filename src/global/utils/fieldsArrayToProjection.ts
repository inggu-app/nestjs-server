export default function fieldsArrayToProjection<T extends string[]>(
  fields?: T,
  requiredFields?: T,
  forbiddenFields?: T
): { [key: string]: 0 | 1 } {
  const projection: { [key: string]: 0 | 1 } = {}

  if (!fields) {
    forbiddenFields?.forEach(field => {
      if (field === 'id') {
        projection['_id'] = 0
      } else {
        projection[field] = 0
      }
    })

    return projection
  }

  if (!fields.includes('id')) {
    projection['_id'] = 0
  }

  fields.forEach(field => {
    if (field != 'id' && !forbiddenFields?.includes(field)) {
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
