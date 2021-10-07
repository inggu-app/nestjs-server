import { CacheModule, Global, Module } from '@nestjs/common'
import { FunctionalityService } from './functionality.service'

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
    }),
  ],
  providers: [FunctionalityService],
  exports: [FunctionalityService],
})
export class FunctionalityModule {}
