import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { FunctionalityFieldsEnum, RegisterFunctionality } from './functionality.constants'
import { ObjectByInterface } from '../../global/types'
import { Error } from 'mongoose'
import { FUNCTIONALITY_WITH_CODE_NOT_FOUND } from '../../global/constants/errors.constants'

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

  getByCode(code: RegisterFunctionality['code']) {
    this.checkExists({ code })
    return FunctionalityService.initializableFunctionalities.find(f => f.code === code) as RegisterFunctionality
  }

  async getMany() {
    return (await this._get()) || []
  }

  private _get(): Promise<RegisterFunctionality[] | undefined> {
    return this.cacheManager.get(FUNCTIONALITIES_CACHE_KEY)
  }

  private async _set(functionalities: RegisterFunctionality[]) {
    await this.cacheManager.set(FUNCTIONALITIES_CACHE_KEY, functionalities)
  }

  checkExists(
    filter: ObjectByInterface<typeof FunctionalityFieldsEnum> | ObjectByInterface<typeof FunctionalityFieldsEnum>[],
    options: { error?: ((filter: ObjectByInterface<typeof FunctionalityFieldsEnum>) => Error) | Error; checkExisting?: boolean } = {
      error: f => new NotFoundException(FUNCTIONALITY_WITH_CODE_NOT_FOUND(f.code)),
      checkExisting: true,
    }
  ) {
    if (Array.isArray(filter)) {
      for (const f of filter) {
        const candidate = FunctionalityService.initializableFunctionalities.find(functionality => functionality.code === f.code)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = FunctionalityService.initializableFunctionalities.find(functionality => functionality.code === filter.code)
      if (!candidate && options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      } else if (candidate && !options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      }
    }

    return true
  }
}
