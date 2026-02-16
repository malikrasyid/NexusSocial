import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, SubText} from '../../components/ui/Typography';
import { NexusInput } from '../../components/ui/NexusInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import client from '../../api/client';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { registerUser } from '../../api/auth';

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(fullName, email, password);
      Alert.alert('Success', 'Account created! Please login.');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeScreenWrapper>
      <LoadingOverlay visible={isLoading} />
      
      <View style={styles.headerSection}>
        <Heading>Join Nexus</Heading>
        <SubText>Create an account to start sharing.</SubText>
      </View>

      <View style={styles.formSection}>
        <NexusInput
          placeholder="Full Name" 
          value={fullName}
          onChangeText={setFullName}
        />
        <NexusInput 
          placeholder="Email Address" 
          autoCapitalize="none" 
          value={email}
          onChangeText={setEmail}
        />
        <NexusInput 
          placeholder="Password" 
          isPassword 
          value={password}
          onChangeText={setPassword}
        />
        <NexusInput placeholder="Confirm Password" isPassword />

        <View style={{ marginTop: 10 }}>
          <PrimaryButton title="Sign Up" onPress={handleRegister} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SubText>
            Already have an account? <Text style={styles.purpleTextBold}>Login</Text>
          </SubText>
        </TouchableOpacity>
      </View>
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    marginTop: 60,
    marginBottom: 30,
  },
  formSection: {
    flex: 1,
  },
  purpleTextBold: {
    color: '#6366f1',
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default RegisterScreen;