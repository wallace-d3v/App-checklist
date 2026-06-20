import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChecklistsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.checklistModelo.findMany({
      include: {
        loja: true,
        cargo: true,
        turno: true,
        usuario: true,
        _count: { select: { tarefas: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findOne(id: number) {
    const checklist = await this.prisma.checklistModelo.findUnique({
      where: { id },
      include: {
        loja: true,
        cargo: true,
        turno: true,
        usuario: true,
        tarefas: { orderBy: { ordem: 'asc' } },
      },
    });

    if (!checklist) {
      throw new NotFoundException('Checklist não encontrado.');
    }

    return checklist;
  }
}
