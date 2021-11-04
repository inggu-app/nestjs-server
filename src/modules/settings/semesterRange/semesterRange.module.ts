import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { SemesterRangeModel } from './semesterRange.model'
import { SemesterRangeService } from './semesterRange.service'
import { SemesterRangeController } from './semesterRange.controller'

@Module({
  controllers: [SemesterRangeController],
  providers: [SemesterRangeService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SemesterRangeModel,
      },
    ]),
  ],
})
export class SemesterRangeModule {}
