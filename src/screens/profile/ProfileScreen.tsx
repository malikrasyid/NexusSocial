import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/user';
import { getUserPosts } from '../../api/post';
import { SubText } from '../../components/ui/Typography';
import { PostCard } from '../../components/feed/PostCard';
import { ProfileHeader } from '../../components/profile/ProfileHeader'; 
import { formatRelativeTime } from '../../utils/date';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user: currentUser } = useAuth();

  const targetUserId = route.params?.userId;
  const isOwnProfile = !targetUserId || targetUserId === currentUser?._id;
  const activeUserId = targetUserId || currentUser?._id;

  const [user, setUser] = useState<any>(isOwnProfile ? currentUser : null);
  const [loading, setLoading] = useState(!isOwnProfile);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeUserId) return;
      
      try {
        setLoading(true);
        const [profileData, postsData] = await Promise.all([
          isOwnProfile ? currentUser : getUserProfile(activeUserId),
          getUserPosts(activeUserId)
        ]);

        setUser(profileData);
        setPosts(postsData);
      } catch (error) {
        console.error('Failed to load profile/posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeUserId, currentUser, isOwnProfile]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ListHeaderComponent={
          <ProfileHeader 
            user={user} // <-- Now passing 'user' instead of 'profile'
            isOwnProfile={isOwnProfile}
            postCount={posts.length}
            onBack={() => navigation.goBack()}
            onMenu={() => navigation.navigate('Settings')}
            onEditProfile={() => navigation.navigate('EditProfile')}
            onMessage={() => navigation.navigate('ChatRoom', {
              userId: user._id,
              username: user.username,
              avatar: user.avatar,
            })}
          />
        }
        ListEmptyComponent={() => (
           <View style={styles.emptyContainer}>
             <Feather name="edit-3" size={40} color="#e5e7eb" />
             <SubText style={{ marginTop: 10, color: '#9ca3af' }}>No posts yet.</SubText>
           </View>
        )}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff' }}> 
            <PostCard
              id={item._id}
              userId={item.user?._id || activeUserId}
              username={item.user?.username || user?.username} // Fallback to 'user' state
              avatarUrl={item.user?.avatar || user?.avatar}   // Fallback to 'user' state
              imageUrl={item.imageUrl}
              likes={item.likes?.length || 0}
              isLiked={item.likes?.includes(currentUser?._id)} 
              caption={item.caption}
              timeAgo={formatRelativeTime(item.createdAt)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerAll: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyContainer: { padding: 40, alignItems: 'center', backgroundColor: '#fff', paddingBottom: 100 }
});

export default ProfileScreen;