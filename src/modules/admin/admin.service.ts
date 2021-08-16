import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import * as bcrypt from 'bcrypt'
import { AdminModel } from './admin.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateAdminDto } from './dto/createAdmin.dto'
import generateUniqueKey from '../../global/utils/generateUniqueKey'
import generatePassword from '../../global/utils/generatePassword'
import { hashSalt } from '../../global/constants/other.constants'
import { Types } from 'mongoose'
import {
  ADMIN_EXISTS,
  ADMIN_WITH_ID_NOT_FOUND,
  ADMIN_WITH_LOGIN_NOT_FOUND,
} from './admin.constants'
import { UpdateAdminDto } from './dto/updateAdmin.dto'
import { LoginAdminDto } from './dto/loginAdmin.dto'
import { INCORRECT_CREDENTIALS } from '../../global/constants/errors.constants'
import { JwtService } from '@nestjs/jwt'
import { ADMIN_ACCESS_TOKEN_DATA, JwtType } from '../../global/utils/checkJwtType'

export interface AdminAccessTokenData extends JwtType<typeof ADMIN_ACCESS_TOKEN_DATA> {
  tokenType: typeof ADMIN_ACCESS_TOKEN_DATA
  type: 'ADMIN'
  login: string
  name: string
  uniqueKey: string
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminModel) private readonly adminModel: ModelType<AdminModel>,
    private readonly jwtService: JwtService
  ) {}

  async create(dto: CreateAdminDto) {
    const candidate = await this.adminModel.findOne({ login: dto.login })

    if (candidate) {
      throw new HttpException(ADMIN_EXISTS(dto.login), HttpStatus.BAD_REQUEST)
    }

    const generatedUniqueKey = generateUniqueKey()
    const hashedUniqueKey = await bcrypt.hash(generatedUniqueKey, hashSalt)
    const generatedPassword = generatePassword(20)
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)

    const admin = await this.adminModel.create({
      name: dto.name,
      login: dto.login,
      hashedUniqueKey,
      hashedPassword,
    })

    return {
      id: admin.id,
      name: admin.name,
      login: admin.login,
      password: generatedPassword,
      uniqueKey: generatedUniqueKey,
    }
  }

  async resetPassword(id: Types.ObjectId) {
    const generatedPassword = generatePassword(20)
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)
    const candidate = await this.adminModel.findByIdAndUpdate(id, { $set: { hashedPassword } })

    if (!candidate) {
      throw new HttpException(ADMIN_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return {
      password: generatedPassword,
    }
  }

  async getById(id: Types.ObjectId) {
    const candidate = await this.adminModel.findById(id, { hashedUniqueKey: 0, hashedPassword: 0 })

    if (!candidate) {
      throw new HttpException(ADMIN_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  getAll() {
    return this.adminModel.find({}, { hashedUniqueKey: 0, hashedPassword: 0 })
  }

  async getByLogin(login: string) {
    const candidate = await this.adminModel.findOne({ login })

    if (!candidate) {
      throw new HttpException(ADMIN_WITH_LOGIN_NOT_FOUND(login), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async update(dto: UpdateAdminDto) {
    const candidate = await this.adminModel.findByIdAndUpdate(dto.id, {
      $set: { name: dto.name, login: dto.login },
    })

    if (!candidate) {
      throw new HttpException(ADMIN_WITH_ID_NOT_FOUND(dto.id), HttpStatus.NOT_FOUND)
    }

    return this.adminModel.findById(dto.id, { hashedUniqueKey: 0, hashedPassword: 0 })
  }

  async delete(id: Types.ObjectId) {
    const candidate = await this.adminModel.findByIdAndDelete(id, {
      projection: { hashedUniqueKey: 0, hashedPassword: 0 },
    })

    if (!candidate) {
      throw new HttpException(ADMIN_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async login(dto: LoginAdminDto) {
    const generatedUniqueKey = generateUniqueKey()
    const hashedUniqueKey = await bcrypt.hash(generatedUniqueKey, hashSalt)
    const candidate = await this.adminModel.findOneAndUpdate(
      { login: dto.login },
      { $set: { hashedUniqueKey } }
    )

    if (!candidate) {
      throw new HttpException(INCORRECT_CREDENTIALS, HttpStatus.BAD_REQUEST)
    }

    const isRightPassword = await bcrypt.compare(dto.password, candidate.hashedPassword)

    if (!isRightPassword) {
      throw new HttpException(INCORRECT_CREDENTIALS, HttpStatus.UNAUTHORIZED)
    } else {
      const accessTokenData: AdminAccessTokenData = {
        tokenType: ADMIN_ACCESS_TOKEN_DATA,
        type: 'ADMIN',
        login: candidate.login,
        name: candidate.name,
        uniqueKey: generatedUniqueKey,
      }
      return {
        accessToken: this.jwtService.sign(accessTokenData),
      }
    }
  }
}
