import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({ origin: ['http://localhost:3001', 'http://localhost:5000'] })
  }
  app.use(cookieParser())

  await app.listen(3000)
}

bootstrap()
