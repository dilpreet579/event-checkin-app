import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useAuthStore } from '../store/authStore';

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
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events List</Text>
        <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
      </View>
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
            <Text>
              {item.startTime && !isNaN(new Date(item.startTime).getTime())
                ? new Date(item.startTime).toLocaleString()
                : 'No date'}
            </Text>
            <Text>Participants: {item.participantCount}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, textAlign: 'center' },
  event: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12 },
  eventName: { fontSize: 18, fontWeight: 'bold' },
}); 