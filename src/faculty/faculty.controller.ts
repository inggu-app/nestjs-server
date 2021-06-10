import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/create-faculty.dto'

@Controller()
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @UsePipes(new ValidationPipe())
  @Post('/create')
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto)
  }

  @Get('/get/dropdown')
  getAllForDropdown() {
    return this.facultyService.getAllForDropdown()
  }
}
