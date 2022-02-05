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
import { JwtModule } from '@nestjs/jwt'
import getJWTConfig from '../../configs/jwt.config'
import { FacultyModule } from '../faculty/faculty.module'
import { GroupModule } from '../group/group.module'
import { AdminUserModule } from '../adminUser/adminUser.module'
import { CallScheduleModule } from '../callSchedule/callSchedule.module'

@Module({
  imports: [
    ScheduleModule,
    SettingsModule,
    NoteModule,
    FacultyModule,
    GroupModule,
    RouterModule.forRoutes(routesConfig),
    AdminUserModule,
    CallScheduleModule,
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
