import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery, gql } from '@apollo/client';

const EVENTS_QUERY = gql`
  query Events {
    events {
      id
      name
      location
      startTime
      participantCount
    }
  }
`;

export default function EventListScreen({ navigation }: any) {
  const { data, loading, error } = useQuery(EVENTS_QUERY);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={data.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.event}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
          >
            <Text style={styles.eventName}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{new Date(item.startTime).toLocaleString()}</Text>
            <Text>Participants: {item.participantCount}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  event: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  eventName: { fontSize: 18, fontWeight: 'bold' },
}); 