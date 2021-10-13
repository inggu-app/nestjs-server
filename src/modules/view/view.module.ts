import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ViewController } from './view.controller'
import { ViewService } from './view.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { ViewModel } from './view.model'
import { ViewGetRoutesMiddleware } from './viewGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'

@Module({
  controllers: [ViewController],
  providers: [ViewService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ViewModel,
        schemaOptions: {
          collection: 'View',
        },
      },
    ]),
  ],
})
export class ViewModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ViewGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.VIEW_MODULE, method: RequestMethod.GET })
  }
}
