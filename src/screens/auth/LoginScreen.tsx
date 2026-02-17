import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, SubText} from '../../components/ui/Typography';
import { NexusInput } from '../../components/ui/NexusInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api/auth';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  
  const handleLogin = async () => {
  setIsLoading(true);
  try {
    const data = await loginUser(identifier, password);
    await signIn(data.access_token); 
  } catch (error: any) {
    Alert.alert('Login Failed', error.response?.data?.message || 'Error');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <SafeScreenWrapper>
      <LoadingOverlay visible={isLoading} />
      
      <View style={styles.headerSection}>
        <Heading>Nexus</Heading>
        <SubText>Sign in to continue your journey.</SubText>
      </View>

      <View style={styles.formSection}>
        <NexusInput 
          placeholder="Username or Email" 
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none" 
        />
        <NexusInput 
          placeholder="Password" 
          isPassword 
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity style={styles.forgotPass}>
          <Text style={styles.purpleText}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton title="Login" onPress={handleLogin} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <SubText>
            New here? <Text style={styles.purpleTextBold}>Create Account</Text>
          </SubText>
        </TouchableOpacity>
      </View>
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    marginTop: 80,
    marginBottom: 40,
  },
  formSection: {
    flex: 1,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  purpleText: {
    color: '#6366f1',
    fontSize: 14,
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

export default LoginScreen;