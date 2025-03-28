import { Controller, Get, Post, Body, Put, Patch, Param, Delete, ParseIntPipe, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    //return this.userService.create(data);
    try {
      return this.userService.create(data)
    } catch (error) {
      console.log('passei no catch do controller', error.message)

        throw new ConflictException(error.message);
        throw new InternalServerErrorException('Erro ao criar o usuário.');        
    }

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
    try {
      const updatedUser = await this.userService.update(+id, updatePutUserDto);
      return {
        method: 'put',
        data: updatePutUserDto,
        id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`CONTROLLER: Usuário com ID ${id} não encontrado.`, error.message);
      }
      throw new InternalServerErrorException(`INTERNAL CONTROLLER: Erro ao atualizar o ID ${id}.`, error.message);
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
