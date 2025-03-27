import { Controller, Get, Post, Body, Put, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // forma 01: esta é uma forma de fazer o update
  // @Put(':id')
  // async update(@Param('id') id: string, @Body() updatePutUserDto: UpdatePutUserDto) {
  //   return this.userService.update(+id, updatePutUserDto);
  // }

  // forma 02: esta é uma forma de fazer o update.
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePutUserDto: UpdatePutUserDto) {
    this.userService.update(+id, updatePutUserDto);
    return {
      method: 'put',
      updatePutUserDto,
      id
    }
  }
  @Patch(':id')
  async updatePartial(@Param('id') id: string, @Body() updatePatchUserDto: UpdatePatchUserDto) {
    return this.userService.updatePartial(+id, updatePatchUserDto);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.userService.delete(+id);
  // }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe)  id: number) {
    return this.userService.delete(id);
  }
}
