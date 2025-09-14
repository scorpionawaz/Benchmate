import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getAttendanceRecords, getAttendanceByLecture, AttendanceRecord } from '../utils/storage';
import { TIMETABLE } from '../constants/lectureData';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

interface AttendanceStats {
  totalLectures: number;
  totalAttendees: number;
  averageAttendance: number;
  mostAttended: string;
}

interface LectureAttendance {
  lectureId: string;
  lectureName: string;
  attendeeCount: number;
  attendees: AttendanceRecord[];
  date: string;
}

export const AttendanceList: React.FC = () => {
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [lectureAttendance, setLectureAttendance] = useState<LectureAttendance[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalLectures: 0,
    totalAttendees: 0,
    averageAttendance: 0,
    mostAttended: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week'>('all');
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [searchQuery, selectedFilter, allRecords]);

  const loadAttendanceData = async () => {
    const records = await getAttendanceRecords();
    setAllRecords(records);
    calculateStats(records);
    groupByLecture(records);
  };

  const groupByLecture = (records: AttendanceRecord[]) => {
    const grouped: { [key: string]: AttendanceRecord[] } = {};
    
    records.forEach(record => {
      if (!grouped[record.lectureId]) {
        grouped[record.lectureId] = [];
      }
      grouped[record.lectureId].push(record);
    });

    const lectureData: LectureAttendance[] = Object.entries(grouped).map(([lectureId, attendees]) => {
      const latestRecord = attendees[attendees.length - 1];
      return {
        lectureId,
        lectureName: latestRecord.lectureName,
        attendeeCount: attendees.length,
        attendees: attendees.sort((a, b) => b.timestamp - a.timestamp),
        date: new Date(latestRecord.timestamp).toDateString()
      };
    }).sort((a, b) => b.attendees[0].timestamp - a.attendees[0].timestamp);

    setLectureAttendance(lectureData);
  };

  const calculateStats = (records: AttendanceRecord[]) => {
    const uniqueLectures = [...new Set(records.map(r => r.lectureId))];
    const totalLectures = uniqueLectures.length;
    const totalAttendees = records.length;
    
    // Calculate most attended lecture
    const lectureCounts: { [key: string]: number } = {};
    records.forEach(record => {
      lectureCounts[record.lectureName] = (lectureCounts[record.lectureName] || 0) + 1;
    });
    
    const mostAttended = Object.entries(lectureCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    const averageAttendance = totalLectures > 0 ? Math.round(totalAttendees / totalLectures) : 0;

    setStats({
      totalLectures,
      totalAttendees,
      averageAttendance,
      mostAttended
    });
  };

  const filterRecords = () => {
    let filtered = [...allRecords];
    
    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    switch (selectedFilter) {
      case 'today':
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= today;
        });
        break;
      case 'week':
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= weekAgo;
        });
        break;
    }
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.lectureName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered.sort((a, b) => b.timestamp - a.timestamp));
  };

  const exportAttendance = async () => {
    try {
      const csvHeader = 'Student ID,Student Name,Lecture,Date,Time\n';
      const csvData = allRecords.map(record => {
        const date = new Date(record.timestamp);
        return `${record.studentId},${record.studentName},${record.lectureName},${date.toDateString()},${date.toLocaleTimeString()}`;
      }).join('\n');
      
      const csvContent = csvHeader + csvData;
      const fileName = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
      const uri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(uri, csvContent);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', `Attendance exported to: ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export attendance data');
    }
  };

  const toggleLectureExpansion = (lectureId: string) => {
    setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalLectures}</Text>
          <Text style={styles.statLabel}>Total Lectures</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalAttendees}</Text>
          <Text style={styles.statLabel}>Total Attendees</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.averageAttendance}</Text>
          <Text style={styles.statLabel}>Avg per Lecture</Text>
        </View>
      </View>

      <View style={styles.mostAttendedCard}>
        <Text style={styles.mostAttendedLabel}>Most Attended:</Text>
        <Text style={styles.mostAttendedText}>{stats.mostAttended}</Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.controlsContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student name, ID, or lecture..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.filterContainer}>
          {['all', 'today', 'week'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => setSelectedFilter(filter as any)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.activeFilterButtonText
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.exportButton} onPress={exportAttendance}>
          <Text style={styles.exportButtonText}>📊 Export CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Lecture-wise Attendance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance by Lecture</Text>
        {lectureAttendance.map(lecture => (
          <View key={lecture.lectureId} style={styles.lectureCard}>
            <TouchableOpacity 
              style={styles.lectureHeader}
              onPress={() => toggleLectureExpansion(lecture.lectureId)}
            >
              <View style={styles.lectureInfo}>
                <Text style={styles.lectureName}>{lecture.lectureName}</Text>
                <Text style={styles.lectureDate}>{lecture.date}</Text>
              </View>
              <View style={styles.attendanceCount}>
                <Text style={styles.countNumber}>{lecture.attendeeCount}</Text>
                <Text style={styles.countLabel}>Present</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedLecture === lecture.lectureId ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedLecture === lecture.lectureId && (
              <View style={styles.attendeesList}>
                {lecture.attendees.map(attendee => (
                  <View key={attendee.id} style={styles.attendeeRow}>
                    <View style={styles.attendeeInfo}>
                      <Text style={styles.attendeeName}>{attendee.studentName}</Text>
                      <Text style={styles.attendeeId}>ID: {attendee.studentId}</Text>
                    </View>
                    <Text style={styles.attendeeTime}>
                      {new Date(attendee.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* All Records List */}
      {filteredRecords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Records ({filteredRecords.length})</Text>
          {filteredRecords.map(record => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordStudentName}>{record.studentName}</Text>
                <Text style={styles.recordTime}>
                  {new Date(record.timestamp).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.recordLecture}>{record.lectureName}</Text>
              <Text style={styles.recordId}>Student ID: {record.studentId}</Text>
            </View>
          ))}
        </View>
      )}

      {filteredRecords.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No attendance records found</Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery ? 'Try adjusting your search' : 'Students will appear here after marking attendance'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  mostAttendedCard: {
    margin: 15,
    marginTop: 0,
    padding: 15,
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  mostAttendedLabel: {
    fontSize: 14,
    color: '#666',
  },
  mostAttendedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
  controlsContainer: {
    margin: 15,
    gap: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  exportButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  lectureCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  lectureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  lectureInfo: {
    flex: 1,
  },
  lectureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lectureDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  attendanceCount: {
    alignItems: 'center',
    marginRight: 15,
  },
  countNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  countLabel: {
    fontSize: 12,
    color: '#666',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
  },
  attendeesList: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  attendeeId: {
    fontSize: 13,
    color: '#666',
  },
  attendeeTime: {
    fontSize: 13,
    color: '#666',
  },
  recordCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recordStudentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordTime: {
    fontSize: 12,
    color: '#666',
  },
  recordLecture: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  recordId: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
