import { MenuItem } from '@/type';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';

export default function MenuCard({ item: { image_url, name, price } }: { item: MenuItem }) {
    return (

      <TouchableOpacity
      className='menu-card'
      style = {Platform.OS === 'android' ? {elevation: 10, shadowColor: "#878787"} : {}}
      >
        <Image
          source={{ uri: image_url }}
          style={{ width: 128, height: 128, position: 'absolute', top: -40 }}
          contentFit="contain"
          cachePolicy={'memory-disk'}
        />
        <Text className = "text-center base-bold text-dark-100 mb-2" numberOfLines= {1}>{name}</Text>
        <TouchableOpacity onPress= {() => {}}>
          <Text className = 'paragraph-bold text-primary'>Add to Cart</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }