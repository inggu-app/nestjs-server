import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { RoleModel } from './role.model'
import { RoleRoutesMiddleware } from './role.middleware'

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
    consumer.apply(RoleRoutesMiddleware).forRoutes({ path: '/roles', method: RequestMethod.GET })
  }
}
