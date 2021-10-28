import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { FacultyModule } from '../faculty/faculty.module'
import { GroupGetRoutesMiddleware } from './groupGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'

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
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(GroupGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.GROUP_MODULE, method: RequestMethod.GET })
  }
}
