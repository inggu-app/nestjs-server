import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { UserModel } from '../user/user.model'
import { DocumentType } from '@typegoose/typegoose'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import {
  FacultyDeleteDataForFunctionality,
  FacultyGetByFacultyIdDataForFunctionality,
  FacultyGetManyDataForFunctionality,
  FacultyGetQueryParametersEnum,
  FacultyUpdateDataForFunctionality,
} from './faculty.constants'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { Request } from 'express'
import { isMongoId } from 'class-validator'

export class FacultyJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    let castedFunctionality
    let queryParams
    let requestBody
    switch (functionality.code) {
      case FunctionalityCodesEnum.FACULTY__CREATE:
        return true
      case FunctionalityCodesEnum.FACULTY__GET_BY_FACULTY_ID:
        castedFunctionality = functionality as AvailableFunctionality<FacultyGetByFacultyIdDataForFunctionality>

        queryParams = parseRequestQueries(getEnumValues(FacultyGetQueryParametersEnum), request.url)
        if (!queryParams.facultyId || !isMongoId(queryParams.facultyId)) return true
        if (castedFunctionality.data.forbiddenFaculties.includes(queryParams.facultyId)) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(queryParams.facultyId)) return true
        break
      case FunctionalityCodesEnum.FACULTY__GET_MANY:
        castedFunctionality = functionality as AvailableFunctionality<FacultyGetManyDataForFunctionality>
        if (
          castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL ||
          castedFunctionality.data.availableFaculties.length
        )
          return true
        break
      case FunctionalityCodesEnum.FACULTY__UPDATE:
        castedFunctionality = functionality as AvailableFunctionality<FacultyUpdateDataForFunctionality>

        requestBody = FacultyJwtAuthGuard.getBody<UpdateFacultyDto>(request)
        if (castedFunctionality.data.forbiddenFaculties.includes(requestBody.id)) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(requestBody.id)) return true
        break
      case FunctionalityCodesEnum.FACULTY__DELETE:
        castedFunctionality = functionality as AvailableFunctionality<FacultyDeleteDataForFunctionality>

        queryParams = parseRequestQueries(['facultyId'], request.url)
        if (!queryParams.facultyId || !isMongoId(queryParams.facultyId)) return true
        if (castedFunctionality.data.forbiddenFaculties.includes(queryParams.facultyId)) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(queryParams.facultyId)) return true
        break
    }
    throw new ForbiddenException()
  }
}
