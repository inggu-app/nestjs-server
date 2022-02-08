import { ModelType } from '@typegoose/typegoose/lib/types'
import { Error, FilterQuery } from 'mongoose'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'

interface CheckWithOneFilterOptions<T> {
  error?: string | Error | ((filter: T) => string | Error)
}

interface CheckWithManyFiltersOptions<T> {
  error: (filter: T) => string | Error
}

export class CheckExistenceService<Model = any> {
  constructor(
    private readonly model: ModelType<Model>,
    private readonly defaultMessageForExisting?: string | ((arg: Model) => string),
    private readonly defaultMessageForNotExisting?: string | ((arg: Model) => string)
  ) {}

  async throwIfExists<T extends FilterQuery<DocumentType<Model>>>(filter: T, options?: CheckWithOneFilterOptions<T>): Promise<void>
  async throwIfExists<T extends FilterQuery<DocumentType<Model>>>(filter: T[], options?: CheckWithManyFiltersOptions<T>): Promise<void>
  async throwIfExists<T extends FilterQuery<DocumentType<Model>>>(
    filter: T | T[],
    options?: CheckWithOneFilterOptions<T> | CheckWithManyFiltersOptions<T>
  ): Promise<void> {
    return this.check(filter, async f => await this.model.exists(f), BadRequestException, this.defaultMessageForExisting, options)
  }

  async throwIfNotExists<T extends FilterQuery<DocumentType<Model>>>(filter: T, options?: CheckWithOneFilterOptions<T>): Promise<void>
  async throwIfNotExists<T extends FilterQuery<DocumentType<Model>>>(filter: T[], options?: CheckWithManyFiltersOptions<T>): Promise<void>
  async throwIfNotExists<T extends FilterQuery<DocumentType<Model>>>(
    filter: T | T[],
    options?: CheckWithOneFilterOptions<T> | CheckWithManyFiltersOptions<T>
  ): Promise<void> {
    return this.check(filter, async f => !(await this.model.exists(f)), NotFoundException, this.defaultMessageForNotExisting, options)
  }

  private async check<T extends FilterQuery<DocumentType<Model>>>(
    filter: T | T[],
    condition: (filter: T) => Promise<boolean>,
    error: typeof BadRequestException | typeof NotFoundException,
    defaultMessage?: string | ((...args: any) => string),
    options?: CheckWithOneFilterOptions<T> | CheckWithManyFiltersOptions<T>
  ) {
    const castedFilter = Array.isArray(filter) ? filter : [filter]

    for await (const f of castedFilter) {
      if (await condition(f)) {
        if (options?.error) {
          if (typeof options.error === 'function') {
            if (typeof options.error(f) === 'string') throw new error(options.error(f))
            else throw options.error(f)
          } else if (typeof options.error === 'string') throw new error(options.error)
          else throw options.error
        } else {
          if (typeof defaultMessage === 'function') throw new error(defaultMessage(f as T))
          else throw new error(defaultMessage)
        }
      }
    }
  }
}
