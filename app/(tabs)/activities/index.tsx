import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Post = { 
  id: string; 
  author: string; 
  avatar: string; 
  image: string; 
  caption: string; 
  likes: number; 
  comments: Array<{ id: string; by: string; text: string }> 
};

// Initial posts
const initial: Post[] = [
  { 
    id: 'p1', 
    author: 'Aarav', 
    avatar: 'https://i.pravatar.cc/100?img=12', 
    image: 'https://media.licdn.com/dms/image/v2/C4D22AQG7gyyJglqw7A/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1663312481135?e=2147483647&v=beta&t=pscXzLplsQ0VnG_xcFrpqHXOEIpaSufUWvrD75xztoI', 
    caption: 'OOPs Concepts', 
    likes: 12, 
    comments: [{ id: 'c1', by: 'Mia', text: 'Nice!' }] 
  },
  { 
    id: 'p2', 
    author: 'Zara', 
    avatar: 'https://i.pravatar.cc/100?img=28', 
    image: 'https://drive.google.com/uc?export=view&id=1CE6T6dYThGQ2kSI1hyBqw6htnFuirLWY', 
    caption: 'Multiple Inheritance in Java', 
    likes: 55, 
    comments: [{ id: 'c2', by: 'Ishaan', text: 'Beautiful lines' }] 
  },
  { 
    id: 'p3', 
    author: 'Kabir', 
    avatar: 'https://i.pravatar.cc/100?img=14', 
    image: 'https://picsum.photos/seed/encap/700/500', 
    caption: 'Encapsulation', 
    likes: 23, 
    comments: [{ id: 'c3', by: 'Lina', text: 'Very useful!' }] 
  },
  { 
    id: 'p4', 
    author: 'Meera', 
    avatar: 'https://i.pravatar.cc/100?img=32', 
    image: 'https://picsum.photos/seed/poly/700/500', 
    caption: 'Polymorphism', 
    likes: 31, 
    comments: [{ id: 'c4', by: 'Sam', text: 'Cool concept!' }] 
  },
  { 
    id: 'p5', 
    author: 'Rohan', 
    avatar: 'https://i.pravatar.cc/100?img=18', 
    image: 'https://picsum.photos/seed/abs/700/500', 
    caption: 'Abstraction', 
    likes: 45, 
    comments: [{ id: 'c5', by: 'Nina', text: 'Nice example.' }] 
  },
  { 
    id: 'p6', 
    author: 'Anaya', 
    avatar: 'https://i.pravatar.cc/100?img=40', 
    image: 'https://picsum.photos/seed/inh/700/500', 
    caption: 'Inheritance', 
    likes: 60, 
    comments: [{ id: 'c6', by: 'Raj', text: 'So clear!' }] 
  },
];

// Explanations
const explanations: Record<string, string> = {
  "OOPs Concepts": `General introduction to Object-Oriented Programming.`,

  "Multiple Inheritance in Java": 
`Poem:
A class may borrow, one by one,
From parents’ work, the job gets done.
➡️ Meaning: A class can inherit from another class to reuse code.

Two or more? That sounds so sweet,
Mixing traits makes it complete.
➡️ Meaning: Multiple inheritance means one class has more than one parent.

But Java says, “Oh no, not here!
One parent only, crystal clear.”
➡️ Meaning: Java does not allow multiple inheritance to avoid conflicts.

Interfaces step in to dance,
To give your class that extra chance.
➡️ Meaning: Instead, Java uses interfaces to allow multiple behaviors safely.`,

  "Encapsulation": `Encapsulation means wrapping data (variables) and methods into a single unit (class).
It hides details and exposes only what’s needed — like a capsule hiding medicine.`,

  "Polymorphism": `Polymorphism = "many forms".
It lets one method or object act differently based on context.
Example: a function draw() works for Circle, Square, Triangle.`,

  "Abstraction": `Abstraction = showing only essentials, hiding details.
Example: driving a car without knowing how the engine works.`,

  "Inheritance": `Inheritance allows one class (child) to reuse properties & methods from another (parent).
Example: Car inherits from Vehicle.`,
};

// Post card
function PostCard({ item, onLike, onExplain }: { item: Post; onLike: (id: string) => void; onExplain: (p: Post) => void }) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = Math.max(4000 - item.likes * 80, 800);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [item.likes, glowAnim]);

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
          borderWidth: 4,
          shadowColor: '#000',
        },
      ]}
    >
      <View style={styles.header}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.author}>{item.author}</Text>
        {item.likes > 20 && <Text style={styles.trending}>🔥 Trending</Text>}
      </View>

      <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="contain" />

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
    setPosts((p) => p.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)));
  };

  const explainWithGemini = (post: Post) => {
    const explanation = explanations[post.caption] || "✨ No explanation available yet.";
    Alert.alert(post.caption, explanation);
  };

  const ListHeader = () => (
    <View style={{ paddingTop: 56, paddingBottom: 6 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#0b1220' }}>Feed</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <PostCard item={item} onLike={toggleLike} onExplain={explainWithGemini} />}
      ListHeaderComponent={ListHeader}
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
