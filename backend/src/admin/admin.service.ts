import { Injectable } from '@nestjs/common';
import { StatusChecklistExecucao, StatusTarefaExecucao } from '@prisma/client';
import { normalizeDate } from '../common/utils/normalize-date';
import { ExecucoesQueryService } from '../execucoes/services/execucoes-query.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execucoesQuery: ExecucoesQueryService,
  ) {}

  async dashboard(lojaId?: number) {
    const hoje = normalizeDate(new Date());
    const execucaoWhere = { data: hoje, ...(lojaId ? { lojaId } : {}) };

    const [concluidos, pendentes, emAndamento, tarefasConcluidas, tarefasPendentes] = await Promise.all([
      this.prisma.checklistExecucao.count({ where: { ...execucaoWhere, status: StatusChecklistExecucao.CONCLUIDO } }),
      this.prisma.checklistExecucao.count({ where: { ...execucaoWhere, status: StatusChecklistExecucao.PENDENTE } }),
      this.prisma.checklistExecucao.count({ where: { ...execucaoWhere, status: StatusChecklistExecucao.EM_ANDAMENTO } }),
      this.prisma.checklistTarefaExecucao.count({ where: { checklistExecucao: { is: execucaoWhere }, status: StatusTarefaExecucao.CONCLUIDA } }),
      this.prisma.checklistTarefaExecucao.count({ where: { checklistExecucao: { is: execucaoWhere }, status: StatusTarefaExecucao.PENDENTE } }),
    ]);

    return { data: hoje, resumo: { concluidos, pendentes, emAndamento, tarefasConcluidas, tarefasPendentes } };
  }

  enviosHoje(lojaId?: number) {
    return this.execucoesQuery.findHoje(lojaId);
  }

  historico(lojaId?: number) {
    return this.execucoesQuery.findHistorico(lojaId);
  }

  envioDetalhe(id: number) {
    return this.execucoesQuery.findOne(id);
  }
}
