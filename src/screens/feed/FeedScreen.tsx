import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, ActivityIndicator, Text, StatusBar, TouchableOpacity } from 'react-native';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { PostCard } from '../../components/feed/PostCard';
import { Heading } from '../../components/ui/Typography';
import { Feather } from '@expo/vector-icons';
import { getFeed } from '../../api/post';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { FeedScreenNavigationProp } from '../../navigation/types';
import { Post } from '../../types';
import { formatRelativeTime } from '../../utils/date';

const FeedScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<FeedScreenNavigationProp>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await getFeed();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 3. Pull-to-refresh logic
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const renderEmpty = () => (
    !loading ? (
      <View style={styles.emptyContainer}>
        <Feather name="coffee" size={48} color="#ccc" />
        <Text style={styles.emptyText}>No posts yet. Be the first!</Text>
      </View>
    ) : null
  );

  return (
    <SafeScreenWrapper 
    backgroundColor="#334155" 
    statusBarColor='light-content' 
    style={{ paddingHorizontal: 0 }}
    > 
      <View style={styles.topBar}>
        <Heading style={{ fontSize: 24, color: '#1f2937' }}>Nexus</Heading>
        <View style={styles.topIcons}>
          <Feather 
            name="plus-square" 
            size={24} 
            color="#1f2937" 
            style={{ marginRight: 20 }} 
            onPress={() => navigation.navigate('CreatePost')}
          />
          <Feather name="bell" size={24} color="#1f2937" />
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}

      {!loading && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id} 
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#6366f1']} 
              tintColor="#6366f1" 
            />
          }
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <PostCard 
              id={item._id}
              username={item.user?.username || 'Unknown User'} 
              avatarUrl={item.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}              
              imageUrl={item.imageUrl || ''}              
              likes={item.likes?.length || 0}              
              isLiked={user ? item.likes?.includes(user._id) : false}
              caption={item.caption}
              timeAgo={formatRelativeTime(item.createdAt)}
            />
          )}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#ffffff' }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  topBar: {
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 13,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topIcons: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // Keeps white sheet look while loading
    paddingTop: 50,
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  }
});

export default FeedScreen;