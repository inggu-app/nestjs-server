import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { AdminModel } from './admin.model'
import { OwnerJwtStrategy } from '../../global/strategies/ownerJwt.strategy'
import { AdminJwtStrategy } from '../../global/strategies/adminJwt.strategy'

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AdminModel,
        schemaOptions: {
          collection: 'Admin',
        },
      },
    ]),
  ],
  providers: [AdminService, AdminJwtStrategy, OwnerJwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
