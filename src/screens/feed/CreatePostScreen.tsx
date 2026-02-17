import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, SubText, Label } from '../../components/ui/Typography';
import { NexusInput } from '../../components/ui/NexusInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { createPost } from '../../api/post';
import { uploadAvatar } from '../../api/user';
import { useAuth } from '../../context/AuthContext';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // 2. Post Logic
  const handlePost = async () => {
    if (!caption.trim() && !image) {
      Alert.alert("Empty Post", "Please write something or add an image.");
      return;
    }

    setLoading(true);
    try {
      // NOTE: You need to ensure your createPost API handles FormData if sending image
      // Or upload image first, get URL, then send JSON.
      // Assuming createPost takes FormData directly:
      const formData = new FormData();
      formData.append('caption', caption);
      
      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        // @ts-ignore
        formData.append('file', { uri: image, name: filename, type });
      }

      await createPost(formData);
      
      // Navigate back (Root Navigator handles closing the modal)
      navigation.goBack(); 
    } catch (error) {
      Alert.alert("Error", "Failed to post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const userAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`;

  return (
    <SafeScreenWrapper style={{ paddingHorizontal: 0 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        
        {/* 1. CUSTOM HEADER */}
        <View style={styles.header}>

          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Label style={{ fontSize: 16, color: '#666' }}>Cancel</Label>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="x" size={24} color="#00000" />
          </TouchableOpacity>

          <Heading style={{ fontSize: 16 }}>New Post</Heading>

          {/* <TouchableOpacity 
            style={[styles.postButton, (!caption && !image) && styles.disabledButton]} 
            onPress={handlePost}
            disabled={loading || (!caption && !image)}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Label style={styles.postButtonText}>Post</Label>
                <Feather name="send" size={14} color="#fff" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity> */}
          
          <TouchableOpacity onPress={handlePost} disabled={loading || (!caption.trim() && !image)}>
            <Feather name="send" size={24} color="#00000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          
          {/* 2. USER INFO ROW */}
          <View style={styles.userRow}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
            <View>
              <Label style={styles.username}>{user?.username}</Label>
              <SubText style={{ fontSize: 12 }}>Public</SubText>
            </View>
          </View>

          {/* 3. LARGE CAPTION INPUT */}
          <TextInput
            style={styles.input}
            placeholder="What's happening?"
            placeholderTextColor="#9ca3af"
            multiline
            value={caption}
            onChangeText={setCaption}
            autoFocus
          />

          {/* 4. SMALLER IMAGE PREVIEW */}
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              {/* Remove Image Button */}
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                <Feather name="x" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : null}

        </ScrollView>

        {/* 5. BOTTOM TOOLBAR (Add Media) */}
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={pickImage} style={styles.toolIcon}>
            <Feather name="image" size={24} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolIcon}>
            <Feather name="camera" size={24} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolIcon}>
            <Feather name="hash" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  postButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#c7c7fc', // Lighter purple when disabled
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
  },
  input: {
    fontSize: 22, // <-- LARGER TEXT
    color: '#1f2937',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'flex-start', // Don't stretch full width
  },
  previewImage: {
    width: 200,  // <-- SMALLER IMAGE
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 12,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 25,
  },
  toolIcon: {
    padding: 5,
  }
});

export default CreatePostScreen;