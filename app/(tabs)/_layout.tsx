import { useAuthStore } from '@/store/auth.store';
import { TabBarIconProps } from '@/type';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const TabBarIcon = ({ focused, icon, title}: TabBarIconProps) => {
    return (
        <View className="tab-icon">
            <Ionicons
                name={icon}
                size={24}
                color={focused ? '#FF6B35' : 'grey'} // Use actual colors
                />
            <Text className={`text-sm font-bold ${focused ? 'text-primary' : 'grey'}`}>{title}</Text>
        </View>
    );
}
export default function TabLayout() {



    const { isAuthenticated } = useAuthStore();

    if(!isAuthenticated) {
        return (
            <Redirect href="/(auth)/sign-in" />
        );
    }
  return (
    <Tabs
    screenOptions={{
        headerShown: false, 
        tabBarShowLabel: false,
        tabBarStyle: {
        borderTopLeftRadius: 50, 
        borderTopRightRadius: 50, 
        borderBottomLeftRadius: 50, 
        borderBottomRightRadius: 50,
        marginHorizontal: 20,
         height: 80, 
         position:'absolute',
        bottom: 40,
         backgroundColor: 'white', 
         shadowColor: 'black',
         shadowOffset: { width: 0, height: 6 }, 
         shadowOpacity: 0.1,
         shadowRadius: 4,
         elevation: 5 
    }
}}
    >

        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon
                        focused={focused}
                        icon="home-outline"
                        title="Home"
                    />
                ),
            }}
        />
         <Tabs.Screen
            name="search"
            options={{
                title: 'Search',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon
                        focused={focused}
                        icon="search-outline"
                        title="Search"
                    />
                ),
            }}
        />
         <Tabs.Screen
            name="cart"
            options={{
                title: 'Cart',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon
                        focused={focused}
                        icon="cart-outline"
                        title="Cart"
                    />
                ),
            }}
        />
         <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon
                        focused={focused}
                        icon="person-outline"
                        title="Profile"
                    />
                ),
            }}
        />
   
    </Tabs>
  )
}