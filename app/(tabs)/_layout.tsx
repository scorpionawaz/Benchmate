// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, Tabs } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  // Loading gate
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  // Auth gate
  if (!isAuthenticated) return <Redirect href="/login" />;

  // TEACHER FLOW: render a Stack only (no bottom tabs)
  // - teacher is the dashboard screen file at app/(tabs)/teacher.tsx
  // - add create screens under the teacher segment as separate files:
  //   app/(tabs)/teacher/create-activity.tsx
  //   app/(tabs)/teacher/create-quiz.tsx
  if (userRole === 'teacher') {
    return (
      <Stack>
        <Stack.Screen name="teacher" options={{ headerShown: false }} />
        <Stack.Screen name="teacher/create-activity" options={{ title: 'Create Activity' }} />
        <Stack.Screen name="teacher/create-quiz" options={{ title: 'Create Quiz' }} />
      </Stack>
    );
  }

  // STUDENT FLOW: render bottom tabs (no teacher routes)
  if (userRole === 'student') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2f95dc',
          headerStyle: { backgroundColor: '#f0f0f0' },
        }}
      >
        <Tabs.Screen
          name="student"
          options={{
            title: 'Portal',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size ?? 24} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'list' : 'list-outline'} color={color} size={size ?? 24} />
            ),
          }}
        />
        {/* No student-facing 'create' tab */}
        <Tabs.Screen
          name="activities"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'images' : 'images-outline'} color={color} size={size ?? 24} />
            ),
          }}
        />
        <Tabs.Screen
          name="quizzes"
          options={{
            title: 'Quizzes',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} color={color} size={size ?? 24} />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaders',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'trophy' : 'trophy-outline'} color={color} size={size ?? 24} />
            ),
          }}
        />
        {/* Explicitly hide teacher screens for students */}
        <Tabs.Screen name="teacher" options={{ href: null }} />
        <Tabs.Screen name="teacher/create-activity" options={{ href: null }} />
        <Tabs.Screen name="teacher/create-quiz" options={{ href: null }} />
      </Tabs>
    );
  }

  // Fallback redirect
  return <Redirect href="/login" />;
}
