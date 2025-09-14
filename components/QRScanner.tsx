import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { decryptData, isQRValid } from '../utils/encryption';
import { saveAttendance, AttendanceRecord } from '../utils/storage';

interface QRScannerProps {
  onAttendanceMarked: (record: AttendanceRecord) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onAttendanceMarked }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Permission error:', error);
      setHasPermission(false);
    }
  };

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    console.log('QR Code scanned:', data); // Debug log
    setScanned(true);
    setIsScanning(false);

    if (!studentId || !studentName) {
      Alert.alert('Error', 'Please enter your Student ID and Name first');
      setScanned(false);
      return;
    }

    try {
      // Parse the QR data
      const url = new URL(data);
      if (url.protocol !== 'attendance:' || url.hostname !== 'mark') {
        Alert.alert('Invalid QR Code', 'This is not a valid attendance QR code');
        setScanned(false);
        return;
      }

      const encryptedData = url.searchParams.get('data');
      if (!encryptedData) {
        Alert.alert('Invalid QR Code', 'QR code data is missing');
        setScanned(false);
        return;
      }

      console.log('Encrypted data:', encryptedData); // Debug log
      const decryptedData = decryptData(decodeURIComponent(encryptedData));
      
      if (!decryptedData) {
        Alert.alert('Invalid QR Code', 'Failed to decrypt QR code data');
        setScanned(false);
        return;
      }

      // Check if QR code is still valid (not expired)
      if (!isQRValid(decryptedData)) {
        Alert.alert('QR Code Expired', 'This QR code has expired. Please ask your teacher to generate a new one.');
        setScanned(false);
        return;
      }

      // Create attendance record
      const attendanceRecord: AttendanceRecord = {
        id: `${studentId}_${decryptedData.lectureId}_${Date.now()}`,
        studentId,
        studentName,
        lectureId: decryptedData.lectureId,
        lectureName: decryptedData.lectureName,
        timestamp: Date.now(),
        teacherId: decryptedData.teacherId,
      };

      // Save attendance
      await saveAttendance(attendanceRecord);
      onAttendanceMarked(attendanceRecord);

      Alert.alert(
        'Attendance Marked! ✅',
        `Your attendance has been successfully recorded for ${decryptedData.lectureName}`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );

    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Failed to process QR code. Please try again.');
      setScanned(false);
    }
  };

  const startScanning = () => {
    if (!studentId || !studentName) {
      Alert.alert('Required Fields', 'Please enter your Student ID and Name before scanning');
      return;
    }
    setIsScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getCameraPermissions}>
          <Text style={styles.retryButtonText}>Retry Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Student ID"
          value={studentId}
          onChangeText={setStudentId}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Student Name"
          value={studentName}
          onChangeText={setStudentName}
        />
      </View>

      {!isScanning ? (
        <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
          <Text style={styles.buttonText}>📷 Scan QR Code for Attendance</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.scannerContainer}>
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            />
            {/* Scanner overlay */}
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={styles.scanFrame} />
              </View>
              <Text style={styles.instructionText}>
                Position QR code within the frame
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.cancelButton} onPress={stopScanning}>
            <Text style={styles.cancelButtonText}>Cancel Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    minHeight: 400, // Fixed height to ensure visibility
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
