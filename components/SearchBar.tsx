import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchBar() {
  const params = useLocalSearchParams<{query?: string}>();
  const [query, setQuery] = React.useState(params.query);

  const handleSearch = (text: string) => {
    setQuery(text); // Only update local state, don't trigger search
  }

  const handleSubmit = () => {
    if (typeof query === 'string' && query.trim()) {
      router.setParams({ query: query.trim() });
    } else if (!query || !query.trim()) {
      router.setParams({ query: undefined });
    }
  };

  const handleSearchButton = () => {
    handleSubmit();
  };

  return (
    <View className="searchbar">
      <TextInput
        className='flex-1 p-5'
        placeholder = "Search anything you want"
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        returnKeyType='search'
        placeholderTextColor="grey"
      />
      <TouchableOpacity
        className = 'pr-5'
        onPress={handleSearchButton}
      >
        <Ionicons
          name='search-outline'
          color={'black'}
          size={23}
        />
      </TouchableOpacity>
    </View>
  )
}