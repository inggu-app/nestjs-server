import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OWNER_STRATEGY_NAME } from '../constants/strategies.constants'

@Injectable()
export class OwnerJwtAuthGuard extends AuthGuard(OWNER_STRATEGY_NAME) {}
