import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ViewController } from './view.controller'
import { ViewService } from './view.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { ViewModel } from './view.model'
import { ViewGetRoutesMiddleware } from './viewGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'
import { UserModule } from '../user/user.module'

@Module({
  controllers: [ViewController],
  providers: [ViewService],
  imports: [
    forwardRef(() => UserModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: ViewModel,
        schemaOptions: {
          collection: 'View',
        },
      },
    ]),
  ],
  exports: [ViewService],
})
export class ViewModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ViewGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.VIEW_MODULE, method: RequestMethod.GET })
  }
}
