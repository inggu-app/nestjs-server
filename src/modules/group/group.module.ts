import { forwardRef, Module } from '@nestjs/common'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { FacultyModule } from '../faculty/faculty.module'

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GroupModel,
        schemaOptions: {
          collection: 'Group',
        },
      },
    ]),
    forwardRef(() => FacultyModule),
  ],
  exports: [GroupService],
})
export class GroupModule {}
