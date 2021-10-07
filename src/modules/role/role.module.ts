import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { RoleModel } from './role.model'

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RoleModel,
        schemaOptions: {
          collection: 'Role',
        },
      },
    ]),
  ],
})
export class RoleModule {}
