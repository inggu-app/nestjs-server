import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { FacultyModule } from '../faculty/faculty.module'
import { ResponsibleModule } from '../responsible/responsible.module'
import { RoutesMiddleware } from './group.middleware'

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
    forwardRef(() => ResponsibleModule),
  ],
  exports: [GroupService],
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RoutesMiddleware).forRoutes('/groups', { path: '/', method: RequestMethod.GET })
  }
}
