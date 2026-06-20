import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTarefaDto } from '../dto/create-tarefa.dto';
import { ReordenarTarefasDto } from '../dto/reordenar-tarefas.dto';
import { UpdateTarefaDto } from '../dto/update-tarefa.dto';
import { ChecklistsQueryService } from './checklists-query.service';

@Injectable()
export class ChecklistTarefasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checklistsQuery: ChecklistsQueryService,
  ) {}

  async create(checklistId: number, dto: CreateTarefaDto) {
    await this.checklistsQuery.findOne(checklistId);

    const tarefa = await this.prisma.checklistTarefa.create({
      data: {
        checklistModeloId: checklistId,
        titulo: dto.titulo,
        secao: dto.secao,
        grupo: dto.grupo,
        subgrupo: dto.subgrupo,
        exigeFoto: dto.exigeFoto ?? false,
        exigeObservacao: dto.exigeObservacao ?? false,
        ordem: dto.ordem,
      },
    });

    return { message: 'Tarefa criada com sucesso.', data: tarefa };
  }

  async update(checklistId: number, tarefaId: number, dto: UpdateTarefaDto) {
    await this.findTarefa(checklistId, tarefaId);
    await this.prisma.checklistTarefa.update({ where: { id: tarefaId }, data: dto });
    return { message: 'Tarefa atualizada com sucesso.' };
  }

  async remove(checklistId: number, tarefaId: number) {
    await this.findTarefa(checklistId, tarefaId);
    await this.prisma.checklistTarefa.delete({ where: { id: tarefaId } });
    return { message: 'Tarefa removida com sucesso.' };
  }

  async reordenar(checklistId: number, dto: ReordenarTarefasDto) {
    await this.checklistsQuery.findOne(checklistId);

    for (const item of dto.tarefas) {
      await this.findTarefa(checklistId, item.id);
      await this.prisma.checklistTarefa.update({
        where: { id: item.id },
        data: { ordem: item.ordem },
      });
    }

    return { message: 'Tarefas reordenadas com sucesso.' };
  }

  private async findTarefa(checklistId: number, tarefaId: number) {
    const tarefa = await this.prisma.checklistTarefa.findFirst({
      where: { id: tarefaId, checklistModeloId: checklistId },
    });

    if (!tarefa) {
      throw new NotFoundException('Tarefa não encontrada neste checklist.');
    }

    return tarefa;
  }
}
