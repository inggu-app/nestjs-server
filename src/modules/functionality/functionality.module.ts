import { CacheModule, Global, Module } from '@nestjs/common'
import { FunctionalityService } from './functionality.service'
import { FunctionalityController } from './functionality.controller'

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
export class FunctionalityModule {}
