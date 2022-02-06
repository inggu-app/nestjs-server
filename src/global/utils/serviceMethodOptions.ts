import { CheckExistenceService } from '../classes/CheckExistenceService'
import { ServiceMethodOptions } from '../types'

export const checkOptionsForServiceMethodExistence = <Service extends CheckExistenceService>(
  object: Record<
    keyof Omit<Pick<Service, keyof Service>, keyof Pick<CheckExistenceService, keyof CheckExistenceService>>,
    Required<ServiceMethodOptions>
  >
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) => {}

export const mergeOptionsWithDefaultOptions = <T extends string>(
  options: ServiceMethodOptions<T>,
  defaultOptions: Required<ServiceMethodOptions<T>>
): Required<ServiceMethodOptions<T>> => {
  return {
    checkExistence: {
      ...defaultOptions.checkExistence,
      ...options.checkExistence,
    },
  }
}
