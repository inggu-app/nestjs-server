import { Global, Module } from '@nestjs/common'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from './models/user.model'
import { RoleModel } from './models/role.model'
import { RoleService } from './services/role.service'
import { RoleController } from './controllers/role.controller'

@Global()
@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
      },
      {
        typegooseClass: RoleModel,
      },
    ]),
  ],
  exports: [UserService, RoleService],
})
export class UserModule {}
