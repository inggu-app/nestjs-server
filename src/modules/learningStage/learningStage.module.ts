import { Module } from '@nestjs/common'
import { LearningStageController } from './learningStage.controller'
import { LearningStageService } from './learningStage.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { LearningStageModel } from './learningStage.model'

@Module({
  controllers: [LearningStageController],
  providers: [LearningStageService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: LearningStageModel,
      },
    ]),
  ],
})
export class LearningStageModule {}
