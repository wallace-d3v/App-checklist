import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

@Injectable()
export class LojasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.loja.findMany({ orderBy: { id: 'asc' } });
  }

  async create(dto: CreateLojaDto) {
    const existente = await this.prisma.loja.findUnique({ where: { codigo: dto.codigo } });

    if (existente) {
      throw new BadRequestException('Já existe uma loja com esse código.');
    }

    const loja = await this.prisma.loja.create({ data: dto });
    return { message: 'Loja criada com sucesso.', data: loja };
  }

  async update(id: number, dto: UpdateLojaDto) {
    await this.findById(id);

    if (dto.codigo) {
      const existente = await this.prisma.loja.findUnique({ where: { codigo: dto.codigo } });
      if (existente && existente.id !== id) {
        throw new BadRequestException('Já existe uma loja com esse código.');
      }
    }

    await this.prisma.loja.update({ where: { id }, data: dto });
    return { message: 'Loja atualizada com sucesso.' };
  }

  async setAtivo(id: number, ativo: boolean) {
    await this.findById(id);
    await this.prisma.loja.update({ where: { id }, data: { ativo } });
    return { message: ativo ? 'Loja ativada com sucesso.' : 'Loja inativada com sucesso.' };
  }

  private async findById(id: number) {
    const loja = await this.prisma.loja.findUnique({ where: { id } });
    if (!loja) {
      throw new NotFoundException('Loja não encontrada.');
    }
    return loja;
  }
}
