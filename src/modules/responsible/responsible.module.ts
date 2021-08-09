import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ResponsibleModel } from './responsible.model'
import { ResponsibleService } from './responsible.service'
import { JwtModule } from '@nestjs/jwt'
import getJWTConfig from '../../configs/jwt.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ResponsibleController } from './responsible.controller'
import { GroupModule } from '../group/group.module'
import { ResponsibleJwtStrategy } from '../../global/strategies/responsibleJwt.strategy'

@Module({
  imports: [
    GroupModule,
    ConfigModule.forRoot(),
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
  providers: [ResponsibleService, ResponsibleJwtStrategy],
  controllers: [ResponsibleController],
  exports: [ResponsibleService],
})
export class ResponsibleModule {}
