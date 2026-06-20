import { Injectable } from '@nestjs/common';
import { normalizeDate } from '../common/utils/normalize-date';
import { ExecucoesQueryService } from '../execucoes/services/execucoes-query.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly execucoesQuery: ExecucoesQueryService,
  ) {}

  checklistHoje(usuarioId: number) {
    const hoje = normalizeDate(new Date());
    return this.prisma.checklistExecucao.findMany({
      where: { usuarioId, data: hoje },
      include: {
        checklistModelo: true,
        tarefasExecucoes: { include: { checklistTarefa: true, foto: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  minhasExecucoes(usuarioId: number) {
    return this.execucoesQuery.findByUsuario(usuarioId);
  }

  minhaExecucao(id: number, usuarioId: number) {
    return this.execucoesQuery.findOneDoUsuario(id, usuarioId);
  }
}
