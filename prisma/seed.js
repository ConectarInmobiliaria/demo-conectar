// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Credenciales deseadas para seed:
  const adminEmail = 'admin@marcon.com';
  const adminPassword = 'Admin123!'; // en entorno real, gestiona con cuidado
  const corredorEmail = 'corredor@marcon.com';
  const corredorPassword = 'Corredor123!';

  // Usuario ADMIN
  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        passwordHash: hashed,
        role: 'ADMIN',
      },
    });
    console.log('Usuario admin creado:', adminEmail);
  } else {
    console.log('Usuario admin ya existe:', adminEmail);
    // Si existía pero rol distinto, opcionalmente actualizar:
    if (adminUser.role !== 'ADMIN') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' },
      });
      console.log('Rol de usuario admin corregido a ADMIN');
    }
  }

  // Usuario CORREDOR de ejemplo
  let corredorUser = await prisma.user.findUnique({ where: { email: corredorEmail } });
  if (!corredorUser) {
    const hashed2 = await bcrypt.hash(corredorPassword, 10);
    corredorUser = await prisma.user.create({
      data: {
        name: 'Corredor Ejemplo',
        email: corredorEmail,
        passwordHash: hashed2,
        role: 'CORREDOR',
      },
    });
    console.log('Usuario corredor creado:', corredorEmail);
  } else {
    console.log('Usuario corredor ya existe:', corredorEmail);
    if (corredorUser.role !== 'CORREDOR') {
      await prisma.user.update({
        where: { email: corredorEmail },
        data: { role: 'CORREDOR' },
      });
      console.log('Rol de usuario corredor corregido a CORREDOR');
    }
  }

  // Crear categorías de ejemplo:
  const categories = ['Casa', 'Departamento', 'Terreno', 'Oficina'];
  for (const name of categories) {
    const exists = await prisma.category.findUnique({ where: { name } });
    if (!exists) {
      await prisma.category.create({ data: { name } });
      console.log('Categoría creada:', name);
    }
  }

  // Propiedad de ejemplo
  const propTitle = 'Casa de ejemplo';
  const existsProp = await prisma.property.findFirst({ where: { title: propTitle } });
  if (!existsProp) {
    // Tomar primera categoría y corredor de ejemplo
    const firstCategory = await prisma.category.findFirst();
    const corredor = await prisma.user.findUnique({ where: { email: corredorEmail } });
    if (firstCategory && corredor) {
      await prisma.property.create({
        data: {
          title: propTitle,
          description: 'Descripción de la casa de ejemplo.',
          price: 123000.0,
          location: 'Ciudad Ejemplo',
          categoryId: firstCategory.id,
          creatorId: corredor.id,
          imageUrl: null,
          otherImageUrls: [],
        },
      });
      console.log('Propiedad de ejemplo creada');
    }
  }

  console.log('Seed finalizado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
