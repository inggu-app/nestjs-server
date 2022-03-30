import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({ origin: ['http://localhost:3001', 'http://localhost:5000'] })
  }
  const config = new DocumentBuilder()
    .setTitle('IngGU Schedule API')
    .setVersion(process.env.npm_package_version as string)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())

  await app.listen(3000)
}

bootstrap()
