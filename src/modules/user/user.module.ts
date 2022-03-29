import { Global, Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from './user.model'

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
      },
    ]),
  ],
  exports: [UserService],
})
export class UserModule {}
