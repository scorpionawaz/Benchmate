import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy'; // Changed this line
import { generateQRData } from '../utils/encryption';

interface QRGeneratorProps {
  lectureId: string;
  lectureName: string;
  teacherId: string;
  onQRGenerated: (qrData: string) => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  lectureId,
  lectureName,
  teacherId,
  onQRGenerated
}) => {
  const [qrData, setQrData] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  let qrRef: any = null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setQrData('');
      Alert.alert('QR Code Expired', 'Please generate a new QR code for attendance.');
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      const newQrData = await generateQRData(lectureId, lectureName, teacherId);
      setQrData(newQrData);
      setTimeLeft(10);
      setIsActive(true);
      onQRGenerated(newQrData);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate QR code. Please try again.');
      console.error('QR Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareQR = async () => {
    if (!qrData) return;
    
    try {
      // Create a simple share with the QR data
      await Sharing.shareAsync('data:text/plain;base64,' + btoa(qrData));
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const downloadQR = async () => {
    if (!qrData) return;
    
    try {
      const fileName = `attendance_${lectureId}_${Date.now()}.txt`;
      const uri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(uri, qrData);
      Alert.alert('Success', `QR code data saved to: ${fileName}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code');
    }
  };

  return (
    <View style={styles.container}>
      {!isActive ? (
        <TouchableOpacity 
          style={[styles.generateButton, isGenerating && styles.disabledButton]} 
          onPress={generateQR}
          disabled={isGenerating}
        >
          <Text style={styles.buttonText}>
            {isGenerating ? 'Generating...' : 'Take Attendance'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.lectureTitle}>{lectureName}</Text>
          <Text style={styles.timer}>Expires in: {timeLeft}s</Text>
          
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrData}
              size={200}
              color="black"
              backgroundColor="white"
              getRef={(c) => (qrRef = c)}
            />
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={shareQR}>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={downloadQR}>
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
  },
  lectureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timer: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
