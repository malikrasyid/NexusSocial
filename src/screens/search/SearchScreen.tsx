// src/screens/search/SearchScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeScreenWrapper } from '../../components/shared/SafeScreenWrapper';
import { Heading, SubText, Label } from '../../components/ui/Typography';
import { searchUsers } from '../../api/user';
import { UserProfile, SearchUserResult } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HistoryItem = SearchUserResult & { isTextSearch?: boolean };

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const inputRef = useRef<TextInput>(null);
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchUserResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyString = await AsyncStorage.getItem('@nexus_search_history');
        if (historyString) {
          setRecentSearches(JSON.parse(historyString));
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    };
    loadHistory();
  }, []);

  // Debounced API Call
  useEffect(() => {
    // 1. If input is empty, clear everything immediately
    if (query.trim() === '') {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 2. Wait 500ms after the user STOPS typing
    const delayDebounceFn = setTimeout(async () => {
      try {
        const users = await searchUsers(query);
        setResults(users);
        setHasSearched(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    // 3. Cleanup: If user types again before 500ms, cancel the previous timer
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const saveToHistory = async (item: HistoryItem) => {
    let updatedHistory = [...recentSearches];
    updatedHistory = updatedHistory.filter(historyItem => historyItem._id !== item._id);
    updatedHistory.unshift(item);
    if (updatedHistory.length > 15) updatedHistory.pop(); // Keep max 15

    setRecentSearches(updatedHistory);
    try {
      await AsyncStorage.setItem('@nexus_search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const handleUserClick = async (clickedUser: SearchUserResult) => {
    navigation.navigate('UserProfile', { userId: clickedUser._id });
    saveToHistory({ ...clickedUser, isTextSearch: false });
  };

  // Handle Keyboard "Enter" for Text Searches
  const handleTextSearchSubmit = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Create a fake "HistoryItem" for the text search
    const textSearchItem: HistoryItem = {
      _id: `text_${trimmedQuery.toLowerCase()}`,
      username: trimmedQuery,
      avatar: null,
      bio: null,
      isTextSearch: true,
    };
    
    saveToHistory(textSearchItem);
  };

  const removeHistoryItem = async (itemId: string) => {
    const updatedHistory = recentSearches.filter(item => item._id !== itemId);
    setRecentSearches(updatedHistory);
    try {
      await AsyncStorage.setItem('@nexus_search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to update history:', error);
    }
  };

  const clearHistory = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem('@nexus_search_history');
  };

  const handleCancelSearch = () => {
    Keyboard.dismiss(); 
    inputRef.current?.blur(); 
    setIsFocused(false);
    setQuery(''); 
  };

  // --- RENDER LIST ITEM ---
  const renderItem = ({ item }: { item: HistoryItem }) => {
    const isHistoryView = query.trim() === '';

    return (
      <TouchableOpacity 
        style={styles.userCard}
        activeOpacity={0.7}
        onPress={() => {
          if (item.isTextSearch) {
            setQuery(item.username);
            setIsFocused(true);
            inputRef.current?.focus();
          } else {
            handleUserClick(item);
          }
        }}
      >
        {/* Avatar OR Magnifying Glass for text searches */}
        {item.isTextSearch ? (
          <View style={[styles.avatar, styles.textSearchAvatar]}>
            <Feather name="search" size={20} color="#6b7280" />
          </View>
        ) : (
          <Image 
            source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${item.username}` }} 
            style={styles.avatar} 
          />
        )}

        <View style={styles.userInfo}>
          <Label style={styles.username}>{item.username}</Label>
          {item.bio && !item.isTextSearch ? (
            <SubText style={styles.bio} numberOfLines={1}>{item.bio}</SubText>
          ) : null}
        </View>
        
        {isHistoryView ? (
          <TouchableOpacity 
            style={styles.deleteIconContainer}
            onPress={() => removeHistoryItem(item._id)}
          >
            <Feather name="x" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ) : (
          <Feather name="chevron-right" size={20} color="#d1d5db" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeScreenWrapper style={{ backgroundColor: '#fff' }}>
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        {/* {!isFocused && query === '' && (
          <Heading style={{ fontSize: 24, marginBottom: 15 }}>Search</Heading>
        )} */}
        
        <View style={styles.searchRow}>
          {(isFocused || query.length > 0) && (
            <TouchableOpacity 
              onPress={handleCancelSearch} 
              style={styles.backIcon}
            >
              <Feather name="arrow-left" size={24} color="#1f2937" />
            </TouchableOpacity>
          )}

          {/* --- SEARCH INPUT --- */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search for people..."
              placeholderTextColor="#9ca3af"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="search" 
              onSubmitEditing={handleTextSearchSubmit} 
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Feather name="x-circle" size={18} color="#9ca3af" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* --- CONTENT AREA --- */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <>
          {/* History Header */}
          {query.trim() === '' && recentSearches.length > 0 && (
            <View style={styles.recentHeader}>
              <Label style={styles.recentTitle}>Recent</Label>
              <TouchableOpacity onPress={clearHistory}>
                <SubText style={styles.clearText}>Clear All</SubText>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            keyboardShouldPersistTaps="handled" // Allows clicking results while keyboard is open
            data={query.trim() === '' ? recentSearches : results}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            renderItem={renderItem}
            ListEmptyComponent={() => {
              if (query.trim() !== '' && hasSearched) {
                return (
                  <View style={styles.centerContainer}>
                    <Feather name="search" size={40} color="#e5e7eb" />
                    <SubText style={styles.emptyText}>No results for "{query}"</SubText>
                  </View>
                );
              }
              if (query.trim() === '' && recentSearches.length === 0) {
                 return (
                  <View style={styles.centerContainer}>
                    <SubText style={styles.emptyText}>Find your friends on Nexus</SubText>
                  </View>
                );
              }
              return null;
            }}
          />
        </>
      )}
    </SafeScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // Slightly darker gray looks better for inputs
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    height: '100%',
  },
  clearIcon: {
    marginLeft: 8,
    padding: 4,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  clearText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    marginRight: 12,
  },
  textSearchAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  bio: {
    fontSize: 13,
    color: '#6b7280',
  },
  deleteIconContainer: {
    padding: 8, 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#9ca3af',
  },
});

export default SearchScreen;