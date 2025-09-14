import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the teacher tab by default
  return <Redirect href="/(tabs)/teacher" />;
}
