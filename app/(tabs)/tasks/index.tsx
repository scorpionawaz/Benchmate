import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

type Task = { id: string; title: string; description: string; subject: string; due: string; cover?: string };

export default function TasksFeed() {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
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

  // Taller spacer above the heading (e.g., 18–24 for noticeable top gap)
  const ListHeader = () => (
    <View style={{ paddingTop: 56, paddingBottom: 6 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#0b1220' }}>Active Tasks</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(t) => t.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}
