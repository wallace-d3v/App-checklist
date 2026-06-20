import { Injectable } from '@nestjs/common';
import { DiaSemana } from '@prisma/client';
import { generateConfirmationCode } from '../../common/utils/generate-confirmation-code';
import { normalizeDate } from '../../common/utils/normalize-date';
import { PrismaService } from '../../prisma/prisma.service';
import { GerarExecucoesDto } from '../dto/gerar-execucoes.dto';

@Injectable()
export class ExecucoesGeracaoService {
  constructor(private readonly prisma: PrismaService) {}

  async gerarDoDia(dto: GerarExecucoesDto) {
    const data = normalizeDate(dto.data ? new Date(dto.data) : new Date());
    const diaSemana = this.getDiaSemana(data);

    const modelos = await this.prisma.checklistModelo.findMany({
      where: { ativo: true, ...(dto.lojaId ? { lojaId: dto.lojaId } : {}) },
      include: { tarefas: true, cargo: true },
    });

    let execucoesCriadas = 0;
    let execucoesIgnoradas = 0;

    for (const modelo of modelos) {
      if (modelo.cargo.nome.toLowerCase() !== 'gerente') continue;

      const gerentes = await this.prisma.usuario.findMany({
        where: {
          ativo: true,
          lojaId: modelo.lojaId,
          cargoId: modelo.cargoId,
          ...(modelo.turnoId ? { turnoId: modelo.turnoId } : {}),
          ...(modelo.usuarioId ? { id: modelo.usuarioId } : {}),
        },
      });

      for (const gerente of gerentes) {
        if (gerente.diaFolga === diaSemana) {
          execucoesIgnoradas++;
          continue;
        }

        const existente = await this.prisma.checklistExecucao.findUnique({
          where: {
            checklistModeloId_usuarioId_data: {
              checklistModeloId: modelo.id,
              usuarioId: gerente.id,
              data,
            },
          },
        });

        if (existente) {
          execucoesIgnoradas++;
          continue;
        }

        await this.prisma.checklistExecucao.create({
          data: {
            lojaId: modelo.lojaId,
            checklistModeloId: modelo.id,
            usuarioId: gerente.id,
            data,
            codigoConfirmacao: generateConfirmationCode(),
            tarefasExecucoes: {
              create: modelo.tarefas.map((tarefa) => ({ checklistTarefaId: tarefa.id })),
            },
          },
        });

        execucoesCriadas++;
      }
    }

    return { message: 'Checklists do dia gerados com sucesso.', data: { execucoesCriadas, execucoesIgnoradas } };
  }

  private getDiaSemana(data: Date): DiaSemana {
    const dias = [DiaSemana.DOMINGO, DiaSemana.SEGUNDA, DiaSemana.TERCA, DiaSemana.QUARTA, DiaSemana.QUINTA, DiaSemana.SEXTA, DiaSemana.SABADO];
    return dias[data.getDay()];
  }
}
