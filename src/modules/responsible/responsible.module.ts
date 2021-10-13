import { forwardRef, Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ResponsibleModel } from './responsible.model'
import { ResponsibleService } from './responsible.service'
import { ResponsibleController } from './responsible.controller'
import { GroupModule } from '../group/group.module'
import { ResponsibleJwtStrategy } from '../../global/strategies/responsibleJwt.strategy'
import { FacultyModule } from '../faculty/faculty.module'

@Module({
  imports: [
    forwardRef(() => FacultyModule),
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
