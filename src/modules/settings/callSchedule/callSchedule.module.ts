import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CallScheduleController } from './callSchedule.controller'
import { CallScheduleService } from './callSchedule.service'
import { CallScheduleModel } from './callSchedule.model'

@Module({
  controllers: [CallScheduleController],
  providers: [CallScheduleService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CallScheduleModel,
        schemaOptions: {
          collection: 'Settings',
        },
      },
    ]),
  ],
  exports: [CallScheduleService],
})
export class CallScheduleModule {}
