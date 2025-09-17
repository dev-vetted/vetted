import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: { type: 'vendor', name: 'Demo Tenant' },
  });

  const user = await prisma.user.create({
    data: { email: 'demo@vetted.dev' },
  });

  await prisma.membership.create({
    data: { userId: user.id, tenantId: tenant.id, role: 'owner' },
  });

  await prisma.pet.create({
    data: { tenantId: tenant.id, name: 'Buddy', species: 'dog' },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


