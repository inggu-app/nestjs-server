import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from './configs/mongo.config'
import { RouterModule } from 'nest-router'
import { scheduleModuleConfig } from './configs/scheduleModule.config'
import { ScheduleModule } from './schedule/schedule.module'

@Module({
  imports: [
    ScheduleModule,
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
