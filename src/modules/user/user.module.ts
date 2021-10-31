import { forwardRef, Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { UserGetRoutesMiddleware } from './userGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'
import { RoleModule } from '../role/role.module'
import { ViewModule } from '../view/view.module'

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    forwardRef(() => RoleModule),
    forwardRef(() => ViewModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
  ],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.USER_MODULE, method: RequestMethod.GET })
  }
}
