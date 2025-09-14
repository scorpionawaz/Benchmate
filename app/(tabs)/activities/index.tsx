import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Post = { id: string; author: string; avatar: string; image: string; caption: string; likes: number; comments: Array<{ id: string; by: string; text: string }> };

const initial: Post[] = [
  { id: 'p1', author: 'Aarav', avatar: 'https://i.pravatar.cc/100?img=12', image: 'https://picsum.photos/seed/act1/700/500', caption: 'Photosynthesis explained 🌿', likes: 12, comments: [{ id: 'c1', by: 'Mia', text: 'Nice!' }] },
  { id: 'p2', author: 'Zara', avatar: 'https://i.pravatar.cc/100?img=28', image: 'https://picsum.photos/seed/act2/700/500', caption: 'My rain poem ☔️', likes: 25, comments: [{ id: 'c2', by: 'Ishaan', text: 'Beautiful lines' }] },
];

export default function ActivitiesFeed() {
  const [posts, setPosts] = useState<Post[]>(initial);

  const toggleLike = (id: string) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  };

  const explainWithGemini = (post: Post) => {
    // TODO: integrate Gemini API; for now show stub
    alert('AI explanation will appear here.');
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={{ backgroundColor: '#fff', margin: 12, borderRadius: 12, overflow: 'hidden', elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <Image source={{ uri: item.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }} />
        <Text style={{ fontWeight: '600' }}>{item.author}</Text>
      </View>
      <Image source={{ uri: item.image }} style={{ width: '100%', height: 280 }} />
      <View style={{ padding: 12 }}>
        <Text>{item.caption}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <TouchableOpacity onPress={() => toggleLike(item.id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Ionicons name="heart-outline" size={22} color="#e91e63" />
            <Text style={{ marginLeft: 6 }}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2f95dc" />
            <Text style={{ marginLeft: 6 }}>{item.comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => explainWithGemini(item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="sparkles-outline" size={22} color="#7b61ff" />
            <Text style={{ marginLeft: 6 }}>Explain</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return <FlatList data={posts} keyExtractor={p => p.id} renderItem={renderItem} contentContainerStyle={{ paddingVertical: 8 }} />;
}
