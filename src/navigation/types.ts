import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Type import

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type FeedScreenNavigationProp = NativeStackNavigationProp<{
  FeedMain: undefined;
  CreatePost: undefined;
}>;