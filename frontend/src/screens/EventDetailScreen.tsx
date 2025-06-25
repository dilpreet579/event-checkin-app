import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import { Ionicons } from '@expo/vector-icons';

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

function getAvatarColor(name: string) {
  // Simple hash for consistent color
  const colors = ['#FFB300', '#F4511E', '#8E24AA', '#039BE5', '#43A047', '#FDD835', '#D81B60', '#00897B'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const { user } = useAuthStore();
  const { socket, connect } = useSocketStore();
  const { data, refetch } = useQuery(EVENT_QUERY, { variables: { id: eventId } });
  const [joinEvent] = useMutation(JOIN_EVENT);
  const [leaveEvent] = useMutation(LEAVE_EVENT);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [eventDetails, setEventDetails] = useState<any>(null);

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
      setEventDetails(data.event);
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
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          {/* <Text style={styles.backText}>Back</Text> */}
        </TouchableOpacity>
        {/* Event Details */}
        {eventDetails && (
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{eventDetails.name}</Text>
            <Text style={styles.eventLocation}>{eventDetails.location}</Text>
            <Text style={styles.eventTime}>
              {eventDetails.startTime && !isNaN(new Date(eventDetails.startTime).getTime())
                ? new Date(eventDetails.startTime).toLocaleString()
                : 'No date'}
            </Text>
          </View>
        )}
        {/* Divider */}
        <View style={styles.divider} />
        <Text style={styles.title}>Attendees ({participantCount})</Text>
        <FlatList
          data={attendees}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No attendees yet. Be the first to join!</Text>}
          renderItem={({ item }) => (
            <View style={styles.attendee}>
              <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.name) }] }>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>
              <Text style={styles.attendeeName}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        {isJoined ? (
          <Button title="Leave Event" onPress={handleLeave} color="#e74c3c" />
        ) : (
          <Button title="Join Event" onPress={handleJoin} color="#2ecc71" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    padding: 23,
  },
  card: {
    width: '100%',
    maxWidth: 1100,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 4 : 0,
    flex: 1,
  },
  eventDetails: { marginBottom: 16, alignItems: 'center' },
  eventName: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  eventLocation: { fontSize: 16, color: '#555', marginBottom: 2 },
  eventTime: { fontSize: 14, color: '#888', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12, width: '100%' },
  title: { fontSize: 20, marginBottom: 12, textAlign: 'center' },
  attendee: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  attendeeName: { fontSize: 16 },
  empty: { textAlign: 'center', color: '#aaa', marginVertical: 16 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backText: {
    marginLeft: 4,
    fontSize: 18,
    color: '#333',
  },
}); 