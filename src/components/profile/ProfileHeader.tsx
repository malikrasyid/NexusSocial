import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Heading, SubText, Label, Body } from '../ui/Typography';
import { User } from '../../types';

const { width } = Dimensions.get('window');

interface ProfileHeaderProps {
  user: User | null;
  isOwnProfile: boolean;
  postCount: number;
  onBack: () => void;
  onMenu: () => void;
  onEditProfile: () => void;
  onMessage: () => void;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  postCount,
  onBack,
  onMenu,
  onEditProfile,
  onMessage,
}: ProfileHeaderProps) => {
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=200`;

  return (
    <>
      {/* --- HERO AVATAR --- */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.heroImage} resizeMode="cover" />
        
        <View style={[styles.floatingHeader, !isOwnProfile ? { justifyContent: 'space-between' } : { justifyContent: 'flex-end' }]}>
          {!isOwnProfile && (
            <TouchableOpacity style={styles.iconBlur} onPress={onBack}>
               <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {isOwnProfile && (
            <TouchableOpacity style={styles.iconBlur} onPress={onMenu}>
               <Feather name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.heroTextOverlay}>
           <Heading style={styles.heroName}>{user?.username}</Heading>
           <SubText style={styles.heroHandle}>@{user?.username}</SubText>
        </View>
      </View>

      {/* --- DATA SHEET --- */}
      <View style={styles.contentSheet}>
        <View style={styles.statsRow}>
          <StatBox label="Followers" value={user?.followers?.length?.toString() || "0"} />
          <StatBox label="Following" value={user?.following?.length?.toString() || "0"} />
          <StatBox label="Posts" value={postCount.toString()} />
        </View>

        <View style={styles.bioSection}>
          {user?.bio && <Body style={styles.bioText}>{user?.bio}</Body>}
          {user?.interests && user?.interests.length > 0 && (
            <View style={styles.chipContainer}>
              {user.interests.map((item: string, i: number) => (
                <View key={i} style={styles.chip}>
                  <SubText style={styles.chipText}>{item}</SubText>
                </View>
              ))}
            </View>
          )}
        </View>

        {isOwnProfile ? (
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <Label style={styles.editButtonText}>Edit Profile</Label>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
            <Feather name="message-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Label style={styles.editButtonText}>Message</Label>
          </TouchableOpacity>
        )}
        
        <View style={styles.postsHeader}>
           <Heading style={{ fontSize: 18 }}>Recent Posts</Heading>
        </View>
      </View>
    </>
  );
};

// --- Sub Component ---
const StatBox = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.statItem}>
    <Heading style={styles.statValue}>{value}</Heading>
    <SubText style={styles.statLabel}>{label}</SubText>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  heroContainer: { width, height: width, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  floatingHeader: { position: 'absolute', top: 50, left: 16, right: 16, flexDirection: 'row', zIndex: 10 },
  iconBlur: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20 },
  heroTextOverlay: { position: 'absolute', bottom: 40, left: 20, zIndex: 5 },
  heroName: { color: '#fff', fontSize: 28, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  heroHandle: { color: 'rgba(255,255,255,0.9)', fontSize: 16, marginTop: 4, fontWeight: '500', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5 },
  contentSheet: { marginTop: -25, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 25, paddingTop: 30, paddingBottom: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 20 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  statLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#9ca3af', marginTop: 2 },
  bioSection: { marginBottom: 25 },
  bioText: { fontSize: 15, lineHeight: 22, color: '#4b5563', marginBottom: 15 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  chipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  editButton: { backgroundColor: '#1f2937', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  messageButton: { backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 30 },
  editButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  postsHeader: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 20, paddingBottom: 10, alignItems: 'center' }
});