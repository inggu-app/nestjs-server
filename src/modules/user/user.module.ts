import { forwardRef, Global, Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ViewModule } from '../view/view.module'

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    forwardRef(() => ViewModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
      },
    ]),
  ],
  exports: [UserService],
})
export class UserModule {}
