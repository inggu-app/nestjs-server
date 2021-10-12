import { Controller, Get } from '@nestjs/common'
import { FunctionalityService } from './functionality.service'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { defaultFunctionalityGetManyData, FunctionalityRoutesEnum } from './functionality.constants'

@Controller()
export class FunctionalityController {
  constructor(private readonly functionalityService: FunctionalityService) {}

  @Functionality({
    code: FunctionalityCodesEnum.FUNCTIONALITIES__GET,
    default: defaultFunctionalityGetManyData,
    title: 'Запросить список функциональностей',
  })
  @Get(FunctionalityRoutesEnum.GET_MANY)
  getMany() {
    return this.functionalityService.getMany()
  }
}
