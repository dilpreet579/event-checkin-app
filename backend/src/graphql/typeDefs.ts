import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Event {
    id: ID!
    name: String!
    location: String!
    startTime: String!
    attendees: [User!]!
    participantCount: Int!
  }

  type Query {
    events: [Event!]!
    me: User
  }

  type Mutation {
    joinEvent(eventId: ID!): Event!
    leaveEvent(eventId: ID!): Event!
  }
`; 