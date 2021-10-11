import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { AdminModel } from './admin.model'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { OwnerJwtStrategy } from '../../global/strategies/ownerJwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import getJWTConfig from '../../configs/jwt.config'
import { AdminJwtStrategy } from '../../global/strategies/adminJwt.strategy'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
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
