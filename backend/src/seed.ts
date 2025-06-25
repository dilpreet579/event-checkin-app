import { prisma } from "./prisma/client";

async function main() {
  // Create users
  const users = [
    { id: "user1", name: "Alice", email: "alice@example.com" },
    { id: "user2", name: "Bob", email: "bob@example.com" },
    { id: "user3", name: "Charlie", email: "charlie@example.com" },
    { id: "user4", name: "Diana", email: "diana@example.com" },
    { id: "user5", name: "Eve", email: "eve@example.com" },
    { id: "user6", name: "Frank", email: "frank@example.com" },
    { id: "user7", name: "Grace", email: "grace@example.com" },
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Create events
  const now = Date.now();
  const eventData = [
    {
      id: "event1",
      name: "College Fest",
      location: "Main Hall",
      startTime: new Date(now + 1 * 86400000).toISOString(),
    },
    {
      id: "event2",
      name: "Tech Meetup",
      location: "Auditorium",
      startTime: new Date(now + 2 * 86400000).toISOString(),
    },
    {
      id: "event3",
      name: "Open Mic Night",
      location: "Cafeteria",
      startTime: new Date(now + 3 * 86400000).toISOString(),
    },
    {
      id: "event4",
      name: "Startup Pitch",
      location: "Room 101",
      startTime: new Date(now + 4 * 86400000).toISOString(),
    },
    {
      id: "event5",
      name: "Art Expo",
      location: "Gallery",
      startTime: new Date(now + 5 * 86400000).toISOString(),
    },
    {
      id: "event6",
      name: "Photography Walk",
      location: "Campus Garden",
      startTime: new Date(now + 6 * 86400000).toISOString(),
    },
    {
      id: "event7",
      name: "Design Thinking Workshop",
      location: "Innovation Lab",
      startTime: new Date(now + 7 * 86400000).toISOString(),
    },
    {
      id: "event8",
      name: "Hackathon",
      location: "Lab 3",
      startTime: new Date(now + 8 * 86400000).toISOString(),
    },
    {
      id: "event9",
      name: "AI Panel Discussion",
      location: "Conference Room",
      startTime: new Date(now + 9 * 86400000).toISOString(),
    },
    {
      id: "event10",
      name: "Game Dev Showcase",
      location: "Auditorium",
      startTime: new Date(now + 10 * 86400000).toISOString(),
    },
  ];
  await prisma.event.createMany({
    data: eventData,
    skipDuplicates: true,
  });

  // Add attendees to some events
  await prisma.event.update({
    where: { id: "event1" },
    data: { attendees: { connect: [{ id: "user1" }, { id: "user2" }] } },
  });
  await prisma.event.update({
    where: { id: "event2" },
    data: { attendees: { connect: [{ id: "user3" }, { id: "user4" }] } },
  });
  await prisma.event.update({
    where: { id: "event5" },
    data: { attendees: { connect: [{ id: "user5" }, { id: "user1" }, { id: "user7" }] } },
  });
  await prisma.event.update({
    where: { id: "event7" },
    data: { attendees: { connect: [{ id: "user2" }, { id: "user3" }, { id: "user6" }] } },
  });
  await prisma.event.update({
    where: { id: "event10" },
    data: { attendees: { connect: [{ id: "user1" }, { id: "user3" }, { id: "user6" }, { id: "user7" }] } },
  });

  console.log("Seeded users, events, and attendees!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
