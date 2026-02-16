import { View } from 'react-native';

export const Divider = ({ space = 20 }: { space?: number }) => (
  <View style={{ 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    marginVertical: space,
    width: '100%' 
  }} />
);