import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { InterfaceService } from './interface.service'
import { InterfaceController } from './interface.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { InterfaceModel } from './interface.model'
import { InterfaceGetRoutesMiddleware } from './interfaceGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'

@Module({
  controllers: [InterfaceController],
  providers: [InterfaceService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: InterfaceModel,
        schemaOptions: {
          collection: 'Interface',
        },
      },
    ]),
  ],
})
export class InterfaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InterfaceGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.INTERFACE_MODULE, method: RequestMethod.GET })
  }
}
