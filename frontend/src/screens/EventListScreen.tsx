import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useAuthStore } from '../store/authStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const EVENTS_QUERY = gql`
  query Events {
    events {
      id
      name
      location
      startTime
      participantCount
      attendees { id }
    }
  }
`;

export default function EventListScreen({ navigation }: any) {
  const { data, loading, error } = useQuery(EVENTS_QUERY);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <LinearGradient colors={["#f6f6f6", "#e3eafc"]} style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Events List</Text>
          <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
        </View>
        {user && <Text style={styles.welcome}>Welcome, <Text style={styles.welcomeName}>{user.name}</Text>!</Text>}
        <FlatList
          data={data.events}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No events found.</Text>}
          renderItem={({ item }) => {
            const isJoined = user && item.attendees.some((a: any) => a.id === user.id);
            return (
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
                activeOpacity={0.92}
              >
                <View style={styles.eventHeaderRow}>
                  <Text style={styles.eventName}>{item.name}</Text>
                  {isJoined && (
                    <View style={styles.joinedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#2ecc71" />
                      <Text style={styles.joinedText}>Joined</Text>
                    </View>
                  )}
                </View>
                <View style={styles.eventInfoRow}>
                  <Ionicons name="location-outline" size={18} color="#888" style={styles.icon} />
                  <Text style={styles.eventInfo}>{item.location}</Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <MaterialIcons name="schedule" size={18} color="#888" style={styles.icon} />
                  <Text style={styles.eventInfo}>
                    {item.startTime && !isNaN(new Date(item.startTime).getTime())
                      ? new Date(item.startTime).toLocaleString()
                      : 'No date'}
                  </Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <Ionicons name="people-outline" size={18} color="#888" style={styles.icon} />
                  <Text style={styles.eventInfo}>Participants: {item.participantCount}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 23,
  },
  card: {
    width: '100%',
    maxWidth: 1100,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: Platform.OS === 'android' ? 8 : 0,
    flex: 1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: '#4682A9', letterSpacing: 0.5 },
  welcome: { fontSize: 17, color: '#333', marginBottom: 10, marginLeft: 2 },
  welcomeName: { color: '#4682A9', fontWeight: 'bold' },
  eventCard: {
    backgroundColor: '#fafbff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  eventHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  eventName: { fontSize: 20, fontWeight: 'bold' },
  joinedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eafaf1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  joinedText: { color: '#2ecc71', fontWeight: 'bold', marginLeft: 4, fontSize: 13 },
  eventInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  eventInfo: { fontSize: 15, color: '#555' },
  icon: { marginRight: 6 },
  empty: { textAlign: 'center', color: '#aaa', marginVertical: 16 },
}); 