import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusChecklistExecucao, StatusTarefaExecucao } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SalvarObservacaoDto } from '../dto/salvar-observacao.dto';

@Injectable()
export class ExecucoesTarefasService {
  constructor(private readonly prisma: PrismaService) {}

  async iniciar(execucaoId: number, usuarioId: number) {
    const execucao = await this.findExecucaoEditavel(execucaoId, usuarioId);

    if (!execucao.iniciadoEm) {
      await this.prisma.checklistExecucao.update({
        where: { id: execucaoId },
        data: { iniciadoEm: new Date(), status: StatusChecklistExecucao.EM_ANDAMENTO },
      });
    }

    return { message: 'Checklist iniciado com sucesso.' };
  }

  async salvarObservacao(execucaoId: number, tarefaExecucaoId: number, usuarioId: number, dto: SalvarObservacaoDto) {
    await this.findExecucaoEditavel(execucaoId, usuarioId);
    await this.findTarefaDaExecucao(execucaoId, tarefaExecucaoId);

    await this.prisma.checklistTarefaExecucao.update({
      where: { id: tarefaExecucaoId },
      data: { observacao: dto.observacao },
    });

    return { message: 'Observação salva com sucesso.' };
  }

  async concluir(execucaoId: number, tarefaExecucaoId: number, usuarioId: number) {
    await this.findExecucaoEditavel(execucaoId, usuarioId);
    const tarefaExecucao = await this.findTarefaDaExecucao(execucaoId, tarefaExecucaoId);

    if (tarefaExecucao.checklistTarefa.exigeFoto && !tarefaExecucao.foto) {
      throw new BadRequestException('Esta tarefa exige foto.');
    }

    if (tarefaExecucao.checklistTarefa.exigeObservacao && !tarefaExecucao.observacao) {
      throw new BadRequestException('Esta tarefa exige observação.');
    }

    await this.prisma.checklistTarefaExecucao.update({
      where: { id: tarefaExecucaoId },
      data: { status: StatusTarefaExecucao.CONCLUIDA, concluidoEm: new Date() },
    });

    await this.prisma.checklistExecucao.update({
      where: { id: execucaoId },
      data: { status: StatusChecklistExecucao.EM_ANDAMENTO, iniciadoEm: new Date() },
    });

    return { message: 'Tarefa concluída com sucesso.' };
  }

  private async findExecucaoEditavel(execucaoId: number, usuarioId: number) {
    const execucao = await this.prisma.checklistExecucao.findFirst({ where: { id: execucaoId, usuarioId } });
    if (!execucao) throw new NotFoundException('Execução não encontrada para este usuário.');
    if (execucao.status === StatusChecklistExecucao.CONCLUIDO) {
      throw new BadRequestException('Checklist já foi enviado e não pode ser alterado.');
    }
    return execucao;
  }

  private async findTarefaDaExecucao(execucaoId: number, tarefaExecucaoId: number) {
    const tarefaExecucao = await this.prisma.checklistTarefaExecucao.findFirst({
      where: { id: tarefaExecucaoId, checklistExecucaoId: execucaoId },
      include: { checklistTarefa: true, foto: true },
    });
    if (!tarefaExecucao) throw new NotFoundException('Tarefa da execução não encontrada.');
    return tarefaExecucao;
  }
}
