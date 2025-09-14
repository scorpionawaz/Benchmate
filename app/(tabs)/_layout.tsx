// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Redirect, Stack, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  // load Ionicons font explicitly
  const [fontsLoaded] = useFonts({
    ...(Ionicons.font as any),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={{ marginTop: 8 }}>Loading icons...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/login" />;

  // helper: choose icon names by flexible matching of route.name
  const iconForRoute = (routeName: string) => {
    const name = (routeName || '').toLowerCase();
    if (name.includes('student') || name.includes('portal') || name === 'student') {
      return { active: 'home', inactive: 'home-outline' };
    }
    if (name.includes('task')) {
      return { active: 'list', inactive: 'list-outline' };
    }
    if (name.includes('activity') || name.includes('activities') || name.includes('image')) {
      return { active: 'image', inactive: 'image-outline' };
    }
    if (name.includes('quiz')) {
      return { active: 'help-circle', inactive: 'help-circle-outline' };
    }
    if (name.includes('leader') || name.includes('leaderboard')) {
      return { active: 'trophy', inactive: 'trophy-outline' };
    }
    // fallback
    return { active: 'ellipse', inactive: 'ellipse-outline' };
  };

  if (userRole === 'teacher') {
    return (
      <Stack>
        <Stack.Screen name="teacher" options={{ headerShown: false }} />
        <Stack.Screen name="teacher/create-activity" options={{ title: 'Create Activity' }} />
        <Stack.Screen name="teacher/create-quiz" options={{ title: 'Create Quiz' }} />
      </Stack>
    );
  }

  if (userRole === 'student') {
    return (
      <Tabs
        screenOptions={({ route }) => {
          // debug: prints exactly what route.name is — check Metro logs
          console.log('Tab route (raw):', route.name);

          const names = iconForRoute(route.name ?? '');
          return {
            headerShown: false,
            tabBarActiveTintColor: '#2f95dc',
            tabBarInactiveTintColor: '#8e8e93',
            tabBarShowLabel: true,
            tabBarIcon: ({ color, size = 24, focused }) => {
              const iconName = focused ? names.active : names.inactive;
              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
          };
        }}
      >
        {/* Use the logical names you expect — mapping is flexible, so variations should still work */}
        <Tabs.Screen name="student" options={{ title: 'Portal' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="activities" options={{ title: 'Activity' }} />
        <Tabs.Screen name="quizzes" options={{ title: 'Quizzes' }} />
        <Tabs.Screen name="leaderboard" options={{ title: 'Leaders' }} />

        {/* keep teacher routes but hide them for students */}
        <Tabs.Screen name="teacher" options={{ href: null }} />
        <Tabs.Screen name="teacher/create-activity" options={{ href: null }} />
        <Tabs.Screen name="teacher/create-quiz" options={{ href: null }} />
      </Tabs>
    );
  }

  return <Redirect href="/login" />;
}
