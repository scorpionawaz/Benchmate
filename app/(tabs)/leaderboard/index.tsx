import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Text, View } from 'react-native';

type Rank = { id: string; name: string; avatar: string; points: number };

// Updated list
const data: Rank[] = [
  { id: 's1', name: 'Pratha', avatar: 'https://i.pravatar.cc/100?img=12', points: 290 },
  { id: 's2', name: 'Riya',   avatar: 'https://i.pravatar.cc/100?img=20', points: 275 },
  { id: 's3', name: 'Alex',      avatar: 'https://i.pravatar.cc/100?img=32', points: 260 },
  { id: 's4', name: 'Bob',  avatar: 'https://i.pravatar.cc/100?img=45', points: 245 },
  { id: 's5', name: 'Sabhya',     avatar: 'https://i.pravatar.cc/100?img=7',  points: 230 },
  { id: 's6', name: 'Raghav',      avatar: 'https://i.pravatar.cc/100?img=5',  points: 220 },
];

export default function Leaderboard() {
  const ListHeader = () => (
    <View style={{ paddingTop: 56, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Ionicons name="trophy" size={18} color="#eab308" />
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0b1220' }}>Leaderboard</Text>
        <Ionicons name="trophy" size={18} color="#eab308" />
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: Rank; index: number }) => {
    const isFirst = index === 0;
    const isSecond = index === 1;

    const rankColor = isFirst ? '#eab308' : isSecond ? '#9ca3af' : '#333';
    const badgeColor = isFirst ? '#eab308' : isSecond ? '#9ca3af' : undefined;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          marginHorizontal: 12,
          marginVertical: 6,
          borderRadius: 12,
          padding: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: '#e6eaf2',
        }}
      >
        {/* Rank number */}
        <Text style={{ width: 28, fontWeight: '800', color: rankColor }}>{index + 1}</Text>

        {/* Avatar with badge for top 2 */}
        <View style={{ marginRight: 10 }}>
          <Image source={{ uri: item.avatar }} style={{ width: 44, height: 44, borderRadius: 22 }} />
          {(isFirst || isSecond) && (
            <View
              style={{
                position: 'absolute',
                right: -6,
                bottom: -6,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 2,
              }}
            >
              <Ionicons
                name="trophy"
                size={16}
                color={badgeColor}
              />
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={{ fontWeight: '700', flex: 1, color: '#0b1220' }}>{item.name}</Text>

        {/* Points */}
        <Text style={{ fontWeight: '800', color: '#2f95dc' }}>{item.points} pts</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(r) => r.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}
