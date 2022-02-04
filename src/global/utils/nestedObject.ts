export function getNested(object: Record<string, any>, path: string) {
  try {
    return path.split('.').reduce(function (obj, property) {
      return obj[property]
    }, object)
  } catch (err) {
    return undefined
  }
}

export function setNested(object: Record<string, any>, value: any, path: string) {
  try {
    const keys = path.split('.')

    keys.reduce(function (obj, property, index) {
      if (keys.length - 1 === index) {
        obj[property] = value
      }
      return obj[property]
    }, object)

    return object
  } catch (err) {
    return undefined
  }
}

export function deleteNested(object: Record<string, any>, path: string) {
  try {
    const keys = path.split('.')

    keys.reduce(function (obj, property, index) {
      if (keys.length - 1 === index) {
        delete obj[property]
        return obj
      }
      return obj[property]
    }, object)

    return object
  } catch (err) {
    return undefined
  }
}
