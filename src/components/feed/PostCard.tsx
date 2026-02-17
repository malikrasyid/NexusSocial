import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons'; 
import { Divider } from '../shared/Divider';
import { Label, Body, Caption } from '../ui/Typography';
import { toggleLike } from '../../api/post'; 

const { width } = Dimensions.get('window');

interface PostProps {
  id: string;
  username: string;
  avatarUrl: string;
  imageUrl: string;
  likes: number;
  isLiked: boolean;
  caption: string;
  timeAgo: string;
}

export const PostCard = ({ 
    id, 
    username, 
    avatarUrl, 
    imageUrl, 
    likes: initialLikes, 
    isLiked: initialIsLiked, 
    caption, 
    timeAgo 
}: PostProps) => {
    
  const [liked, setLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      await toggleLike(id);
    } catch (error) {
      setLiked(!newLikedState);
      setLikeCount(prev => newLikedState ? prev - 1 : prev + 1);
      console.error('Failed to like post', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header: Clean & Spaced */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Label style={styles.usernameText}>{username}</Label>
        </View>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="more-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 2. Image: Full Width Square */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.postImage} resizeMode="cover" />
        ) : null}
      </View>

      {/* 3. Action Bar */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.iconBtn}>
            {liked ? (
              <AntDesign name="heart" size={26} color="#ef4444" />
            ) : (
              <Feather name="heart" size={26} color="#000" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="message-circle" size={26} color="#000" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="send" size={26} color="#000" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="bookmark" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 4. Footer: Data & Text */}
      <View style={styles.footer}>
        {/* Likes */}
        <Label style={styles.likesText}>
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </Label>

        {/* Caption (Username + Text) */}
        <View style={styles.captionContainer}>
          <Body>
            <Label>{username}</Label> {caption}
          </Body>
        </View>

        {/* Timestamp - The "Fresher Polish" */}
        <Caption style={styles.timestamp}>
          {timeAgo}
        </Caption>
      </View>
      
      {/* Subtle Divider */}
      <View style={{ marginTop: 15 }}>
        <Divider space={0} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 5,},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 0.5,     // Subtle border for avatar
    borderColor: '#e5e7eb',
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '600', // Slightly softer bold
  },
  imageContainer: {
    width: width,
    height: width, // 1:1 Aspect Ratio
    backgroundColor: '#f9fafb',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Fixes vertical alignment
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 18, // Increased gap slightly for "breathing room"
  },
  iconBtn: {
    // No padding here to keep alignment strict, handled by gap/flex
  },
  footer: {
    paddingHorizontal: 15,
  },
  likesText: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '700',
  },
  captionContainer: {
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,     // Smaller
    color: '#9ca3af', // Light Grey (Cool tone)
    marginTop: 4,
    marginBottom: 10,
    letterSpacing: 0.2, // Tiny bit of spacing for readability
  },
});