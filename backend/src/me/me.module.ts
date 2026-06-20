import { Module } from '@nestjs/common';
import { ExecucoesModule } from '../execucoes/execucoes.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [ExecucoesModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
