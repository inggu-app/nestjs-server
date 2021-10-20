import { HttpException, HttpStatus } from '@nestjs/common'
import { INCORRECT_FIELDS_SET_IN_FIELDS_QUERY_PARAMETER } from '../constants/errors.constants'

export type ParameterObjectType<T> = {
  [key: string]: any
  enum: T
}

interface ParameterObjectWithRequiredType<T> extends ParameterObjectType<T> {
  required?: { [key: string]: any }
}

export default function checkAlternativeQueryParameters<T>(
  ...parameterObjects: ParameterObjectWithRequiredType<T>[]
): ParameterObjectType<T> {
  const allNotEmptyKeys = getAllNotEmptyKeys<T>(parameterObjects)
  const isCorrectParameterObject: ParameterObjectType<T>[] = []

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
      const { required, enum: requiredEnum, ...otherParameters } = parameterObject
      isCorrectParameterObject.push({ enum: requiredEnum, ...otherParameters, ...required })
    }
  })

  if (isCorrectParameterObject.length != 1) {
    throw new HttpException(INCORRECT_FIELDS_SET_IN_FIELDS_QUERY_PARAMETER, HttpStatus.BAD_REQUEST)
  } else {
    return isCorrectParameterObject[0]
  }
}

function getAllNotEmptyKeys<T>(parameterObjects: ParameterObjectWithRequiredType<T>[]) {
  const isNotEmptyKeys = new Set()
  parameterObjects.map(parameterObject => {
    Object.keys(parameterObject).map(parameterKey => {
      if (parameterKey === 'required' && parameterObject.required) {
        Object.keys(parameterObject.required).map(requiredParameterKey => {
          if (parameterObject.required && parameterObject.required[requiredParameterKey] != undefined) {
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
