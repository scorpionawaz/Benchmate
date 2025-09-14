import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Post = { 
  id: string; 
  author: string; 
  avatar: string; 
  image: string; 
  caption: string; 
  likes: number; 
  comments: Array<{ id: string; by: string; text: string }> 
};

const initial: Post[] = [
  { id: 'p1', author: 'Aarav', avatar: 'https://i.pravatar.cc/100?img=12', image: 'https://picsum.photos/seed/act1/700/500', caption: 'Photosynthesis explained 🌿', likes: 12, comments: [{ id: 'c1', by: 'Mia', text: 'Nice!' }] },
  { id: 'p2', author: 'Zara', avatar: 'https://i.pravatar.cc/100?img=28', image: 'https://picsum.photos/seed/act2/700/500', caption: 'My rain poem ☔️', likes: 25, comments: [{ id: 'c2', by: 'Ishaan', text: 'Beautiful lines' }] },
];

// 🆕 PostCard Component
function PostCard({ item, onLike, onExplain }: { item: Post; onLike: (id: string) => void; onExplain: (p: Post) => void }) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // animation duration depends on likes
    const duration = Math.max(4000 - item.likes * 80, 800); // more likes = faster

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration, useNativeDriver: false }),
      ])
    ).start();
  }, [item.likes]);

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ff0077', '#00e5ff', '#ffea00'],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor,
          borderWidth: 4, // thicker border
          shadowColor: borderColor,
        },
      ]}
    >
      {/* Author */}
      <View style={styles.header}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.author}>{item.author}</Text>
        {item.likes > 20 && <Text style={styles.trending}>🔥 Trending</Text>}
      </View>

      {/* Image */}
      <Image source={{ uri: item.image }} style={styles.postImage} />

      {/* Caption + Actions */}
      <View style={styles.body}>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onLike(item.id)} style={styles.actionBtn}>
            <Ionicons name="heart" size={22} color="#e91e63" />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2f95dc" />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onExplain(item)} style={styles.actionBtn}>
            <Ionicons name="sparkles-outline" size={22} color="#7b61ff" />
            <Text style={styles.actionText}>Explain</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ActivitiesFeed() {
  const [posts, setPosts] = useState<Post[]>(initial);

  const toggleLike = (id: string) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  };

  const explainWithGemini = (post: Post) => {
    alert('✨ AI explanation will appear here.');
  };

  return (
    <FlatList 
      data={posts} 
      keyExtractor={p => p.id} 
      renderItem={({ item }) => (
        <PostCard item={item} onLike={toggleLike} onExplain={explainWithGemini} />
      )}
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  author: { fontWeight: '600', fontSize: 15, flex: 1 },
  trending: { fontSize: 12, fontWeight: '700', color: '#e91e63' },
  postImage: { width: '100%', height: 280 },
  body: { padding: 12 },
  caption: { fontSize: 14, marginBottom: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 6, fontSize: 14 },
});
