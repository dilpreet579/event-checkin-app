import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';

const users = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com' },
  { id: 'user2', name: 'Bob', email: 'bob@example.com' },
  { id: 'user3', name: 'Charlie', email: 'charlie@example.com' },
  { id: 'user4', name: 'Diana', email: 'diana@example.com' },
  { id: 'user5', name: 'Eve', email: 'eve@example.com' },
  { id: 'user6', name: 'Frank', email: 'frank@example.com' },
  { id: 'user7', name: 'Grace', email: 'grace@example.com' },
];

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('alice@example.com');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    const user = users.find((u) => u.email === email);
    if (user) {
      login(user, user.email); // token is email
      navigation.replace('Events');
    } else {
      setError('Invalid email');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Login" onPress={handleLogin} />
        <Text style={styles.hint}>Or tap a user below to autofill:</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userButton}
              onPress={() => setEmail(item.email)}
            >
              <Text>{item.name} ({item.email})</Text>
            </TouchableOpacity>
          )}
        />
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
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 4 : 0,
    alignItems: 'center',
  },
  title: { fontSize: 24, marginBottom: 16 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 12 },
  error: { color: 'red', marginBottom: 8 },
  hint: { marginTop: 16, color: '#888' },
  userButton: { padding: 8, marginVertical: 4, backgroundColor: '#f0f0f0', borderRadius: 4, width: '100%' },
}); 