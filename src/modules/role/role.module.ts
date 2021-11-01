import { forwardRef, Global, Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { RoleModel } from './role.model'
import { ViewModule } from '../view/view.module'

@Global()
@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    forwardRef(() => ViewModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: RoleModel,
      },
    ]),
  ],
  exports: [RoleService],
})
export class RoleModule {}
