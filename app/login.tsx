import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('student');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!name.trim() || !id.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login({
        id: id.trim(),
        name: name.trim(),
        role: selectedRole,
      });
      
      // Navigation will be handled automatically by the auth state change
      router.replace(selectedRole === 'teacher' ? '/teacher' : '/student');

    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>BENCHMATE</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>
      </View>

      <View style={styles.form}>
        {/* Role Selection */}
        <Text style={styles.label}>Select Your Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === 'student' && styles.roleButtonActive,
            ]}
            onPress={() => setSelectedRole('student')}
          >
            <Ionicons
              name={selectedRole === 'student' ? 'person' : 'person-outline'}
              size={24}
              color={selectedRole === 'student' ? '#fff' : '#2f95dc'}
            />
            <Text
              style={[
                styles.roleButtonText,
                selectedRole === 'student' && styles.roleButtonTextActive,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === 'teacher' && styles.roleButtonActive,
            ]}
            onPress={() => setSelectedRole('teacher')}
          >
            <Ionicons
              name={selectedRole === 'teacher' ? 'school' : 'school-outline'}
              size={24}
              color={selectedRole === 'teacher' ? '#fff' : '#2f95dc'}
            />
            <Text
              style={[
                styles.roleButtonText,
                selectedRole === 'teacher' && styles.roleButtonTextActive,
              ]}
            >
              Teacher
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          maxLength={50}
        />

        <Text style={styles.label}>
          {selectedRole === 'teacher' ? 'Teacher ID' : 'Student ID'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={`Enter your ${selectedRole} ID`}
          value={id}
          onChangeText={setId}
          maxLength={20}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>
            Login as {selectedRole === 'teacher' ? 'Teacher' : 'Student'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2f95dc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2f95dc',
    backgroundColor: '#fff',
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#2f95dc',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f95dc',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#2f95dc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
