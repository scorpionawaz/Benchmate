import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Question = { id: string; text: string; options: string[]; answerIndex: number; marks: number };
type Quiz = {
  id: string;
  title: string;
  subject: string;
  durationMin: number;
  totalMarks: number;
  questions: Question[];
  createdAt: string;
};

export default function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [durationMin, setDurationMin] = useState('10');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [answerIndex, setAnswerIndex] = useState('0');
  const [marks, setMarks] = useState('1');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    if (!questionText.trim() || !optA.trim() || !optB.trim()) {
      Alert.alert('Missing info', 'Provide question, at least options A and B.');
      return;
    }
    const q: Question = {
      id: `Q_${Date.now()}`,
      text: questionText.trim(),
      options: [optA, optB, optC, optD].filter(Boolean),
      answerIndex: Math.max(0, Math.min(3, parseInt(answerIndex || '0', 10))),
      marks: parseInt(marks || '1', 10),
    };
    setQuestions(prev => [...prev, q]);
    setQuestionText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setAnswerIndex('0'); setMarks('1');
  };

  const publishQuiz = async () => {
    if (!title.trim() || !subject.trim() || questions.length === 0) {
      Alert.alert('Incomplete', 'Enter title, subject, and at least one question.');
      return;
    }
    // No storage yet — UI only
    Alert.alert('Saved', 'Quiz form submitted (no data stored yet).');
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Create Quiz</Text>

      <Text style={{ marginBottom: 6 }}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="e.g., Biology Basics"
        style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 }} />

      <Text style={{ marginBottom: 6 }}>Subject</Text>
      <TextInput value={subject} onChangeText={setSubject} placeholder="e.g., Biology"
        style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 }} />

      <Text style={{ marginBottom: 6 }}>Duration (minutes)</Text>
      <TextInput value={durationMin} onChangeText={setDurationMin} keyboardType="numeric"
        style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 }} />

      <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Add Question</Text>
        <TextInput value={questionText} onChangeText={setQuestionText} placeholder="Question text" multiline
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8, minHeight: 60 }} />
        <TextInput value={optA} onChangeText={setOptA} placeholder="Option A"
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8 }} />
        <TextInput value={optB} onChangeText={setOptB} placeholder="Option B"
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8 }} />
        <TextInput value={optC} onChangeText={setOptC} placeholder="Option C (optional)"
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8 }} />
        <TextInput value={optD} onChangeText={setOptD} placeholder="Option D (optional)"
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8 }} />
        <TextInput value={answerIndex} onChangeText={setAnswerIndex} keyboardType="numeric"
          placeholder="Correct option index (0-3)" style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 8 }} />
        <TextInput value={marks} onChangeText={setMarks} keyboardType="numeric"
          placeholder="Marks for this question" style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10 }} />

        <TouchableOpacity onPress={addQuestion}
          style={{ marginTop: 10, backgroundColor: '#10b981', borderRadius: 10, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Add Question</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 10 }}>Questions added: {questions.length}</Text>
      </View>

      <TouchableOpacity onPress={publishQuiz}
        style={{ backgroundColor: '#2f95dc', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Publish Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
