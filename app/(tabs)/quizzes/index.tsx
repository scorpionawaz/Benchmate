import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

type Quiz = { id: string; title: string; questions: number; durationMin: number };

const sample: Quiz[] = [
  { id: 'q1', title: 'Biology Basics', questions: 10, durationMin: 8 },
  { id: 'q2', title: 'Poetry Forms', questions: 8, durationMin: 6 },
];

export default function Quizzes() {
  const [quizzes] = useState(sample);

  const startQuiz = (quiz: Quiz) => {
    // TODO: navigate to /quizzes/[id] if using a nested stack
    alert(`Starting ${quiz.title}`);
  };

  const renderItem = ({ item }: { item: Quiz }) => (
    <View style={{ backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 12, elevation: 2 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
      <Text style={{ color: '#555', marginTop: 4 }}>{item.questions} questions • {item.durationMin} min</Text>
      <TouchableOpacity onPress={() => startQuiz(item)} style={{ marginTop: 10, backgroundColor: '#2f95dc', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Start</Text>
      </TouchableOpacity>
    </View>
  );

  return <FlatList data={quizzes} keyExtractor={q => q.id} renderItem={renderItem} contentContainerStyle={{ paddingVertical: 8 }} />;
}
