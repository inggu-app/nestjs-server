import { HttpException, HttpStatus } from '@nestjs/common'

export default function checkAlternativeQueryParameters(
  ...parameterObjects: { [key: string]: any; required?: { [key: string]: any } }[]
) {
  const isNotEmptyKeys = new Set()
  let isEmpty = true
  parameterObjects.map(parameterObject => {
    let isFounded = false
    Object.keys(parameterObject).map(parameterKey => {
      const parameter = parameterObject[parameterKey]

      if (parameter != undefined) {
        if (!isEmpty && !isNotEmptyKeys.has(parameterKey)) {
          throw new HttpException('Несовместимые параметры', HttpStatus.BAD_REQUEST)
        }

        isNotEmptyKeys.add(parameterKey)

        isFounded = true
      }
    })

    if (isFounded) isEmpty = false
  })
  // parameterObjects.map(parameterObject =>
  //   Object.keys(parameterObject).map(parameterKey => {
  //     if (parameterObject[parameterKey] != undefined) isNotEmptyKeys.add(parameterKey)
  //   })
  // )
  //
  // parameterObjects.map(parameterObject => {})
  // const permittedKeys = parameterObjects
  //   .reduce<string[]>((acc, parameterObject) => [...acc, ...Object.keys(parameterObject)], [])
  //   .filter((key, index, keys) => keys.filter(k => k === key).length > 1)
  //   .filter((key, index, keys) => keys.findIndex(k => k === key) === index)
  // console.log(permittedKeys)
  //
  // let isEmpty = true
  // parameterObjects.forEach(parameterObject => {
  //   let isFounded = false
  //   Object.keys(parameterObject).forEach(parameterKey => {
  //     const parameter = parameterObject[parameterKey]
  //
  //     if (parameter != undefined) {
  //       if (!isEmpty && !permittedKeys.includes(parameterKey)) {
  //         console.log(permittedKeys, parameterKey)
  //         throw new HttpException('Несовместимые параметры', HttpStatus.BAD_REQUEST)
  //       }
  //       if (!permittedKeys.includes(parameterKey)) {
  //         isFounded = true
  //       }
  //     }
  //   })
  //
  //   if (isFounded) isEmpty = false
  // })
}
