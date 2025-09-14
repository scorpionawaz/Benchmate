import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Render tabs based on user role
  if (userRole === 'teacher') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2f95dc',
          headerStyle: {
            backgroundColor: '#f0f0f0',
          },
        }}>
        <Tabs.Screen
          name="teacher"
          options={{
            title: 'Teacher Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'school' : 'school-outline'} color={color} size={24} />
            ),
          }}
        />
        {/* Hide student tab for teachers */}
        <Tabs.Screen
          name="student"
          options={{
            href: null, // This hides the tab
          }}
        />
      </Tabs>
    );
  } else if (userRole === 'student') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2f95dc',
          headerStyle: {
            backgroundColor: '#f0f0f0',
          },
        }}>
        <Tabs.Screen
          name="student"
          options={{
            title: 'Student Portal',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
            ),
          }}
        />
        {/* Hide teacher tab for students */}
        <Tabs.Screen
          name="teacher"
          options={{
            href: null, // This hides the tab
          }}
        />
      </Tabs>
    );
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
