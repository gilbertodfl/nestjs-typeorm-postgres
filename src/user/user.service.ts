import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import {  UpdatePutUserDto } from './dto/update-put-user.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor( private readonly prisma: PrismaService) {

  }
  async create(data :CreateUserDto) {
    //console.log(data);
    try{
      await this.prisma.user.create({
      data: data,
      select: {
        id: true,
      }
    }
    )
  } catch (error) {
    console.error(error);
    return `An error has occured`;
  }
    return data;    
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return (this.prisma.user.findUnique({
      where: {
        id: id  
      }
    }))
 }

  async update(id: number, updateUserDto: UpdatePutUserDto) {
    console.log(id)
    console.log(updateUserDto)
    return this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: id  
      }
    
     })
 }

  async updatePartial(id: number, updatePatchUserDto: UpdatePatchUserDto ) {
    console.log(id)
    console.log(updatePatchUserDto)
    if( updatePatchUserDto.birth_at){
      updatePatchUserDto.birth_at = new Date(updatePatchUserDto.birth_at).toISOString();
      console.log(updatePatchUserDto.birth_at);
    }
    return this.prisma.user.update({
      data: updatePatchUserDto,
      where: {
        id: id  
      }
    
     })
  }

  // async delete(id: number) {
  //   console.log(id)
  //   this.prisma.user.delete({
  //     where: {
  //       id
  //     }
  //   });
  //   return `Delete id: #${id} `;
  // }
  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    await this.prisma.user.delete({
      where: { id },
    });
    return `Usuário com ID ${id} - ${user.name} deletado com sucesso.`;
  }
  
}
