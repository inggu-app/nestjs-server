import { Module } from '@nestjs/common'
import { ViewController } from './view.controller'
import { ViewService } from './view.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { ViewModel } from './view.model'
import { InterfaceModule } from '../interface/interface.module'
import { RoleModule } from '../role/role.module'

@Module({
  controllers: [ViewController],
  providers: [ViewService],
  imports: [
    InterfaceModule,
    RoleModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: ViewModel,
      },
    ]),
  ],
  exports: [ViewService],
})
export class ViewModule {}
