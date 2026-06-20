import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CargosModule } from './cargos/cargos.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { LojasModule } from './lojas/lojas.module';
import { PrismaModule } from './prisma/prisma.module';
import { TurnosModule } from './turnos/turnos.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    LojasModule,
    CargosModule,
    TurnosModule,
    UsuariosModule,
    ChecklistsModule,
  ],
})
export class AppModule {}
