import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import {  UpdatePutUserDto } from './dto/update-put-user.dto';
import { UserEntity } from './entities/user.entity';
//import { Role } from '../enums/role.enum';

// ATENÇÃO AQUI:  o Repository é o ORM do TypeORM. NODE.
// Já o InjectRepository é um decorador do NestJS que injeta o repositório de uma entidade específica.
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class UserService {

  // Essa parte abaixo do constructor é padrão no typeorm.
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) {

  }
  async create(data :CreateUserDto) {
    if (
      await this.userRepository.exists({
        where: {
          email: data.email,
        },
      })
    ) {
      throw new BadRequestException('Este e-mail já está sendo usado.');
    }
    const user = this.userRepository.create(data);

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return (this.userRepository.findOneBy({
          id  
    }))
 }

  async update(id: number, updateUserDto: UpdatePutUserDto) {
    console.log(id)
    console.log(updateUserDto)
    return this.userRepository.update(id,  updateUserDto    )
 }

  async updatePartial(id: number, updatePatchUserDto: UpdatePatchUserDto ) {
    console.log(id)
    console.log(updatePatchUserDto)
    if( updatePatchUserDto.birth_at){
      updatePatchUserDto.birth_at = new Date(updatePatchUserDto.birth_at).toISOString();
      console.log(updatePatchUserDto.birth_at);
    }
    return this.userRepository.update(id,  updatePatchUserDto    )
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
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    await this.userRepository.delete( id );
    return `Usuário com ID ${id} - ${user.name} deletado com sucesso.`;
  }
  async existe(id: number) {
    if (
      !(await this.userRepository.exists({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
  
}
