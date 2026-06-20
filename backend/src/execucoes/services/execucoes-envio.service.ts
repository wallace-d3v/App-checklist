import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusChecklistExecucao } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EnviarExecucaoDto } from '../dto/enviar-execucao.dto';

@Injectable()
export class ExecucoesEnvioService {
  constructor(private readonly prisma: PrismaService) {}

  async enviar(execucaoId: number, usuarioId: number, dto: EnviarExecucaoDto) {
    const execucao = await this.prisma.checklistExecucao.findFirst({
      where: { id: execucaoId, usuarioId },
      include: { tarefasExecucoes: { include: { checklistTarefa: true, foto: true } } },
    });

    if (!execucao) throw new NotFoundException('Execução não encontrada para este usuário.');
    if (execucao.status === StatusChecklistExecucao.CONCLUIDO) {
      throw new BadRequestException('Checklist já foi enviado.');
    }
    if (!execucao.codigoConfirmacao) {
      throw new BadRequestException('Código de confirmação não foi gerado.');
    }
    if (dto.codigoConfirmacao !== execucao.codigoConfirmacao) {
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
      data: { status: StatusChecklistExecucao.CONCLUIDO, enviadoEm: new Date() },
    });

    return { message: 'Checklist enviado com sucesso.' };
  }
}
