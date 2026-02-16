import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, SubText, Label } from '../../components/ui/Typography';
import { NexusInput } from '../../components/ui/NexusInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { createPost } from '../../api/post';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // 1. Pick Image Logic
  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square posts (Instagram style)
      quality: 0.8,   // Compress slightly for faster upload
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 2. Submit Logic
  const handleSubmit = async () => {
    if (!caption && !image) {
      Alert.alert('Nexus', 'Please add a photo or a caption.');
      return;
    }

    setUploading(true);
    try {
      // Call the API function we created earlier
      await createPost(caption, image || undefined);
      
      Alert.alert('Success', 'Your post is live!');
      navigation.goBack(); // Return to Feed
    } catch (error) {
      Alert.alert('Error', 'Could not upload post. Please try again.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeScreenWrapper>
      <LoadingOverlay visible={uploading} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
        <Heading style={{ fontSize: 20 }}>New Post</Heading>
        <TouchableOpacity onPress={handleSubmit} disabled={uploading}>
          <Label style={{ color: '#6366f1' }}>Post</Label>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Picker Area */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Feather name="camera" size={40} color="#9ca3af" />
              <SubText style={{ marginTop: 10 }}>Tap to select photo</SubText>
            </View>
          )}
        </TouchableOpacity>

        {/* Change Photo Button (only shows if image selected) */}
        {image && (
          <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 20 }}>
            <Label style={{ color: '#666' }}>Change Photo</Label>
          </TouchableOpacity>
        )}

        {/* Caption Input */}
        <View style={styles.inputContainer}>
          <NexusInput
            placeholder="Write a caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
            style={{ height: 100, textAlignVertical: 'top', paddingTop: 15 }} 
            // ^ Override default height for textarea feel
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <PrimaryButton title="Share Post" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 1, // Keep it square
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed', // Nice styling touch
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
});

export default CreatePostScreen;