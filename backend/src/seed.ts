import { prisma } from './prisma/client';

async function main() {
  // Create users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      id: 'user1',
      name: 'Alice',
      email: 'alice@example.com',
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      id: 'user2',
      name: 'Bob',
      email: 'bob@example.com',
    },
  });

  // Create events
  await prisma.event.createMany({
    data: [
      {
        id: 'event1',
        name: 'College Fest',
        location: 'Main Hall',
        startTime: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: 'event2',
        name: 'Tech Meetup',
        location: 'Auditorium',
        startTime: new Date(Date.now() + 172800000).toISOString(),
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeded users and events!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 