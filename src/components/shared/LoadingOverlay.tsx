import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

export const LoadingOverlay = ({ visible }: { visible: boolean }) => (
  <Modal transparent visible={visible}>
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Tinted white
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }
});