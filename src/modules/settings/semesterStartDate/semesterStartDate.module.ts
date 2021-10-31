import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { SemesterStartDateModel } from './semesterStartDate.model'
import { SemesterStartDateService } from './semesterStartDate.service'
import { SemesterStartDateController } from './semesterStartDate.controller'

@Module({
  controllers: [SemesterStartDateController],
  providers: [SemesterStartDateService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SemesterStartDateModel,
      },
    ]),
  ],
})
export class SemesterStartDateModule {}
