import * as Crypto from 'expo-crypto';

export interface AttendanceData {
  lectureId: string;
  lectureName: string;
  timestamp: number;
  teacherId: string;
  expiresAt: number;
}

// Simple XOR encryption for React Native compatibility
const xorEncrypt = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
};

const xorDecrypt = (encryptedText: string, key: string): string => {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
};

let secretKey = 'AttendanceApp2025SecretKeyDefault';

export const encryptData = (data: AttendanceData): string => {
  const jsonString = JSON.stringify(data);
  return xorEncrypt(jsonString, secretKey);
};

export const decryptData = (encryptedData: string): AttendanceData | null => {
  try {
    const decrypted = xorDecrypt(encryptedData, secretKey);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

export const generateQRData = async (lectureId: string, lectureName: string, teacherId: string): Promise<string> => {
  const timestamp = Date.now();
  const expiresAt = timestamp + (10 * 1000); // 10 seconds from now
  
  const data: AttendanceData = {
    lectureId,
    lectureName,
    timestamp,
    teacherId,
    expiresAt
  };
  
  const encrypted = encryptData(data);
  return `attendance://mark?data=${encodeURIComponent(encrypted)}`;
};

export const isQRValid = (data: AttendanceData): boolean => {
  const now = Date.now();
  return now <= data.expiresAt;
};
