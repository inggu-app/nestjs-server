import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ResponsibleModel } from './responsible.model'
import { ResponsibleService } from './responsible.service'
import { JwtModule } from '@nestjs/jwt'
import getJWTConfig from '../../configs/jwt.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ResponsibleController } from './responsible.controller'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [
    GroupModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: ResponsibleModel,
        schemaOptions: {
          collection: 'Responsible',
        },
      },
    ]),
  ],
  providers: [ResponsibleService],
  controllers: [ResponsibleController],
})
export class ResponsibleModule {}
