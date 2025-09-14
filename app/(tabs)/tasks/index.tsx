import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// TODO: replace with real storage/API fetch
type Task = { id: string; title: string; description: string; subject: string; due: string; cover?: string };

export default function TasksFeed() {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    // fetch tasks assigned by teacher
    // Placeholder data for UI realism
    setTasks([
      { id: 't1', title: 'Write a poem on Rain', description: '16 lines, use rhyme scheme ABAB', subject: 'English', due: 'Tomorrow', cover: 'https://picsum.photos/seed/poem/600/360' },
      { id: 't2', title: 'Photosynthesis Meme', description: 'Create a meme explaining photosynthesis', subject: 'Biology', due: 'Friday', cover: 'https://picsum.photos/seed/meme/600/360' },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity style={{ backgroundColor: '#fff', margin: 12, borderRadius: 12, overflow: 'hidden', elevation: 2 }}>
      {item.cover && <Image source={{ uri: item.cover }} style={{ width: '100%', height: 180 }} />}
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
        <Text style={{ color: '#444', marginTop: 4 }}>{item.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Ionicons name="book-outline" size={16} color="#2f95dc" />
          <Text style={{ marginLeft: 6, color: '#2f95dc' }}>{item.subject}</Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="time-outline" size={16} color="#ff7a00" />
          <Text style={{ marginLeft: 6, color: '#ff7a00' }}>Due {item.due}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(t) => t.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}
