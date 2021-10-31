import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { WeeksCountController } from './weeksCount.controller'
import { WeeksCountService } from './weeksCount.service'
import { WeeksCountModel } from './weeksCount.model'

@Module({
  controllers: [WeeksCountController],
  providers: [WeeksCountService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: WeeksCountModel,
      },
    ]),
  ],
})
export class WeeksCountModule {}
