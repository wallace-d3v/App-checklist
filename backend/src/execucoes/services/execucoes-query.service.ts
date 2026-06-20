import { Injectable, NotFoundException } from '@nestjs/common';
import { normalizeDate } from '../../common/utils/normalize-date';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExecucoesQueryService {
  constructor(private readonly prisma: PrismaService) {}

  findHoje(lojaId?: number) {
    const hoje = normalizeDate(new Date());
    return this.findByDate(hoje, lojaId);
  }

  findHistorico(lojaId?: number) {
    return this.prisma.checklistExecucao.findMany({
      where: lojaId ? { lojaId } : undefined,
      include: this.includeDefault(),
      orderBy: { data: 'desc' },
    });
  }

  findByUsuario(usuarioId: number) {
    return this.prisma.checklistExecucao.findMany({
      where: { usuarioId },
      include: this.includeDefault(),
      orderBy: { data: 'desc' },
    });
  }

  async findOne(id: number) {
    const execucao = await this.prisma.checklistExecucao.findUnique({
      where: { id },
      include: this.includeDetalhado(),
    });

    if (!execucao) throw new NotFoundException('Execução não encontrada.');
    return execucao;
  }

  async findOneDoUsuario(id: number, usuarioId: number) {
    const execucao = await this.prisma.checklistExecucao.findFirst({
      where: { id, usuarioId },
      include: this.includeDetalhado(),
    });

    if (!execucao) throw new NotFoundException('Execução não encontrada para este usuário.');
    return execucao;
  }

  private findByDate(data: Date, lojaId?: number) {
    return this.prisma.checklistExecucao.findMany({
      where: { data, ...(lojaId ? { lojaId } : {}) },
      include: this.includeDefault(),
      orderBy: { criadoEm: 'desc' },
    });
  }

  private includeDefault() {
    return { loja: true, usuario: true, checklistModelo: true };
  }

  private includeDetalhado() {
    return {
      loja: true,
      usuario: { include: { cargo: true, turno: true } },
      checklistModelo: true,
      tarefasExecucoes: {
        include: { checklistTarefa: true, foto: true },
        orderBy: { id: 'asc' as const },
      },
    };
  }
}
