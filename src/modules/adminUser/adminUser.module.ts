import { Module } from '@nestjs/common'
import { AdminUserController } from './adminUser.controller'
import { AdminUserService } from './adminUser.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { AdminUserModel } from './adminUser.model'

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
})
export class AdminUserModule {}
