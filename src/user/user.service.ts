import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import {  UpdatePutUserDto } from './dto/update-put-user.dto';
import { UserEntity } from './entities/user.entity';
// ATENÇÃO AQUI:  o Repository é o ORM do TypeORM. NODE.
import { Repository } from 'typeorm';
// Já o InjectRepository é um decorador do NestJS que injeta o repositório de uma entidade específica.
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  // Essa parte abaixo do constructor é padrão no typeorm.
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) {

  }
  async create(data :CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('Este e-mail já está sendo usado.');
      }

      const user = this.userRepository.create(data);
      return await this.userRepository.save(user);
    } catch (error) {
      // Verifica se o erro é uma instância de ConflictException
      if (error instanceof ConflictException) {
        throw error;
      }
      // Lança uma exceção genérica para outros erros
      throw new InternalServerErrorException('Erro ao criar o usuário.');
    }
  
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
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Este e-mail já está sendo usado.');
      }
      if ( ! await this.findOne(id) ) {
        throw new NotFoundException(` - não encontrado.`);
      }
      else
        return this.userRepository.update(id,  updateUserDto    )
      } catch (error) {
        // Log do erro ou tratamento específico
        throw new InternalServerErrorException(`SERVICE: Erro ao atualizar o ID ${id}  - ${error.message}`);
      }
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
