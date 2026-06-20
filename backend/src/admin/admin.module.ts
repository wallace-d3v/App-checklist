import { Module } from '@nestjs/common';
import { ExecucoesModule } from '../execucoes/execucoes.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ExecucoesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
