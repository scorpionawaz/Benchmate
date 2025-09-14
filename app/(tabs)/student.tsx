

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { default as React, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QRScanner } from '../../components/QRScanner';
import { useAuth } from '../../contexts/AuthContext';
import { AttendanceRecord, getAttendanceRecords } from '../../utils/storage';

export default function StudentScreen() {
  const [myAttendance, setMyAttendance] = useState<AttendanceRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

    // ADD THESE LINES HERE:
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };
  // END OF NEW CODE

  useEffect(() => {
    loadMyAttendance();
  }, []);

  const loadMyAttendance = async () => {
    const allRecords = await getAttendanceRecords();
    setMyAttendance(allRecords);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyAttendance();
    setRefreshing(false);
  };

  const handleAttendanceMarked = (record: AttendanceRecord) => {
    setMyAttendance(prev => [record, ...prev]);
  };

 return (
  <ScrollView 
    style={styles.container}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
  >
    {/* NEW HEADER WITH LOGOUT BUTTON - ADDED */}
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.title}>Student Portal</Text>
          {user && (
            <Text style={styles.welcomeText}>
              Welcome, {user.name} (ID: {user.id})
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
    
    {/* KEEP ALL YOUR EXISTING FUNCTIONALITY - UNCHANGED */}
    {/* QR Scanner Section */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mark Attendance</Text>
      <QRScanner onAttendanceMarked={handleAttendanceMarked} />
    </View>

    {/* My Attendance Records */}
    {myAttendance.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Attendance History ({myAttendance.length})</Text>
        {myAttendance.map((record) => (
          <View key={record.id} style={styles.attendanceCard}>
            <Text style={styles.lectureName}>{record.lectureName}</Text>
            <Text style={styles.attendanceDate}>
              {new Date(record.timestamp).toLocaleDateString()} - {' '}
              {new Date(record.timestamp).toLocaleTimeString()}
            </Text>
            <Text style={styles.studentInfo}>
              {record.studentName} (ID: {record.studentId})
            </Text>
          </View>
        ))}
      </View>
    )}

    {myAttendance.length === 0 && (
      <View style={styles.section}>
        <Text style={styles.noRecordsText}>
          No attendance records found. Scan a QR code to mark your attendance.
        </Text>
      </View>
    )}
  </ScrollView>
);

}

const styles = StyleSheet.create({
  // Add to existing styles
header: {
  padding: 16,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
headerContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
welcomeText: {
  fontSize: 14,
  color: '#666',
  marginTop: 4,
},
logoutButton: {
  padding: 8,
},

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  attendanceCard: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  lectureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  attendanceDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  studentInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  noRecordsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
