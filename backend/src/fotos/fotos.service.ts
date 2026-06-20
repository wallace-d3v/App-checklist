import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from './storage/supabase-storage.service';

@Injectable()
export class FotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
  ) {}

  async upload(execucaoId: number, tarefaExecucaoId: number, usuarioId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Arquivo de foto obrigatório.');

    const execucao = await this.prisma.checklistExecucao.findFirst({ where: { id: execucaoId, usuarioId } });
    if (!execucao) throw new NotFoundException('Execução não encontrada para este usuário.');

    const tarefa = await this.prisma.checklistTarefaExecucao.findFirst({
      where: { id: tarefaExecucaoId, checklistExecucaoId: execucaoId },
      include: { foto: true },
    });
    if (!tarefa) throw new NotFoundException('Tarefa da execução não encontrada.');
    if (tarefa.foto) throw new BadRequestException('Esta tarefa já possui uma foto.');

    const hashArquivo = createHash('sha256').update(file.buffer).digest('hex');
    const fotoExistente = await this.prisma.foto.findUnique({ where: { hashArquivo } });
    if (fotoExistente) {
      throw new BadRequestException('Essa foto já foi enviada anteriormente. Tire uma nova foto.');
    }

    const path = `loja-${execucao.lojaId}/execucao-${execucaoId}/tarefa-${tarefaExecucaoId}-${Date.now()}.jpg`;
    const url = await this.storage.upload(path, file.buffer, file.mimetype);

    const foto = await this.prisma.foto.create({
      data: { lojaId: execucao.lojaId, tarefaExecucaoId, usuarioId, url, hashArquivo },
    });

    return { message: 'Foto enviada com sucesso.', data: foto };
  }

  async findOne(id: number) {
    const foto = await this.prisma.foto.findUnique({ where: { id }, include: { usuario: true } });
    if (!foto) throw new NotFoundException('Foto não encontrada.');
    return foto;
  }
}
