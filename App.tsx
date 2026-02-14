import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import client from './src/api/client'; // Import your new client

export default function App() {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // We'll try to hit the backend. Even a 404 or 401 means it's CONNECTED.
        // If it's a "Network Error", then it failed.
        await client.get('/'); 
        setStatus('✅ Connected to Backend (3001)');
      } catch (error: any) {
        if (error.message === 'Network Error') {
          setStatus('❌ Network Error. Check IP/Port.');
        } else {
          // If we get 404/401, it means we REACHED the server, so it's a success for connectivity.
          setStatus(`✅ Reachable (Status: ${error.response?.status || 'Unknown'})`);
        }
      } finally {
        setLoading(false);
      }
    };

    checkServer();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
      {loading && <ActivityIndicator size="large" color="#4F46E5" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});