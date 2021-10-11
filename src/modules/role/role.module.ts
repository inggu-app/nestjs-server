import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { RoleModel } from './role.model'
import { RoleGetRoutesMiddleware } from './roleGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RoleModel,
        schemaOptions: {
          collection: 'Role',
        },
      },
    ]),
  ],
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RoleGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.ROLE_MODULE, method: RequestMethod.GET })
  }
}
