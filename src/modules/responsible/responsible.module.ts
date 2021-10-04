import { forwardRef, Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ResponsibleModel } from './responsible.model'
import { ResponsibleService } from './responsible.service'
import { JwtModule } from '@nestjs/jwt'
import getJWTConfig from '../../configs/jwt.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ResponsibleController } from './responsible.controller'
import { GroupModule } from '../group/group.module'
import { ResponsibleJwtStrategy } from '../../global/strategies/responsibleJwt.strategy'
import { FacultyModule } from '../faculty/faculty.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => FacultyModule),
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
    forwardRef(() => GroupModule),
  ],
  providers: [ResponsibleService, ResponsibleJwtStrategy],
  controllers: [ResponsibleController],
  exports: [ResponsibleService],
})
export class ResponsibleModule {}
