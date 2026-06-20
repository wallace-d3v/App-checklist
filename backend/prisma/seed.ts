import { PrismaClient, TipoUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const lojas = [
    { nome: 'Loja 1', codigo: 'LOJA_1' },
    { nome: 'Loja 2', codigo: 'LOJA_2' },
    { nome: 'Loja 3', codigo: 'LOJA_3' },
    { nome: 'Loja 4', codigo: 'LOJA_4' },
  ];

  for (const loja of lojas) {
    await prisma.loja.upsert({
      where: { codigo: loja.codigo },
      update: {},
      create: loja,
    });
  }

  const administrador = await prisma.cargo.upsert({
    where: { nome: 'Administrador' },
    update: {},
    create: { nome: 'Administrador' },
  });

  await prisma.cargo.upsert({
    where: { nome: 'Gerente' },
    update: {},
    create: { nome: 'Gerente' },
  });

  const lojasCriadas = await prisma.loja.findMany();

  for (const loja of lojasCriadas) {
    const turnos = [
      { nome: 'Manhã', horarioInicio: '07:00', horarioFim: '14:00' },
      { nome: 'Tarde', horarioInicio: '14:00', horarioFim: '22:00' },
      { nome: 'Noite', horarioInicio: '22:00', horarioFim: '06:00' },
    ];

    for (const turno of turnos) {
      await prisma.turno.upsert({
        where: {
          lojaId_nome: {
            lojaId: loja.id,
            nome: turno.nome,
          },
        },
        update: {},
        create: {
          lojaId: loja.id,
          ...turno,
        },
      });
    }
  }

  const senhaHash = await bcrypt.hash('admin123', 10);

  await prisma.usuario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nome: 'Dono da Loja',
      usuario: 'admin',
      senhaHash,
      tipoUsuario: TipoUsuario.ADMIN,
      cargoId: administrador.id,
      lojaId: null,
      ativo: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
