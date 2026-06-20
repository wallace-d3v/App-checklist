import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LojasModule } from './lojas/lojas.module';
import { CargosModule } from './cargos/cargos.module';
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
  ],
})
export class AppModule {}
