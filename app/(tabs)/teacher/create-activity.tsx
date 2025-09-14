import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';

type Activity = {
  id: string;
  subject: string;
  className: string;
  description: string;
  deadlineISO?: string;
  createdAt: string;
};

export default function CreateActivity() {
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(''); // e.g., 2025-09-20 17:00

  const saveActivity = async () => {
    if (!subject.trim() || !className.trim() || !description.trim()) {
      Alert.alert('Missing info', 'Please fill subject, class, and description.');
      return;
    }
    // No storage yet — UI only
    Alert.alert('Saved', 'Activity form submitted (no data stored yet).');
    router.back(); // keep the navigation flow
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Create Activity</Text>

      <Text style={{ marginBottom: 6 }}>Subject</Text>
      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="e.g., English"
        style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 6 }}>Class</Text>
      <TextInput
        value={className}
        onChangeText={setClassName}
        placeholder="e.g., Grade 8 - A"
        style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 6 }}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Details for the task..."
        style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, minHeight: 120, textAlignVertical: 'top', marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 6 }}>Deadline (YYYY-MM-DD HH:mm, optional)</Text>
      <TextInput
        value={deadline}
        onChangeText={setDeadline}
        placeholder="2025-09-20 17:00"
        style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12 }}
      />

      <TouchableOpacity
        onPress={saveActivity}
        style={{ marginTop: 16, backgroundColor: '#2f95dc', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Publish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
