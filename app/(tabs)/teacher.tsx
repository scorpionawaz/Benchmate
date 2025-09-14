import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AttendanceList } from '../../components/AttendanceList';
import { QRGenerator } from '../../components/QRGenerator';
import { getCurrentLecture, Lecture, TIMETABLE } from '../../constants/lectureData';
import { useAuth } from '../../contexts/AuthContext';
import { AttendanceRecord, getAttendanceByLecture } from '../../utils/storage';

export default function TeacherScreen() {
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customLectureName, setCustomLectureName] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance'>('dashboard');

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

  useEffect(() => {
    updateCurrentLecture();
    const interval = setInterval(updateCurrentLecture, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedLecture) {
      loadAttendanceRecords(selectedLecture.id);
    }
  }, [selectedLecture]);

  const updateCurrentLecture = () => {
    const lecture = getCurrentLecture();
    setCurrentLecture(lecture);
    if (lecture && !selectedLecture) {
      setSelectedLecture(lecture);
    }
  };

  const loadAttendanceRecords = async (lectureId: string) => {
    const records = await getAttendanceByLecture(lectureId);
    setAttendanceRecords(records);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    updateCurrentLecture();
    if (selectedLecture) {
      await loadAttendanceRecords(selectedLecture.id);
    }
    setRefreshing(false);
  };

  const handleQRGenerated = (qrData: string) => {
    console.log('QR Generated:', qrData);
  };

  const selectLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
  };

  const createCustomLecture = () => {
    if (!customLectureName.trim()) {
      Alert.alert('Error', 'Please enter a lecture name');
      return;
    }
    const customLecture: Lecture = {
      id: `CUSTOM_${Date.now()}`,
      name: customLectureName.trim(),
      subject: customSubject.trim() || 'Custom Subject',
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      duration: '60 mins',
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
    };
    setSelectedLecture(customLecture);
    setShowCustomModal(false);
    setCustomLectureName('');
    setCustomSubject('');
  };

  const showCreateCustom = () => {
    setShowCustomModal(true);
  };

  // Attendance tab stays exactly the same
  // if (activeTab === 'attendance') {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.tabContainer}>
  //         <TouchableOpacity
  //           style={[styles.tab, styles.inactiveTab]}
  //           onPress={() => setActiveTab('dashboard')}
  //         >
  //           <Text style={styles.inactiveTabText}>Dashboard</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={[styles.tab, styles.activeTab]}
  //           onPress={() => setActiveTab('attendance')}
  //         >
  //           <Text style={styles.activeTabText}>📊 Attendance Data</Text>
  //         </TouchableOpacity>
  //       </View>
  //       <AttendanceList />
  //     </View>
  //   );
  // }
  if (activeTab === 'attendance') {
  return (
    <View style={styles.container}>
      {/* SAME HEADER AS DASHBOARD */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Teacher Dashboard</Text>
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

      {/* Tab Navigation (Attendance active) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, styles.inactiveTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={styles.inactiveTabText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, styles.activeTab]}
          onPress={() => setActiveTab('attendance')}
        >
          <Text style={styles.activeTabText}>📊 Attendance Data</Text>
        </TouchableOpacity>
      </View>

      {/* Keep the existing list below the same header */}
      <AttendanceList />
    </View>
  );
}


  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Teacher Dashboard</Text>
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

      {/* Tab Navigation (unchanged) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={styles.activeTabText}>🎯 Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, styles.inactiveTab]}
          onPress={() => setActiveTab('attendance')}
        >
          <Text style={styles.inactiveTabText}>Attendance Data</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Teacher Dashboard</Text>

      {/* NEW: Create row on Dashboard */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push('/teacher/create-activity')}
            style={{ flex: 1, backgroundColor: '#e9f5ff', borderRadius: 12, padding: 14 }}
          >
            <Text style={{ fontWeight: '700', color: '#2f95dc' }}>+ Create Activity</Text>
            <Text style={{ color: '#2f95dc', marginTop: 4 }}>Task for students</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/teacher/create-quiz')}
            style={{ flex: 1, backgroundColor: '#eefcf6', borderRadius: 12, padding: 14 }}
          >
            <Text style={{ fontWeight: '700', color: '#10b981' }}>+ Create Quiz</Text>
            <Text style={{ color: '#10b981', marginTop: 4 }}>MCQs with duration</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Lecture Indicator */}
      {currentLecture && (
        <View style={styles.currentLectureIndicator}>
          <Text style={styles.currentLectureText}>
            🔴 LIVE: {currentLecture.name} ({currentLecture.time})
          </Text>
        </View>
      )}

      {/* Lecture Selection Section (unchanged) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Lecture for Attendance</Text>

        <View style={styles.quickActions}>
          {currentLecture && (
            <TouchableOpacity
              style={[styles.quickActionButton, styles.currentButton]}
              onPress={() => selectLecture(currentLecture)}
            >
              <Text style={styles.quickActionText}>Current Lecture</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.quickActionButton, styles.customButton]}
            onPress={showCreateCustom}
          >
            <Text style={styles.quickActionText}>+ Custom Lecture</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subSectionTitle}>Today's Schedule:</Text>
        {TIMETABLE.map((lecture) => (
          <TouchableOpacity
            key={lecture.id}
            style={[
              styles.lectureCard,
              currentLecture?.id === lecture.id && styles.currentLectureCard,
              selectedLecture?.id === lecture.id && styles.selectedLectureCard
            ]}
            onPress={() => selectLecture(lecture)}
          >
            <Text style={styles.lectureName}>{lecture.name}</Text>
            <Text style={styles.lectureTime}>{lecture.time} - {lecture.duration}</Text>
            <Text style={styles.lectureSubject}>{lecture.subject}</Text>
            {currentLecture?.id === lecture.id && (
              <Text style={styles.currentLectureLabel}>• LIVE NOW</Text>
            )}
            {selectedLecture?.id === lecture.id && (
              <Text style={styles.selectedLectureLabel}>✓ SELECTED</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Lecture QR Generation (unchanged) */}
      {selectedLecture && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generate Attendance QR</Text>
          <View style={styles.selectedLectureContainer}>
            <Text style={styles.selectedLectureName}>{selectedLecture.name}</Text>
            <Text style={styles.selectedLectureDetails}>
              {selectedLecture.subject} • {selectedLecture.time}
            </Text>
            {selectedLecture.id.startsWith('CUSTOM_') && (
              <Text style={styles.customLectureLabel}>📝 Custom Lecture</Text>
            )}

            <QRGenerator
              lectureId={selectedLecture.id}
              lectureName={selectedLecture.name}
              teacherId="TEACHER_001"
              onQRGenerated={handleQRGenerated}
            />
          </View>
        </View>
      )}

      {/* Quick Attendance Summary (unchanged) */}
      {attendanceRecords.length > 0 && selectedLecture && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📋 {selectedLecture.name} - Quick Summary ({attendanceRecords.length} Present)
          </Text>
          <View style={styles.quickSummary}>
            {attendanceRecords.slice(0, 5).map((record) => (
              <View key={record.id} style={styles.quickAttendanceCard}>
                <Text style={styles.quickStudentName}>{record.studentName}</Text>
                <Text style={styles.quickStudentId}>ID: {record.studentId}</Text>
                <Text style={styles.quickAttendanceTime}>
                  {new Date(record.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
            {attendanceRecords.length > 5 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => setActiveTab('attendance')}
              >
                <Text style={styles.viewAllButtonText}>
                  View All {attendanceRecords.length} Records →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Custom Lecture Modal (unchanged) */}
      <Modal
        visible={showCustomModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Custom Lecture</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Lecture Name (e.g., Extra Doubt Session)"
              value={customLectureName}
              onChangeText={setCustomLectureName}
              maxLength={50}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Subject (optional)"
              value={customSubject}
              onChangeText={setCustomSubject}
              maxLength={30}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createCustomLecture}
              >
                <Text style={styles.createButtonText}>Create & Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {!selectedLecture && (
        <View style={styles.section}>
          <Text style={styles.noSelectionText}>
            👆 Select a lecture above to generate attendance QR code
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // existing styles unchanged...
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 14, color: '#666', marginTop: 4 },
  logoutButton: { padding: 8 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabContainer: { flexDirection: 'row', backgroundColor: 'white', elevation: 2 },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { backgroundColor: '#007AFF' },
  inactiveTab: { backgroundColor: 'white' },
  activeTabText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  inactiveTabText: { color: '#666', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
  currentLectureIndicator: { margin: 15, padding: 12, backgroundColor: '#FF6B6B', borderRadius: 8, alignItems: 'center' },
  currentLectureText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  section: { margin: 15, padding: 15, backgroundColor: 'white', borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  subSectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#666' },
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  quickActionButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  currentButton: { backgroundColor: '#4CAF50' },
  customButton: { backgroundColor: '#2196F3' },
  quickActionText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  lectureCard: { padding: 12, marginBottom: 10, backgroundColor: '#f8f8f8', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  currentLectureCard: { backgroundColor: '#E8F5E8', borderLeftColor: '#4CAF50' },
  selectedLectureCard: { backgroundColor: '#E3F2FD', borderLeftColor: '#2196F3', borderWidth: 2, borderColor: '#2196F3' },
  lectureName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  lectureTime: { fontSize: 14, color: '#666', marginTop: 2 },
  lectureSubject: { fontSize: 14, color: '#888', marginTop: 2 },
  currentLectureLabel: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold', marginTop: 5 },
  selectedLectureLabel: { fontSize: 12, color: '#2196F3', fontWeight: 'bold', marginTop: 5 },
  selectedLectureContainer: { alignItems: 'center' },
  selectedLectureName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5, textAlign: 'center' },
  selectedLectureDetails: { fontSize: 16, color: '#666', marginBottom: 10, textAlign: 'center' },
  customLectureLabel: { fontSize: 14, color: '#9C27B0', fontWeight: 'bold', marginBottom: 15 },
  noSelectionText: { fontSize: 16, color: '#888', textAlign: 'center', fontStyle: 'italic', marginTop: 20 },
  quickSummary: { gap: 8 },
  quickAttendanceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 6 },
  quickStudentName: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1 },
  quickStudentId: { fontSize: 13, color: '#666', flex: 1, textAlign: 'center' },
  quickAttendanceTime: { fontSize: 12, color: '#888', flex: 1, textAlign: 'right' },
  viewAllButton: { padding: 12, backgroundColor: '#007AFF', borderRadius: 6, alignItems: 'center', marginTop: 8 },
  viewAllButtonText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f0f0f0' },
  createButton: { backgroundColor: '#2196F3' },
  cancelButtonText: { color: '#666', fontWeight: 'bold' },
  createButtonText: { color: 'white', fontWeight: 'bold' },
});
