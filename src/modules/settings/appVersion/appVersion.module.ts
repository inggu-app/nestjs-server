import { Module } from '@nestjs/common'
import { AppVersionController } from './appVersion.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppVersionService } from './appVersion.service'
import { AppVersionModel } from './appVersion.model'

@Module({
  controllers: [AppVersionController],
  providers: [AppVersionService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AppVersionModel,
        schemaOptions: {
          collection: 'Settings',
        },
      },
    ]),
  ],
})
export class AppVersionModule {}
