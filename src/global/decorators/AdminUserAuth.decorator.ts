import { Availability } from '../../modules/adminUser/adminUser.model'
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AdminUserAuthGuard } from '../guards/adminUserAuth.guard'

interface AdminUserAuthOptions {
  availability: keyof Availability
}

export const AdminUserAuth = (options: AdminUserAuthOptions) => {
  return applyDecorators(SetMetadata('availability', options.availability), UseGuards(AdminUserAuthGuard))
}
