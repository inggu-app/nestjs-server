import { objectKeys } from './objectKeys'
import { envVariables } from '../constants/envVariables.constants'
import { InternalServerErrorException } from '@nestjs/common'

export const checkEnvVariables = () => {
  objectKeys(envVariables).forEach(variable => {
    if (!process.env[envVariables[variable]])
      throw new InternalServerErrorException(`Необходимо задать переменную окружения ${envVariables[variable]}`)
  })
}
