import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(lojaId?: number) {
    return this.prisma.turno.findMany({
      where: lojaId ? { lojaId } : undefined,
      include: { loja: true },
      orderBy: [{ lojaId: 'asc' }, { nome: 'asc' }],
    });
  }

  async create(dto: CreateTurnoDto) {
    const loja = await this.prisma.loja.findUnique({ where: { id: dto.lojaId } });
    if (!loja) throw new NotFoundException('Loja não encontrada.');

    const existente = await this.prisma.turno.findUnique({
      where: { lojaId_nome: { lojaId: dto.lojaId, nome: dto.nome } },
    });

    if (existente) throw new BadRequestException('Já existe um turno com esse nome nesta loja.');

    const turno = await this.prisma.turno.create({ data: dto });
    return { message: 'Turno criado com sucesso.', data: turno };
  }

  async update(id: number, dto: UpdateTurnoDto) {
    const turno = await this.prisma.turno.findUnique({ where: { id } });
    if (!turno) throw new NotFoundException('Turno não encontrado.');

    const lojaId = dto.lojaId ?? turno.lojaId;
    const nome = dto.nome ?? turno.nome;

    const existente = await this.prisma.turno.findUnique({
      where: { lojaId_nome: { lojaId, nome } },
    });

    if (existente && existente.id !== id) {
      throw new BadRequestException('Já existe um turno com esse nome nesta loja.');
    }

    await this.prisma.turno.update({ where: { id }, data: dto });
    return { message: 'Turno atualizado com sucesso.' };
  }
}
