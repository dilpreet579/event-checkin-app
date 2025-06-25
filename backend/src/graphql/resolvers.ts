import { prisma } from '../prisma/client';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    events: async () => {
      const events = await prisma.event.findMany({ include: { attendees: true } });
      return events.map((e: any) => ({ ...e, participantCount: e.attendees.length }));
    },
    me: (_: any, __: any, ctx: any) => ctx.req.user || null,
    event: async (_: any, { id }: any) => {
      const event = await prisma.event.findUnique({
        where: { id },
        include: { attendees: true },
      });
      if (!event) return null;
      return { ...event, participantCount: event.attendees.length };
    },
  },
  Event: {
    attendees: (parent: any) => parent.attendees,
    participantCount: (parent: any) => parent.attendees.length,
  },
  Mutation: {
    joinEvent: async (_: any, { eventId }: any, ctx: any) => {
      const user = ctx.req.user;
      if (!user) throw new Error('Not authenticated');
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { attendees: { connect: { id: user.id } } },
        include: { attendees: true },
      });
      // Real-time update
      ctx.io.to(eventId).emit('attendeesUpdate', { eventId, attendees: event.attendees });
      return { ...event, participantCount: event.attendees.length };
    },
    leaveEvent: async (_: any, { eventId }: any, ctx: any) => {
      const user = ctx.req.user;
      if (!user) throw new Error('Not authenticated');
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { attendees: { disconnect: { id: user.id } } },
        include: { attendees: true },
      });
      // Real-time update
      ctx.io.to(eventId).emit('attendeesUpdate', { eventId, attendees: event.attendees });
      return { ...event, participantCount: event.attendees.length };
    },
  },
}; 