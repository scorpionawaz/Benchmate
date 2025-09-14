import { FlatList, Image, Text, View } from 'react-native';

type Rank = { id: string; name: string; avatar: string; points: number };

const data: Rank[] = [
  { id: 's1', name: 'Aarav', avatar: 'https://i.pravatar.cc/100?img=12', points: 240 },
  { id: 's2', name: 'Mia', avatar: 'https://i.pravatar.cc/100?img=5', points: 220 },
  { id: 's3', name: 'Ishaan', avatar: 'https://i.pravatar.cc/100?img=32', points: 205 },
];

export default function Leaderboard() {
  const renderItem = ({ item, index }: { item: Rank; index: number }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 6, borderRadius: 12, padding: 12, elevation: 1 }}>
      <Text style={{ width: 28, fontWeight: '700', color: index < 3 ? '#f59e0b' : '#333' }}>{index + 1}</Text>
      <Image source={{ uri: item.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }} />
      <Text style={{ fontWeight: '600', flex: 1 }}>{item.name}</Text>
      <Text style={{ fontWeight: '700', color: '#2f95dc' }}>{item.points} pts</Text>
    </View>
  );

  return <FlatList data={data} keyExtractor={r => r.id} renderItem={renderItem} contentContainerStyle={{ paddingVertical: 12 }} />;
}
