import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from '../../configs/mongo.config'
import { RouterModule } from 'nest-router'
import { routesConfig } from '../../configs/routes.config'
import { ScheduleModule } from '../schedule/schedule.module'
import { SettingsModule } from '../settings/settings.module'
import { NoteModule } from '../note/note.module'
import { UserModule } from '../user/user.module'
import { RoleModule } from '../role/role.module'
import { FunctionalityModule } from '../functionality/functionality.module'
import { JwtModule } from '@nestjs/jwt'
import getJWTConfig from '../../configs/jwt.config'
import { InterfaceModule } from '../interface/interface.module'
import { ViewModule } from '../view/view.module'
import { FacultyModule } from '../faculty/faculty.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [
    ScheduleModule,
    SettingsModule,
    NoteModule,
    UserModule,
    RoleModule,
    FunctionalityModule,
    InterfaceModule,
    ViewModule,
    FacultyModule,
    GroupModule,
    RouterModule.forRoutes(routesConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    {
      ...JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getJWTConfig,
      }),
      global: true,
    },
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
