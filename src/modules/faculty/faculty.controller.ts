import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { FacultyModuleCreateResponseDto } from './dto/responses/FacultyModuleCreateResponseDto'
import { MongoIdExample, MongoIdType } from '../../global/constants/constants'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { FacultyModuleGetByIdResponseDto } from './dto/responses/FacultyModuleGetByIdResponseDto'
import { FacultyModuleGetByIdsResponseDto } from './dto/responses/FacultyModuleGetByIdsResponseDto'
import { FacultyModuleGetManyResponseDto } from './dto/responses/FacultyModuleGetManyResponseDto'
import { UserAuth } from '../../global/decorators/UserAuth.decorator'
import { RequestUser } from '../../global/decorators/RequestUser.decorator'
import { DeleteFacultyAvailabilityModel, UpdateFacultyAvailabilityModel } from '../user/models/user.model'
import { objectKeys } from '../../global/utils/objectKeys'

@ApiTags('Факультеты')
@Controller()
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @UserAuth({
    availability: 'createFaculty',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет создать факультет',
  })
  @ApiResponseException()
  @ApiResponse({
    type: FacultyModuleCreateResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async create(@Body() dto: CreateFacultyDto) {
    return {
      faculty: await this.facultyService.create(dto),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить факультет по id',
  })
  @ApiQuery({
    name: 'facultyId',
    description: 'id факультета',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: FacultyModuleGetByIdResponseDto,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
    status: HttpStatus.OK,
  })
  @Get('/by-id')
  async getById(@MongoId('facultyId') facultyId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      faculty: await this.facultyService.getById(facultyId, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список факультетов по переданному списку id',
  })
  @ApiQuery({
    name: 'facultyIds',
    type: MongoIdType,
    example: [MongoIdExample, MongoIdExample].join(),
    isArray: true,
    description: 'Список id факультетов',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: FacultyModuleGetByIdsResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-ids')
  async getByIds(
    @MongoId('facultyIds', { multiple: true }) facultyIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      faculties: await this.facultyService.getByIds(facultyIds, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список факультетов постранично',
  })
  @ApiQuery({
    name: 'page',
    description: 'Страница',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'count',
    description: 'Количество факультетов за раз',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'title',
    description:
      'Название факультета. Если параметр передан, то будут возвращаться группы, в названии которых есть переданное значение. Регистр не важен.',
    type: String,
    example: 'Факульт',
    required: false,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: FacultyModuleGetManyResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/many')
  async getMany(
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('count', { intType: 'positive' }) count: number,
    @StringQueryParam('title', { required: false }) title?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      faculties: await this.facultyService.getAll(page, count, title, queryOptions),
      count: await this.facultyService.countAll(title),
    }
  }

  @UserAuth({
    availability: 'updateFaculty',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description:
      'Эндпоинт позволяет обновить информацию о факультете. В теле запроса нужно передавать только те поля, которые нужно изменить',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateFacultyDto, @RequestUser() user: RequestUser<UpdateFacultyAvailabilityModel>) {
    // проверяем пытается ли пользователь обновить запрещённые ему поля
    const availableFields = user.availability.availableFields
    const errors: string[] = []
    const { id, ...fields } = dto
    objectKeys(fields).forEach(field => {
      if (!availableFields[field]) errors.push(`Пользователю запрещено редактировать поле ${field} у факультета`)
    })
    if (errors.length) throw new BadRequestException(errors)

    // проверяем пытается ли пользователь обновить недоступный ему факультет
    if (!user.availability.all) {
      if (!user.availability.availableFaculties.includes(id))
        throw new BadRequestException(`Пользователь не может редактировать факультет с id ${id}`)
    }

    //проверяем пересекаются ли устанавливаемые стадии обучения
    if (dto.learningStages)
      dto.learningStages.forEach((firstStage, firstIndex) => {
        if (firstStage.start.getTime() >= firstStage.end.getTime())
          throw new BadRequestException(`Некорректный промежуток в ${JSON.stringify(firstStage)}`)
        dto.learningStages?.forEach((secondStage, secondIndex) => {
          if (firstIndex === secondIndex) return

          if (
            (firstStage.start <= secondStage.start && secondStage.start <= firstStage.end) ||
            (firstStage.start <= secondStage.end && secondStage.end <= firstStage.end) ||
            (secondStage.start < firstStage.start && firstStage.end < secondStage.end)
          )
            throw new BadRequestException(
              `Пересечение во времени в стадиях обучения ${JSON.stringify(firstStage)} и ${JSON.stringify(secondStage)}`
            )
        })
      })

    await this.facultyService.update(dto)
  }

  @UserAuth({
    availability: 'deleteFaculty',
    availabilityKey: 'available',
  })
  @ApiOperation({
    description: 'Эндпоинт позволяет удалить факультет',
  })
  @ApiQuery({
    name: 'facultyId',
    description: 'id факультета',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async delete(@MongoId('facultyId') facultyId: Types.ObjectId, @RequestUser() user: RequestUser<DeleteFacultyAvailabilityModel>) {
    if (!user.availability.all) {
      if (!user.availability.availableFaculties.includes(facultyId))
        throw new BadRequestException(`Пользователь не может удалить факультет с id ${facultyId}`)
    }

    await this.facultyService.delete(facultyId)
  }
}
