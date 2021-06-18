import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateSecretLabelDto } from './dto/createSecretLabel.dto'
import { SecretLabelService } from './secretLabel.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'

@Controller()
export class SecretLabelController {
  constructor(private readonly secretLabelService: SecretLabelService) {}

  @Get('/get')
  getSecretLabel(@Query('updatedAt', ParseDatePipe) updatedAt: Date) {
    return this.secretLabelService.getActiveSecretLabel(updatedAt)
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createSecretLabel(@Body() dto: CreateSecretLabelDto) {
    await this.secretLabelService.deleteActiveSecretLabel()

    return this.secretLabelService.createSecretLabel(dto)
  }
}
