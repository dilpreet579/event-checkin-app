import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';

const EVENT_QUERY = gql`
  query Event($id: ID!) {
    event(id: $id) {
      id
      name
      location
      startTime
      attendees { id name email }
      participantCount
    }
  }
`;

const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      id
      attendees { id name email }
      participantCount
    }
  }
`;

const LEAVE_EVENT = gql`
  mutation LeaveEvent($eventId: ID!) {
    leaveEvent(eventId: $eventId) {
      id
      attendees { id name email }
      participantCount
    }
  }
`;

export default function EventDetailScreen({ route }: any) {
  const { eventId } = route.params;
  const { user } = useAuthStore();
  const { socket, connect } = useSocketStore();
  const { data, refetch } = useQuery(EVENT_QUERY, { variables: { id: eventId } });
  const [joinEvent] = useMutation(JOIN_EVENT);
  const [leaveEvent] = useMutation(LEAVE_EVENT);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinEventRoom', eventId);
    socket.on('attendeesUpdate', (payload: any) => {
      if (payload.eventId === eventId) {
        setAttendees(payload.attendees);
        setParticipantCount(payload.attendees.length);
      }
    });
    return () => {
      socket.emit('leaveEventRoom', eventId);
      socket.off('attendeesUpdate');
    };
  }, [socket, eventId]);

  useEffect(() => {
    if (data && data.event) {
      setAttendees(data.event.attendees);
      setParticipantCount(data.event.participantCount);
    }
  }, [data, eventId]);

  const isJoined = attendees.some((a) => a.id === user?.id);

  const handleJoin = async () => {
    await joinEvent({ variables: { eventId } });
    refetch();
  };
  const handleLeave = async () => {
    await leaveEvent({ variables: { eventId } });
    refetch();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendees ({participantCount})</Text>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendee}>
            <Text style={styles.avatar}>{item.name[0]}</Text>
            <Text>{item.name}</Text>
          </View>
        )}
      />
      {isJoined ? (
        <Button title="Leave Event" onPress={handleLeave} color="#e74c3c" />
      ) : (
        <Button title="Join Event" onPress={handleJoin} color="#2ecc71" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, marginBottom: 12, textAlign: 'center' },
  attendee: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', textAlign: 'center', textAlignVertical: 'center', marginRight: 8, fontWeight: 'bold', fontSize: 18 },
}); 