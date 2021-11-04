import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { SemesterRangeDateModel } from './semesterRangeDate.model'
import { SemesterRangeDateService } from './semesterRangeDate.service'
import { SemesterRangeDateController } from './semesterRangeDate.controller'

@Module({
  controllers: [SemesterRangeDateController],
  providers: [SemesterRangeDateService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SemesterRangeDateModel,
      },
    ]),
  ],
})
export class SemesterRangeDateModule {}
