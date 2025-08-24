import { Category } from '@/type'
import cn from 'clsx'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'

export default function Filter({categories} : {categories: Category[]}) {
    const searchParams = useLocalSearchParams();
    const [active, setActive] = React.useState(searchParams.category || '');

    const handlePress = (id: string) => {
        setActive(id);
        if (id === 'all') {
            router.setParams({category: undefined});
        } else {
            router.setParams({category:id})
        }
    }
    const filterData: (Category | { $id: string; name: string })[] =
      categories && categories.length > 0
        ? [{ $id: 'all', name: 'All' }, ...categories]
        : [{ $id: 'all', name: 'All' }];
    return (
        <FlatList
        data = {filterData}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
            <TouchableOpacity
             key = {item.$id}
             className = {cn(
               'px-4 py-2 rounded-full border',
               active === item.$id 
                 ? 'bg-black border-black' 
                 : 'bg-white border-gray-300'
             )}
             onPress = {() => handlePress(item.$id)}
             >
                
                <Text className={cn(
                  'font-medium',
                  active === item.$id ? 'text-white' : 'text-black'
                )}>
                  {item.name}
                </Text>
            </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator = {false}
        horizontal
        contentContainerClassName='gap-x-2 pb-3'
        />
  )
}