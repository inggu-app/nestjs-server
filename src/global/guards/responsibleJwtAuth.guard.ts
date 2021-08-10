import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RESPONSIBLE_STRATEGY_NAME } from '../constants/strategies.constants'

@Injectable()
export class ResponsibleJwtAuthGuard extends AuthGuard(RESPONSIBLE_STRATEGY_NAME) {}
