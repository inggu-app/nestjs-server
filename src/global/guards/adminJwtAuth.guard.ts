import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ADMIN_STRATEGY_NAME } from '../constants/strategies.constants'

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard(ADMIN_STRATEGY_NAME) {}
