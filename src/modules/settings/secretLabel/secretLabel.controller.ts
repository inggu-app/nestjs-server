import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateSecretLabelDto } from './dto/createSecretLabel.dto'
import { SecretLabelService } from './secretLabel.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Секретная надпись')
@Controller()
export class SecretLabelController {
  constructor(private readonly secretLabelService: SecretLabelService) {}

  @UsePipes(new ValidationPipe())
  @Post('/')
  async createSecretLabel(@Body() dto: CreateSecretLabelDto) {
    await this.secretLabelService.deleteActiveSecretLabel()

    return this.secretLabelService.createSecretLabel(dto)
  }

  @Get('/')
  async getSecretLabel(@Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date) {
    const secretLabel = await this.secretLabelService.getActiveSecretLabel()

    if ((secretLabel && secretLabel?.updatedAt && updatedAt && updatedAt < secretLabel?.updatedAt) || !updatedAt) {
      return secretLabel
    } else {
      return {
        label: '',
        updatedAt: secretLabel?.updatedAt,
      }
    }
  }
}
