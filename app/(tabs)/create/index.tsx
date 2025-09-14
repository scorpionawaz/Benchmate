import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CreateActivity() {
  const [caption, setCaption] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled && res.assets?.length) setImageUri(res.assets.uri);
  };

  const post = async () => {
    // TODO: upload to backend / storage
    setCaption('');
    setImageUri(null);
    alert('Posted!');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity onPress={pickImage} style={{ height: 220, backgroundColor: '#f2f2f2', borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {imageUri ? <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} /> : (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="image-outline" size={36} color="#888" />
            <Text style={{ color: '#888', marginTop: 8 }}>Tap to add image</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Write text / poem / meme idea..."
        value={caption}
        onChangeText={setCaption}
        multiline
        style={{ marginTop: 16, backgroundColor: '#fff', borderRadius: 12, padding: 12, minHeight: 120, textAlignVertical: 'top' }}
      />
      <TouchableOpacity onPress={post} style={{ marginTop: 16, backgroundColor: '#2f95dc', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}
