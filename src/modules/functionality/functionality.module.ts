import { CacheModule, Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { FunctionalityService } from './functionality.service'
import { FunctionalityController } from './functionality.controller'
import { FunctionalityGetRoutesMiddleware } from './functionalityGetRoutes.middleware'

@Global()
@Module({
  controllers: [FunctionalityController],
  imports: [
    CacheModule.register({
      ttl: 0,
    }),
  ],
  providers: [FunctionalityService],
  exports: [FunctionalityService],
})
export class FunctionalityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FunctionalityGetRoutesMiddleware).forRoutes({ path: '/', method: RequestMethod.GET })
  }
}
