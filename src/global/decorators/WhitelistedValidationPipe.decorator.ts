import { UsePipes, ValidationPipe } from '@nestjs/common'

export function WhitelistedValidationPipe() {
  return UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
}
