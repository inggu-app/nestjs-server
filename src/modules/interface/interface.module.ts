import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { InterfaceService } from './interface.service'
import { InterfaceController } from './interface.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { InterfaceModel } from './interface.model'
import { InterfaceGetRoutesMiddleware } from './interfaceGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'
import { RoleModule } from '../role/role.module'

@Module({
  controllers: [InterfaceController],
  providers: [InterfaceService],
  imports: [
    forwardRef(() => RoleModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: InterfaceModel,
      },
    ]),
  ],
  exports: [InterfaceService],
})
export class InterfaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InterfaceGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.INTERFACE_MODULE, method: RequestMethod.GET })
  }
}
