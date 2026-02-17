import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Label, Heading } from '../../components/ui/Typography';
import { NexusInput } from '../../components/ui/NexusInput';
import { useAuth } from '../../context/AuthContext';
import { updateProfileData, uploadAvatar } from '../../api/user';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [birthday, setBirthday] = useState(
    user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''
  );
  const [interests, setInterests] = useState(user?.interests?.join(', ') || '');  
  const [image, setImage] = useState(user?.avatar || null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7, 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Upload Avatar (Only if changed)
      if (image && image !== user?.avatar) {
        await uploadAvatar(image);
      }

      // Update Text Profile
      const updatePayload = {
        name,
        bio,
        gender,
        birthday, 
        height: height ? Number(height) : undefined, 
        weight: weight ? Number(weight) : undefined,
        interests: interests.split(',').map(i => i.trim()).filter(i => i),
      };

      await updateProfileData(updatePayload);

      await refreshUser(); 

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();

    } catch (error: any) {
      console.error('Update Failed:', error);
      Alert.alert('Error', 'Could not update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreenWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header Bar */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Label style={{ color: '#666', fontSize: 16 }}>Cancel</Label>
          </TouchableOpacity>
          
          <Heading style={{ fontSize: 18 }}>Edit Profile</Heading>
          
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#6366f1" size="small" />
            ) : (
              <Label style={{ color: '#6366f1', fontSize: 16, fontWeight: '700' }}>Done</Label>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <Image 
                source={{ uri: image || 'https://via.placeholder.com/150' }} 
                style={styles.avatar} 
              />
              <View style={styles.editIconOverlay}>
                <Feather name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Label style={styles.changePhotoText}>Change Profile Photo</Label>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <InputGroup label="Display Name" value={name} onChange={setName} placeholder="e.g. John Doe" />
            
            <InputGroup 
              label="Bio" 
              value={bio} 
              onChange={setBio} 
              placeholder="Tell the world about yourself..." 
              multiline 
            />
            
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputGroup label="Gender" value={gender} onChange={setGender} placeholder="Not specified" />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <InputGroup label="Birthday" value={birthday} onChange={setBirthday} placeholder="YYYY-MM-DD" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputGroup 
                  label="Height (cm)" 
                  value={height} 
                  onChange={setHeight} 
                  numeric 
                  placeholder="0" 
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <InputGroup 
                  label="Weight (kg)" 
                  value={weight} 
                  onChange={setWeight} 
                  numeric 
                  placeholder="0" 
                />
              </View>
            </View>

            <InputGroup 
              label="Interests" 
              value={interests} 
              onChange={setInterests} 
              placeholder="Coding, Design, Coffee (comma separated)" 
            />
          </View>
          
          <View style={{ height: 40 }} /> 
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreenWrapper>
  );
};

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  numeric?: boolean;
  multiline?: boolean;
}

const InputGroup = ({ label, value, onChange, placeholder, numeric, multiline }: InputGroupProps) => (
  <View style={styles.inputContainer}>
    <Label style={styles.inputLabel}>{label}</Label>
    <NexusInput 
      value={value} 
      onChangeText={onChange} 
      placeholder={placeholder}
      keyboardType={numeric ? 'numeric' : 'default'}
      multiline={multiline}
      style={multiline ? styles.textArea : undefined}
    />
  </View>
);

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    backgroundColor: '#6366f1',
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
  },
});

export default EditProfileScreen;