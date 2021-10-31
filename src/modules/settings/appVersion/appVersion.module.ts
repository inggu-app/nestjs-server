import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppVersionController } from './appVersion.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppVersionService } from './appVersion.service'
import { AndroidAppVersionModel } from './models/androidAppVersion.model'
import { IosAppVersionModel } from './models/iosAppVersion.model'
import { AppVersionGetRoutesMiddleware } from './appVersionGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../../global/enums/moduleRoutes.enum'

@Module({
  controllers: [AppVersionController],
  providers: [AppVersionService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AndroidAppVersionModel,
      },
      {
        typegooseClass: IosAppVersionModel,
      },
    ]),
  ],
})
export class AppVersionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppVersionGetRoutesMiddleware).forRoutes({ method: RequestMethod.GET, path: ModuleRoutesEnum.APP_VERSION_MODULE })
  }
}
