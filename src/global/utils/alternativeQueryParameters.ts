import { HttpException, HttpStatus } from '@nestjs/common'

type ParameterObjectsType<T> = {
  [key: string]: any
  required?: { [key: string]: any }
  enum: T
}[]

export default function checkAlternativeQueryParameters<T>(
  ...parameterObjects: ParameterObjectsType<T>
): T {
  const allNotEmptyKeys = getAllNotEmptyKeys<T>(parameterObjects)
  const isCorrectParameterObjectEnums: T[] = []

  parameterObjects.forEach(parameterObject => {
    const parameterObjectsNotEmptyKeys = getAllNotEmptyKeys([parameterObject])

    let isIn = true
    allNotEmptyKeys.forEach(key => {
      if (!parameterObjectsNotEmptyKeys.has(key)) {
        isIn = false
      }
    })

    if (parameterObject.required) {
      Object.keys(parameterObject.required).forEach(key => {
        if (!allNotEmptyKeys.has(key)) {
          isIn = false
        }
      })
    }

    if (isIn) {
      isCorrectParameterObjectEnums.push(parameterObject.enum)
    }
  })

  if (isCorrectParameterObjectEnums.length != 1) {
    throw new HttpException(
      'Набор таких параметров не найден. Проверьте документацию',
      HttpStatus.BAD_REQUEST
    )
  } else {
    return isCorrectParameterObjectEnums[0]
  }
}

function getAllNotEmptyKeys<T>(parameterObjects: ParameterObjectsType<T>) {
  const isNotEmptyKeys = new Set()
  parameterObjects.map(parameterObject => {
    Object.keys(parameterObject).map(parameterKey => {
      if (parameterKey === 'required' && parameterObject.required) {
        Object.keys(parameterObject.required).map(requiredParameterKey => {
          if (
            parameterObject.required &&
            parameterObject.required[requiredParameterKey] != undefined
          ) {
            isNotEmptyKeys.add(requiredParameterKey)
          }
        })
      } else if (parameterObject[parameterKey] != undefined) {
        isNotEmptyKeys.add(parameterKey)
      }
    })
  })

  return isNotEmptyKeys
}
