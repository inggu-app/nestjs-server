import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { FacultyController } from './faculty.controller'
import { FacultyService } from './faculty.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { GroupModule } from '../group/group.module'
import { FacultyGetRoutesMiddleware } from './facultyGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'

@Module({
  controllers: [FacultyController],
  providers: [FacultyService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FacultyModel,
        schemaOptions: {
          collection: 'Faculty',
        },
      },
    ]),
    forwardRef(() => GroupModule),
  ],
  exports: [FacultyService],
})
export class FacultyModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(FacultyGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.FACULTY_MODULE, method: RequestMethod.GET })
  }
}
