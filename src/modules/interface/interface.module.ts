import { forwardRef, Module } from '@nestjs/common'
import { InterfaceService } from './interface.service'
import { InterfaceController } from './interface.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { InterfaceModel } from './interface.model'
import { RoleModule } from '../role/role.module'

@Module({
  controllers: [InterfaceController],
  providers: [InterfaceService],
  imports: [
    forwardRef(() => RoleModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: InterfaceModel,
      },
    ]),
  ],
  exports: [InterfaceService],
})
export class InterfaceModule {}
