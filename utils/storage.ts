import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  lectureId: string;
  lectureName: string;
  timestamp: number;
  teacherId: string;
}

export const saveAttendance = async (record: AttendanceRecord): Promise<void> => {
  try {
    const existingRecords = await getAttendanceRecords();
    const updatedRecords = [...existingRecords, record];
    await AsyncStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('Error saving attendance:', error);
  }
};

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const records = await AsyncStorage.getItem('attendance_records');
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error getting attendance records:', error);
    return [];
  }
};

export const getAttendanceByLecture = async (lectureId: string): Promise<AttendanceRecord[]> => {
  const allRecords = await getAttendanceRecords();
  return allRecords.filter(record => record.lectureId === lectureId);
};
