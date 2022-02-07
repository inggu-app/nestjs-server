import { Module } from '@nestjs/common'
import { AppVersionController } from './appVersion.controller'
import { AppVersionService } from './appVersion.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppVersionModel } from './appVersion.model'

@Module({
  controllers: [AppVersionController],
  providers: [AppVersionService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AppVersionModel,
      },
    ]),
  ],
})
export class AppVersionModule {}
