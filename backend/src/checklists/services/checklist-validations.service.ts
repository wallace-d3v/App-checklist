import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChecklistValidationsService {
  constructor(private readonly prisma: PrismaService) {}

  async validateLoja(id?: number) {
    if (!id) return;
    const loja = await this.prisma.loja.findUnique({ where: { id } });
    if (!loja) throw new NotFoundException('Loja não encontrada.');
  }

  async validateCargo(id?: number) {
    if (!id) return;
    const cargo = await this.prisma.cargo.findUnique({ where: { id } });
    if (!cargo) throw new NotFoundException('Cargo não encontrado.');
  }

  async validateGerenteCargo(id: number) {
    const cargo = await this.prisma.cargo.findUnique({ where: { id } });
    if (!cargo) throw new NotFoundException('Cargo não encontrado.');
    if (cargo.nome.toLowerCase() !== 'gerente') {
      throw new BadRequestException('No MVP, checklists só podem ser criados para o cargo Gerente.');
    }
  }

  async validateTurno(id?: number, lojaId?: number) {
    if (!id) return;
    const turno = await this.prisma.turno.findUnique({ where: { id } });
    if (!turno) throw new NotFoundException('Turno não encontrado.');
    if (lojaId && turno.lojaId !== lojaId) {
      throw new BadRequestException('Turno não pertence à loja informada.');
    }
  }

  async validateUsuario(id?: number, lojaId?: number) {
    if (!id) return;
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    if (lojaId && usuario.lojaId !== lojaId) {
      throw new BadRequestException('Usuário não pertence à loja informada.');
    }
  }
}
