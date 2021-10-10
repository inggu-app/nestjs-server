import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { RegisterFunctionality } from './functionality.constants'

export const FUNCTIONALITIES_CACHE_KEY = 'functionalities'

@Injectable()
export class FunctionalityService {
  static initializableFunctionalities: RegisterFunctionality[] = []
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    cacheManager
      .reset()
      .then(() =>
        this.create(FunctionalityService.initializableFunctionalities).then(() => console.log('Функциональности инициализированы'))
      )
  }

  private async create(functionality: RegisterFunctionality | RegisterFunctionality[]) {
    await this._set([])
    let currentFunctionalities = ((await this._get()) || []) as RegisterFunctionality[]

    if (Array.isArray(functionality)) {
      functionality.forEach(f => {
        if (currentFunctionalities.find(f1 => f1.code === f.code)) {
          throw new Error(`Код ${f.code} функциональности повторяется`)
        }
      })
      currentFunctionalities = [...currentFunctionalities, ...functionality]
    } else {
      if (currentFunctionalities.find(f1 => f1.code === functionality.code)) {
        throw new Error(`Код ${functionality.code} функциональности повторяется`)
      }
      currentFunctionalities = [...currentFunctionalities, functionality]
    }

    await this._set(currentFunctionalities)

    return
  }

  async getByCode(code: RegisterFunctionality['code']) {
    const currentFunctionalities = await this._get()

    return currentFunctionalities?.find(f => f.code === code)
  }

  async getMany() {
    return (await this._get()) || []
  }

  private async _get(): Promise<RegisterFunctionality[] | undefined> {
    return this.cacheManager.get(FUNCTIONALITIES_CACHE_KEY)
  }

  private async _set(functionalities: RegisterFunctionality[]) {
    await this.cacheManager.set(FUNCTIONALITIES_CACHE_KEY, functionalities)
  }
}
