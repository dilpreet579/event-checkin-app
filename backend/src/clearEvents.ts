import { prisma } from './prisma/client';

async function main() {
  await prisma.event.deleteMany({});
  console.log('All events deleted!');
}

main().finally(() => prisma.$disconnect());
