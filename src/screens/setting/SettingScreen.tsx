import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, Label, SubText, Body } from '../../components/ui/Typography';
import { useAuth } from '../../context/AuthContext';

const SettingScreen = () => {
  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of Nexus?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: signOut }
      ]
    );
  };

  return (
    <SafeScreenWrapper style={{ backgroundColor: '#f9fbfb', paddingTop: 0, paddingHorizontal: 0 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Heading style={{ fontSize: 18 }}>Settings</Heading>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
        
        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={styles.card}>
          <SettingItem icon="user" label="Personal Information" onPress={() => {}} />
          <SettingItem icon="lock" label="Security" onPress={() => {}} />
          <SettingItem icon="bell" label="Notifications" onPress={() => {}} />
          <SettingItem icon="shield" label="Privacy" onPress={() => {}} />
        </View>

        {/* App Section */}
        <SectionHeader title="App" />
        <View style={styles.card}>
          <SettingItem icon="moon" label="Dark Mode" value="Off" onPress={() => {}} />
          <SettingItem icon="globe" label="Language" value="English" onPress={() => {}} />
          <SettingItem icon="help-circle" label="Help & Support" onPress={() => {}} />
        </View>

        {/* Danger Zone */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#ef4444" />
            <Label style={{ color: '#ef4444', marginLeft: 12 }}>Log Out</Label>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <SubText style={{ textAlign: 'center', fontSize: 12 }}>Nexus v1.0.0</SubText>
        </View>

      </ScrollView>
    </SafeScreenWrapper>
  );
};

// --- Helpers ---
const SectionHeader = ({ title }: { title: string }) => (
  <Label style={{ color: '#6b7280', marginBottom: 8, marginLeft: 4, fontSize: 13, textTransform: 'uppercase' }}>
    {title}
  </Label>
);

const SettingItem = ({ icon, label, value, onPress }: any) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.iconBox}>
        <Feather name={icon} size={18} color="#374151" />
      </View>
      <Body style={{ marginLeft: 12 }}>{label}</Body>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {value && <SubText style={{ marginRight: 8 }}>{value}</SubText>}
      <Feather name="chevron-right" size={16} color="#d1d5db" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  backBtn: { padding: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { marginTop: 10, paddingBottom: 20 }
});

export default SettingScreen;