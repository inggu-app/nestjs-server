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
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import { AdminJwtAuthGuard } from '../../../global/guards/adminJwtAuth.guard'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { GetCallScheduleEnum } from './callSchedule.constants'

@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async createCallSchedule(@Body() dto: CreateCallScheduleDto) {
    await this.callScheduleService.deleteActiveCallSchedule()

    return this.callScheduleService.createCallSchedule(dto)
  }

  @Get('/')
  async getCallSchedule(
    @Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date
  ) {
    const request = checkAlternativeQueryParameters<GetCallScheduleEnum>({
      updatedAt,
      enum: GetCallScheduleEnum.get,
    })

    switch (request.enum) {
      case GetCallScheduleEnum.get:
        const callSchedule = await this.callScheduleService.getActiveCallSchedule(request.updatedAt)
        return callSchedule || {}
    }
  }
}
