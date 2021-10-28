import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateSecretLabelDto } from './dto/createSecretLabel.dto'
import { SecretLabelService } from './secretLabel.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { SecretLabelRoutesEnum } from './secretLabel.constants'
import { Functionality } from '../../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { defaultCallScheduleCreateData, defaultCallScheduleGetData } from '../callSchedule/callSchedule.constants'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Секретная надпись')
@Controller()
export class SecretLabelController {
  constructor(private readonly secretLabelService: SecretLabelService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.SECRET_LABEL__CREATE,
    default: defaultCallScheduleCreateData,
    title: 'Установить секретную надпись',
  })
  @Post(SecretLabelRoutesEnum.CREATE)
  async createSecretLabel(@Body() dto: CreateSecretLabelDto) {
    await this.secretLabelService.deleteActiveSecretLabel()

    return this.secretLabelService.createSecretLabel(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.SECRET_LABEL__GET,
    default: defaultCallScheduleGetData,
    title: 'Получить секретную надпись',
  })
  @Get(SecretLabelRoutesEnum.GET)
  async getSecretLabel(@Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date) {
    const request = checkAlternativeQueryParameters<SecretLabelRoutesEnum>({
      updatedAt,
      enum: SecretLabelRoutesEnum.GET,
    })

    switch (request.enum) {
      case SecretLabelRoutesEnum.GET:
        const secretLabel = await this.secretLabelService.getActiveSecretLabel()

        if ((secretLabel && secretLabel?.updatedAt && request.updatedAt < secretLabel?.updatedAt) || !request.updatedAt) {
          return secretLabel
        } else {
          return {
            label: '',
            updatedAt: secretLabel?.updatedAt,
          }
        }
    }
  }
}
