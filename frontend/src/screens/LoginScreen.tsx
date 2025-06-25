import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Platform, Image } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@expo/vector-icons';

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
  const [inputFocused, setInputFocused] = useState(false);
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
        <Ionicons name="calendar" size={43} color="#0D5EA6" style={styles.logo} />
        <Text style={styles.title}>Event Check-In</Text>
        <TextInput
          style={[styles.input, inputFocused && styles.inputFocused]}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Or tap a user below to autofill:</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.userButton, email === item.email && styles.userButtonSelected]}
              onPress={() => setEmail(item.email)}
              activeOpacity={0.85}
            >
              <Ionicons name="person-circle" size={22} color={email === item.email ? '#0D5EA6' : '#888'} style={{ marginRight: 8 }} />
              <Text style={[styles.userButtonText, email === item.email && styles.userButtonTextSelected]}>{item.name} ({item.email})</Text>
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
    padding: 23,
  },
  card: {
    width: '100%',
    maxHeight: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: Platform.OS === 'android' ? 8 : 0,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 18, color: '#0D5EA6' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafbff',
  },
  inputFocused: {
    borderColor: '#0D5EA6',
    backgroundColor: '#f0f6ff',
  },
  error: { color: 'red', marginBottom: 8 },
  loginButton: {
    backgroundColor: '#0D5EA6',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 10,
    marginTop: 4,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  hint: { marginTop: 16, color: '#888', marginBottom: 8 },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    width: '100%',
  },
  userButtonSelected: {
    backgroundColor: '#eaf3fb',
    borderColor: '#0D5EA6',
    borderWidth: 1,
  },
  userButtonText: {
    fontSize: 15,
    color: '#333',
  },
  userButtonTextSelected: {
    color: '#0D5EA6',
    fontWeight: 'bold',
  },
}); 