import { Module } from '@nestjs/common'
import { FacultyController } from './faculty.controller'
import { FacultyService } from './faculty.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'

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
  ],
})
export class FacultyModule {}
