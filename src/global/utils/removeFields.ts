export function removeFields<T>(data: Record<string, any> | Record<string, any>[], fieldsToRemove: (keyof T)[]) {
  let clonedData = JSON.parse(JSON.stringify(data)) as Record<string, any> | Record<string, any>[]
  if (!Array.isArray(data)) clonedData = [clonedData]

  for (const object of clonedData as Record<string, any>[]) {
    fieldsToRemove.forEach(field => delete object[field as string])
  }

  return Array.isArray(data) ? clonedData : (clonedData as Record<string, any>)[0]
}
