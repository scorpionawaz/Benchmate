import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

type Quiz = { id: string; title: string; questions: number; durationMin: number };

// Existing sample list for the catalog
const sample: Quiz[] = [
  { id: 'q1', title: 'Design Principals', questions: 10, durationMin: 8 },
  { id: 'q2', title: 'Encapsulation', questions: 8, durationMin: 6 },
];

// Active quiz: Inheritance (10 questions)
type Q = { id: string; prompt: string; options: string[]; correctIndex: number };

const inheritanceQuestions: Q[] = [
  { id: 'iq1', prompt: 'Inheritance in OOP allows a class to:', options: ['Contain objects of another class', 'Derive properties/behaviors from another class', 'Hide data from users', 'Provide multiple interfaces'], correctIndex: 1 },
  { id: 'iq2', prompt: 'The class being inherited from is called:', options: ['Child class', 'Derived class', 'Base/Parent class', 'Peer class'], correctIndex: 2 },
  { id: 'iq3', prompt: 'Which keyword in many languages indicates inheritance?', options: ['implements', 'extends', 'inherits', 'override'], correctIndex: 1 },
  { id: 'iq4', prompt: 'A key benefit of inheritance is:', options: ['Tight coupling', 'Code reusability', 'Lower cohesion', 'Higher redundancy'], correctIndex: 1 },
  { id: 'iq5', prompt: 'Single inheritance means a class inherits from:', options: ['Exactly two classes', 'Multiple classes', 'One class', 'No class'], correctIndex: 2 },
  { id: 'iq6', prompt: '“is-a” relationship represents:', options: ['Association', 'Aggregation', 'Composition', 'Inheritance'], correctIndex: 3 },
  { id: 'iq7', prompt: 'Which is true about method overriding?', options: ['Same name and parameters in child and parent', 'Different return types only', 'Only static methods', 'Only private methods'], correctIndex: 0 },
  { id: 'iq8', prompt: 'Which inheritance can cause ambiguity without virtual inheritance (C++)?', options: ['Single', 'Hierarchical', 'Multiple/Diamond', 'Hybrid'], correctIndex: 2 },
  { id: 'iq9', prompt: 'Protected members of base class are accessible in:', options: ['Only within the same class', 'Derived classes and same package/module (lang-dependent)', 'Everywhere', 'Nowhere'], correctIndex: 1 },
  { id: 'iq10', prompt: 'Choosing inheritance primarily aims to achieve:', options: ['Encapsulation only', 'Polymorphism and reuse', 'Thread safety', 'Memory optimization only'], correctIndex: 1 },
];

export default function Quizzes() {
  const [quizzes] = useState(sample);

  // Active quiz runner state
  const [current, setCurrent] = useState(0); // index of current question
  const [answers, setAnswers] = useState<number[]>(Array(inheritanceQuestions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return answers.reduce((acc, a, i) => acc + (a === inheritanceQuestions[i].correctIndex ? 1 : 0), 0);
  }, [answers, submitted]);

  const chooseOption = (optIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optIndex;
      return next;
    });
  };

  const nextQuestion = () => {
    if (answers[current] === -1) {
      Alert.alert('Select an answer', 'Please choose an option before proceeding.');
      return;
    }
    if (current < inheritanceQuestions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const submitQuiz = () => {
    // Optional check: ensure last question answered
    if (answers[current] === -1) {
      Alert.alert('Select an answer', 'Please choose an option before submitting.');
      return;
    }
    setSubmitted(true);
    Alert.alert('Quiz Submitted', `Score: ${score}/10`);
  };

  const restartQuiz = () => {
    setAnswers(Array(inheritanceQuestions.length).fill(-1));
    setCurrent(0);
    setSubmitted(false);
  };

  // UI helpers
  const Heading = ({ text }: { text: string }) => (
    <View style={{ paddingTop: 56, paddingBottom: 6 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#0b1220' }}>{text}</Text>
      </View>
    </View>
  );

  const Card = (p: { children: React.ReactNode; style?: any }) => (
    <View
      style={[
        { backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 12, padding: 14, elevation: 2, borderWidth: 1, borderColor: '#e6eaf2' },
        p.style,
      ]}
    >
      {p.children}
    </View>
  );

  const PrimaryBtn = ({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) => (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: disabled ? '#9cccf0' : '#2f95dc',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  const OutlineBtn = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#e6f2fd',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <Text style={{ color: '#2f95dc', fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  const Option = ({ text, index }: { text: string; index: number }) => {
    const isSelected = answers[current] === index;
    const isCorrect = submitted && inheritanceQuestions[current].correctIndex === index;
    const isWrong = submitted && isSelected && !isCorrect;

    return (
      <TouchableOpacity
        onPress={() => chooseOption(index)}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderRadius: 10,
          marginTop: 10,
          borderWidth: 1,
          borderColor: isCorrect ? '#16a34a' : isWrong ? '#ef4444' : isSelected ? '#2f95dc' : '#e6eaf2',
          backgroundColor: isCorrect ? '#eaf7ee' : isWrong ? '#fdecec' : isSelected ? '#e6f2fd' : '#fff',
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#0b1220', fontWeight: '600' }}>{text}</Text>
      </TouchableOpacity>
    );
  };

  // The active quiz card displayed before the catalog list
  const ActiveQuizHeader = () => {
    const q = inheritanceQuestions[current];
    return (
      <View>
        <Heading text="Quizzes" />
        <Card style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0b1220' }}>Active Quiz: Inheritance</Text>
          <Text style={{ color: '#556070', marginTop: 4 }}>10 questions • approx 8–10 min</Text>

          <View style={{ height: 8 }} />

          {/* Question counter */}
          <Text style={{ color: '#0b1220', fontWeight: '700', marginTop: 6 }}>
            Q{current + 1} of {inheritanceQuestions.length}
          </Text>

          {/* Prompt */}
          <Text style={{ color: '#0b1220', marginTop: 6 }}>{q.prompt}</Text>

          {/* Options */}
          {q.options.map((opt, i) => (
            <Option key={`${q.id}-${i}`} text={opt} index={i} />
          ))}

          {/* Controls */}
          {!submitted ? (
            current < inheritanceQuestions.length - 1 ? (
              <PrimaryBtn label="Next" onPress={nextQuestion} disabled={answers[current] === -1} />
            ) : (
              <PrimaryBtn label="Submit" onPress={submitQuiz} disabled={answers[current] === -1} />
            )
          ) : (
            <>
              <Text style={{ marginTop: 12, color: '#0b1220', fontWeight: '700' }}>Score: {score}/10</Text>
              <OutlineBtn label="Retry Quiz" onPress={restartQuiz} />
            </>
          )}
        </Card>
      </View>
    );
  };

  // Existing quiz catalog render (unchanged)
  const startQuiz = (quiz: Quiz) => {
    Alert.alert('Start Quiz', `Starting ${quiz.title}`);
  };

  const renderItem = ({ item }: { item: Quiz }) => (
    <View style={{ backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 12, elevation: 2, borderWidth: 1, borderColor: '#e6eaf2' }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
      <Text style={{ color: '#555', marginTop: 4 }}>
        {item.questions} questions • {item.durationMin} min
      </Text>
      <TouchableOpacity
        onPress={() => startQuiz(item)}
        style={{ marginTop: 10, backgroundColor: '#2f95dc', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Start</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={quizzes}
      keyExtractor={(q) => q.id}
      renderItem={renderItem}
      ListHeaderComponent={ActiveQuizHeader}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}
