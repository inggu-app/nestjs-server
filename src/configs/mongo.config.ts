import { ConfigService } from '@nestjs/config'
import { TypegooseModuleOptions } from 'nestjs-typegoose'
import { envVariables } from '../global/constants/envVariables.constants'

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  }
}

const getMongoString = (configService: ConfigService) => {
  return (
    'mongodb://' +
    configService.get(envVariables.mongoLogin) +
    ':' +
    configService.get(envVariables.mongoPassword) +
    '@' +
    configService.get(envVariables.mongoHost) +
    ':' +
    configService.get(envVariables.mongoPort) +
    '/' +
    configService.get(envVariables.mongoAuthDatabase)
  )
}

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
