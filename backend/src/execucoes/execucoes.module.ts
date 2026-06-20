import { Module } from '@nestjs/common';
import { ExecucoesController } from './execucoes.controller';
import { ExecucoesGeracaoService } from './services/execucoes-geracao.service';
import { ExecucoesQueryService } from './services/execucoes-query.service';
import { ExecucoesTarefasService } from './services/execucoes-tarefas.service';
import { ExecucoesEnvioService } from './services/execucoes-envio.service';

@Module({
  controllers: [ExecucoesController],
  providers: [
    ExecucoesGeracaoService,
    ExecucoesQueryService,
    ExecucoesTarefasService,
    ExecucoesEnvioService,
  ],
  exports: [ExecucoesQueryService],
})
export class ExecucoesModule {}
