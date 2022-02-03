import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { AvailabilityDto, CreateAdminUserDto } from './dto/createAdminUser.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserService } from './adminUser.service'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { UpdateAdminUserDto } from './dto/updateAdminUser.dto'
import { UpdatePasswordDto } from './dto/updatePassword.dto'

@Controller()
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @UsePipes(new ValidationPipe())
  @Post('/')
  create(@Body() dto: CreateAdminUserDto) {
    return this.adminUserService.create(dto)
  }

  @Get('/by-id')
  getById(@MongoId('adminUserId') adminUserId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.adminUserService.getById(adminUserId, queryOptions)
  }

  @Get('/by-ids')
  getByIds(@MongoId('adminUserIds', { multiple: true }) adminUserIds: Types.ObjectId[], @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.adminUserService.getByIds(adminUserIds, queryOptions)
  }

  @Get('/many')
  async getMany(
    @Query('page', new CustomParseIntPipe({ intType: 'positive' })) page: number,
    @Query('count', new CustomParseIntPipe({ intType: 'positive' })) count: number,
    @Query('name') name?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      adminUsers: await this.adminUserService.getMany(page, count, name, queryOptions),
      count: await this.adminUserService.countMany(name),
    }
  }

  @UsePipes(new ValidationPipe())
  @Patch('/')
  update(@Body() dto: UpdateAdminUserDto) {
    return this.adminUserService.update(dto)
  }

  @UsePipes(new ValidationPipe())
  @Patch('/update-password')
  updatePassword(@MongoId('adminUserId') adminUserId: Types.ObjectId, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.adminUserService.updatePassword(adminUserId, updatePasswordDto.password)
  }

  @UsePipes(new ValidationPipe())
  @Patch('/update-availability')
  updateAvailability(@MongoId('adminUserId') adminUserId: Types.ObjectId, @Body() updateAvailabilityDto: AvailabilityDto) {
    return this.adminUserService.updateAvailability(adminUserId, updateAvailabilityDto)
  }

  @Delete('/')
  deleteById(@MongoId('adminUserId') adminUserId: Types.ObjectId) {
    return this.adminUserService.deleteById(adminUserId)
  }
}
