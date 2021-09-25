import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateSecretLabelDto } from './dto/createSecretLabel.dto'
import { SecretLabelService } from './secretLabel.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import { AdminJwtAuthGuard } from '../../../global/guards/adminJwtAuth.guard'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { GetSecretLabelEnum } from './secretLabel.constants'

@Controller()
export class SecretLabelController {
  constructor(private readonly secretLabelService: SecretLabelService) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async createSecretLabel(@Body() dto: CreateSecretLabelDto) {
    await this.secretLabelService.deleteActiveSecretLabel()

    return this.secretLabelService.createSecretLabel(dto)
  }

  @Get('/')
  async getSecretLabel(
    @Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date
  ) {
    const request = checkAlternativeQueryParameters<GetSecretLabelEnum>({
      updatedAt,
      enum: GetSecretLabelEnum.get,
    })

    switch (request.enum) {
      case GetSecretLabelEnum.get:
        const secretLabel = await this.secretLabelService.getActiveSecretLabel()

        if (
          (secretLabel && secretLabel?.updatedAt && request.updatedAt < secretLabel?.updatedAt) ||
          !request.updatedAt
        ) {
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
