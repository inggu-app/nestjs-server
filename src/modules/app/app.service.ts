import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Проект создан благодаря только лишь мне и, наверное, ей'
  }
}
