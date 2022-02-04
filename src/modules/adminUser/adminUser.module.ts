import { Global, Module } from '@nestjs/common'
import { AdminUserController } from './adminUser.controller'
import { AdminUserService } from './adminUser.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { AdminUserModel } from './adminUser.model'

@Global()
@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AdminUserModel,
      },
    ]),
  ],
  exports: [AdminUserService],
})
export class AdminUserModule {}
