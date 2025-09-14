import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type QuestionOption = { id: string; text: string };
type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctIndex: number;     // single correct answer
  explanation: string;
};

export default function CreateActivity() {
  // Media
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  // Activity meta
  const [description, setDescription] = useState('');
  const [heading, setHeading] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [references, setReferences] = useState('');

  // Questions (multiple)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q-${Date.now()}`,
      prompt: '',
      options: [
        { id: 'o-1', text: '' },
        { id: 'o-2', text: '' },
      ],
      correctIndex: 0,
      explanation: '',
    },
  ]);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const removeMedia = () => setMediaUri(null);

  // Question helpers
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        prompt: '',
        options: [
          { id: 'o-1', text: '' },
          { id: 'o-2', text: '' },
        ],
        correctIndex: 0,
        explanation: '',
      },
    ]);
  };

  const removeQuestion = (qi: number) => {
    setQuestions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== qi) : prev));
  };

  const updateQuestion = (qi: number, patch: Partial<Question>) => {
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  };

  const updateOption = (qi: number, oi: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qi) return q;
        const options = [...q.options];
        options[oi] = { ...options[oi], text };
        return { ...q, options };
      })
    );
  };

  const addOption = (qi: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, options: [...q.options, { id: `o-${Date.now()}`, text: '' }] } : q
      )
    );
  };

  const removeOption = (qi: number, oi: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qi) return q;
        if (q.options.length <= 2) return q; // keep at least 2
        const newOpts = q.options.filter((_, idx) => idx !== oi);
        let newCorrect = q.correctIndex;
        if (oi === q.correctIndex) newCorrect = 0;
        else if (oi < q.correctIndex) newCorrect = q.correctIndex - 1;
        return { ...q, options: newOpts, correctIndex: newCorrect };
      })
    );
  };

  const setCorrect = (qi: number, oi: number) => {
    updateQuestion(qi, { correctIndex: oi });
  };

  // UI helpers
  const shadow = Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
    android: { elevation: 3 },
    default: {},
  });

  const lightShadow = Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4 },
    android: { elevation: 2 },
    default: {},
  });

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#e6eaf2' }}>
      <Text style={{ color: '#0b1220', fontWeight: '700', marginBottom: 10 }}>{title}</Text>
      {children}
    </View>
  );

  const Input = (p: any) => (
    <TextInput
      {...p}
      placeholderTextColor="#9aa6b2"
      style={[
        {
          backgroundColor: '#f7f9fc',
          borderRadius: 10,
          padding: 12,
          color: '#0b1220',
          borderWidth: 1,
          borderColor: '#e6eaf2',
        },
        p.style,
      ]}
    />
  );

  const PrimaryButton = ({ label, onPress, fullWidth }: { label: string; onPress: () => void; fullWidth?: boolean }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: '#2f95dc',
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
          width: fullWidth ? '100%' : undefined,
        },
        shadow,
      ]}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  const SecondaryButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[{ backgroundColor: '#e6f2fd', borderRadius: 10, paddingVertical: 12, alignItems: 'center' }, lightShadow]}>
      <Text style={{ color: '#2f95dc', fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  const DangerButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[{ backgroundColor: '#ef4444', borderRadius: 10, paddingVertical: 12, alignItems: 'center' }, lightShadow]}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  const post = () => {
    if (!description.trim()) {
      Alert.alert('Missing', 'Please add an activity description.');
      return;
    }
    if (!heading.trim()) {
      Alert.alert('Missing', 'Please add an activity heading.');
      return;
    }
    for (const q of questions) {
      if (!q.prompt.trim()) {
        Alert.alert('Missing', 'Every question needs a prompt.');
        return;
      }
      if (q.options.some((o) => !o.text.trim())) {
        Alert.alert('Missing', 'Please fill all option texts.');
        return;
      }
    }
    Alert.alert('Posted', 'Your activity has been prepared (UI only).');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#f2f6fb' }}>
      {/* Activity Description */}
      <Section title="Activity Description">
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Describe what to create or discuss..."
          multiline
          style={{ minHeight: 100, textAlignVertical: 'top' }}
        />
      </Section>

      {/* Media */}
      <Section title="Img/Video">
        {!mediaUri ? (
          <View>
            <Text style={{ color: '#4b5563', marginBottom: 12, textAlign: 'center' }}>Upload media to enhance your post</Text>
            <PrimaryButton label="Upload" onPress={pickMedia} fullWidth />
          </View>
        ) : (
          <View style={[{ borderWidth: 1, borderColor: '#e6eaf2', borderRadius: 12, padding: 8 }, shadow]}>
            <Image source={{ uri: mediaUri }} style={{ width: '100%', height: 220, borderRadius: 10 }} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <SecondaryButton label="Change" onPress={pickMedia} />
              <DangerButton label="Remove" onPress={removeMedia} />
            </View>
          </View>
        )}
      </Section>

      {/* Meta fields */}
      <Section title="Details">
        <Input value={heading} onChangeText={setHeading} placeholder="Activity Heading" style={{ marginBottom: 10 }} />
        <Input value={hashtags} onChangeText={setHashtags} placeholder="Hashtags (comma separated)" style={{ marginBottom: 10 }} />
        <Input value={references} onChangeText={setReferences} placeholder="References // links or notes" />
      </Section>

      {/* Questions */}
      {questions.map((q, qi) => (
        <Section key={q.id} title={`Question ${qi + 1}`}>
          <Text style={{ color: '#0b1220', marginBottom: 6, fontWeight: '600' }}>Prompt</Text>
          <Input
            value={q.prompt}
            onChangeText={(t: string) => updateQuestion(qi, { prompt: t })}
            placeholder="Type the question here..."
            multiline
            style={{ minHeight: 70, textAlignVertical: 'top', marginBottom: 12 }}
          />

          <Text style={{ color: '#0b1220', marginBottom: 6, fontWeight: '600' }}>Options</Text>
          {q.options.map((opt, oi) => {
            const isCorrect = q.correctIndex === oi;
            return (
              <View key={opt.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TouchableOpacity
                  onPress={() => setCorrect(qi, oi)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderWidth: 2,
                    borderColor: isCorrect ? '#16a34a' : '#cbd5e1',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    backgroundColor: '#fff',
                  }}
                >
                  {isCorrect ? <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#16a34a' }} /> : null}
                </TouchableOpacity>
                <Input
                  value={opt.text}
                  onChangeText={(t: string) => updateOption(qi, oi, t)}
                  placeholder={`Option ${oi + 1}`}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <TouchableOpacity onPress={() => removeOption(qi, oi)} style={{ backgroundColor: '#ef4444', borderRadius: 8, padding: 8 }}>
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6, marginBottom: 12 }}>
            <SecondaryButton label="Add Option" onPress={() => addOption(qi)} />
            <DangerButton label="Remove Question" onPress={() => removeQuestion(qi)} />
          </View>

          <Text style={{ color: '#0b1220', marginBottom: 6, fontWeight: '600' }}>Explanation</Text>
          <Input
            value={q.explanation}
            onChangeText={(t: string) => updateQuestion(qi, { explanation: t })}
            placeholder="Short explanation for the correct answer"
            multiline
            style={{ minHeight: 70, textAlignVertical: 'top' }}
          />
        </Section>
      ))}

      <View style={{ marginBottom: 14 }}>
        <SecondaryButton label="Add Another Question" onPress={addQuestion} />
      </View>

      <PrimaryButton label="POST" onPress={post} />
      <View style={{ height: 18 }} />
    </ScrollView>
  );
}
