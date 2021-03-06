import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from '../../configs/mongo.config'
import { RouterModule } from 'nest-router'
import { scheduleModuleConfig } from '../../configs/scheduleModule.config'
import { ScheduleModule } from '../schedule/schedule.module'
import { SettingsModule } from '../settings/settings.module'
import { ResponsibleModule } from '../responsible/responsible.module'
import { AdminModule } from '../admin/admin.module'

@Module({
  imports: [
    ScheduleModule,
    SettingsModule,
    ResponsibleModule,
    AdminModule,
    RouterModule.forRoutes(scheduleModuleConfig),
    ConfigModule.forRoot(),
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
