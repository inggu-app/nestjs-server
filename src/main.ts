import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import { checkEnvVariables } from './global/utils/checkEnvVariables'
import * as basicAuth from 'express-basic-auth'
import { envVariables } from './global/constants/envVariables.constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({ origin: ['http://localhost:3001', 'http://localhost:5000'] })
  }

  if (process.env.NODE_ENV === 'production')
    app.use(
      ['/api', '/api-json'],
      basicAuth({
        challenge: true,
        users: {
          [process.env[envVariables.swaggerUserLogin] as string]: process.env[envVariables.swaggerUserPassword] as string,
        },
      })
    )

  const config = new DocumentBuilder()
    .setTitle('IngGU Schedule API')
    .setVersion(process.env.npm_package_version as string)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())
  checkEnvVariables()
  await app.listen(3000)
}

bootstrap()
