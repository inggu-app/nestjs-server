import { enumKeyValuesMatch } from '../utils/enumKeysValues'

export enum ClientInterfacesEnum {
  MAIN_MOBILE_APP = 'MAIN_MOBILE_APP',
  ADMIN_MOBILE_APP = 'ADMIN_MOBILE_APP',
  ADMIN_WEB_APP = 'ADMIN_WEB_APP',
}

enumKeyValuesMatch(ClientInterfacesEnum)
