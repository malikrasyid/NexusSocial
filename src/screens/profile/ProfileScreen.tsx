import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, StatusBar, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, SubText, Label, Body } from '../../components/ui/Typography';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=200`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* 1. BIG HERO AVATAR (1:1 Aspect Ratio) */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.heroImage} resizeMode="cover" />
          
          {/* Floating Action Bar (Overlay) */}
          <View style={styles.floatingHeader}>
            <TouchableOpacity 
              style={styles.iconBlur} 
              onPress={() => navigation.navigate('Settings')}
            >
               <Feather name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Name Overlay (Bottom Left of Image) */}
          <View style={styles.heroTextOverlay}>
             <Heading style={styles.heroName}>{user?.name || user?.username}</Heading>
             <SubText style={styles.heroHandle}>@{user?.username}</SubText>
          </View>
        </View>

        {/* 2. DATA SHEET (White Background, Rounded Top) */}
        <View style={styles.contentSheet}>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatBox label="Followers" value={user?.followers?.length.toString() || "0"} />
            <StatBox label="Following" value={user?.following?.length.toString() || "0"} />
            <StatBox label="Posts" value="0" />
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            {user?.bio && <Body style={styles.bioText}>{user.bio}</Body>}
            
            {/* Interests Chips */}
            {user?.interests && user.interests.length > 0 && (
              <View style={styles.chipContainer}>
                {user.interests.map((item, i) => (
                  <View key={i} style={styles.chip}>
                    <SubText style={styles.chipText}>{item}</SubText>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Action Button (Full Width) */}
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Label style={styles.editButtonText}>Edit Profile</Label>
          </TouchableOpacity>

          {/* Posts Grid Area */}
          <View style={styles.postsArea}>
             <SubText style={{ textAlign: 'center', marginTop: 40 }}>No posts yet.</SubText>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

// --- Sub Components ---

const StatBox = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.statItem}>
    <Heading style={styles.statValue}>{value}</Heading>
    <SubText style={styles.statLabel}>{label}</SubText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black bg behind keeps status bar nice
  },
  heroContainer: {
    width: width,
    height: width, // Square
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    top: 40, 
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  iconBlur: {
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent black
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  heroTextOverlay: {
    position: 'absolute',
    bottom: 40, // Push up so it doesn't get covered by the rounded sheet corners
    left: 20,
    zIndex: 5,
  },
  heroName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  heroHandle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  contentSheet: {
    marginTop: -25, // Negative margin pulls it UP over the image
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 500, // Ensures scroll
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#9ca3af',
    marginTop: 2,
  },
  bioSection: {
    marginBottom: 25,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#1f2937', // Dark button for contrast
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  postsArea: {
    flex: 1,
    minHeight: 300,
  }
});

export default ProfileScreen;