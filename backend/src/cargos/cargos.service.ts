import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

@Injectable()
export class CargosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.cargo.findMany({ orderBy: { nome: 'asc' } });
  }

  async create(dto: CreateCargoDto) {
    const existente = await this.prisma.cargo.findUnique({ where: { nome: dto.nome } });
    if (existente) {
      throw new BadRequestException('Já existe um cargo com esse nome.');
    }
    const cargo = await this.prisma.cargo.create({ data: dto });
    return { message: 'Cargo criado com sucesso.', data: cargo };
  }

  async update(id: number, dto: UpdateCargoDto) {
    const cargo = await this.prisma.cargo.findUnique({ where: { id } });
    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado.');
    }

    if (dto.nome && dto.nome !== cargo.nome) {
      const existente = await this.prisma.cargo.findUnique({ where: { nome: dto.nome } });
      if (existente) {
        throw new BadRequestException('Já existe um cargo com esse nome.');
      }
    }

    await this.prisma.cargo.update({ where: { id }, data: dto });
    return { message: 'Cargo atualizado com sucesso.' };
  }
}
