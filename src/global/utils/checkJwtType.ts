import { UnauthorizedException } from '@nestjs/common'
import { AdminAccessTokenData } from '../../modules/admin/admin.service'
import { OwnerAccessTokenData } from '../strategies/ownerJwt.strategy'
import { ResponsibleAccessTokenData } from '../../modules/responsible/responsible.service'

export const OWNER_ACCESS_TOKEN_DATA = 'OWNER_ACCESS_TOKEN_DATA'
export const ADMIN_ACCESS_TOKEN_DATA = 'ADMIN_ACCESS_TOKEN_DATA'
export const RESPONSIBLE_ACCESS_TOKEN_DATA = 'RESPONSIBLE_ACCESS_TOKEN_DATA'

export const ownerExampleAccessTokenData: OwnerAccessTokenData = {
  tokenType: OWNER_ACCESS_TOKEN_DATA,
  login: '',
  password: '',
}

export const adminExampleAccessTokenData: AdminAccessTokenData = {
  type: 'ADMIN',
  tokenType: ADMIN_ACCESS_TOKEN_DATA,
  name: '',
  login: '',
  uniqueKey: '',
}

export const responsibleExampleAccessTokenData: ResponsibleAccessTokenData = {
  tokenType: RESPONSIBLE_ACCESS_TOKEN_DATA,
  login: '',
  name: '',
  uniqueKey: '',
  groups: [],
}

export interface JwtType<T> {
  tokenType: T
  [key: string]: any
}

export function checkJwtType(
  accessTokenData: JwtType<
    | typeof OWNER_ACCESS_TOKEN_DATA
    | typeof ADMIN_ACCESS_TOKEN_DATA
    | typeof RESPONSIBLE_ACCESS_TOKEN_DATA
  >,
  currentAccessTokenData:
    | typeof ownerExampleAccessTokenData
    | typeof adminExampleAccessTokenData
    | typeof responsibleExampleAccessTokenData
) {
  if (accessTokenData.tokenType !== currentAccessTokenData.tokenType)
    throw new UnauthorizedException()

  if (
    Object.keys(currentAccessTokenData).filter(field => accessTokenData[field] === undefined)
      .length === 0
  )
    return true

  throw new UnauthorizedException()
}
