import { forwardRef, Module } from '@nestjs/common'
import { FacultyController } from './faculty.controller'
import { FacultyService } from './faculty.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { GroupModule } from '../group/group.module'
import { RoleModule } from '../role/role.module'

@Module({
  controllers: [FacultyController],
  providers: [FacultyService],
  imports: [
    RoleModule,
    forwardRef(() => GroupModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: FacultyModel,
        schemaOptions: {
          collection: 'Faculty',
        },
      },
    ]),
  ],
  exports: [FacultyService],
})
export class FacultyModule {}
