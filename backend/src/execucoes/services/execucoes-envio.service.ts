import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusChecklistExecucao } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EnviarExecucaoDto } from '../dto/enviar-execucao.dto';

@Injectable()
export class ExecucoesEnvioService {
  constructor(private readonly prisma: PrismaService) {}

  async enviar(execucaoId: number, dto: EnviarExecucaoDto) {
    const execucao = await this.prisma.checklistExecucao.findUnique({
      where: { id: execucaoId },
      include: { tarefasExecucoes: { include: { checklistTarefa: true, foto: true } } },
    });

    if (!execucao) throw new NotFoundException('Execução não encontrada.');
    if (execucao.status === StatusChecklistExecucao.CONCLUIDO) {
      throw new BadRequestException('Checklist já foi enviado.');
    }

    const codigo = execucao.codigoConfirmacao ?? dto.codigoConfirmacao;
    if (dto.codigoConfirmacao !== codigo) {
      throw new BadRequestException('Código de confirmação inválido.');
    }

    for (const tarefa of execucao.tarefasExecucoes) {
      if (tarefa.checklistTarefa.exigeFoto && !tarefa.foto) {
        throw new BadRequestException(`Ainda falta tirar a foto da tarefa ${tarefa.checklistTarefa.titulo}.`);
      }
      if (tarefa.checklistTarefa.exigeObservacao && !tarefa.observacao) {
        throw new BadRequestException(`Ainda falta preencher a observação da tarefa ${tarefa.checklistTarefa.titulo}.`);
      }
    }

    await this.prisma.checklistExecucao.update({
      where: { id: execucaoId },
      data: {
        status: StatusChecklistExecucao.CONCLUIDO,
        enviadoEm: new Date(),
        codigoConfirmacao: codigo,
      },
    });

    return { message: 'Checklist enviado com sucesso.' };
  }
}
