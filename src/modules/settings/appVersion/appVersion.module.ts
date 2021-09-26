import { Module } from '@nestjs/common'
import { AppVersionController } from './appVersion.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppVersionService } from './appVersion.service'
import { AndroidAppVersionModel } from './models/androidAppVersion.model'
import { IosAppVersionModel } from './models/iosAppVersion.model'

@Module({
  controllers: [AppVersionController],
  providers: [AppVersionService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AndroidAppVersionModel,
        schemaOptions: {
          collection: 'Settings',
        },
      },
      {
        typegooseClass: IosAppVersionModel,
        schemaOptions: {
          collection: 'Settings',
        },
      },
    ]),
  ],
})
export class AppVersionModule {}
