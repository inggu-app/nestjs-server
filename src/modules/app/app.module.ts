import { Module } from '@nestjs/common'
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
import { UserModule } from '../user/user.module'
import { AppVersionModule } from '../appVersion/appVersion.module'
import { CheckExistsValidator } from '../../global/decorators/CheckExists.decorator'

@Module({
  imports: [
    ScheduleModule,
    SettingsModule,
    NoteModule,
    FacultyModule,
    GroupModule,
    RouterModule.forRoutes(routesConfig),
    UserModule,
    AppVersionModule,
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
  providers: [AppService, CheckExistsValidator],
})
export class AppModule {}
