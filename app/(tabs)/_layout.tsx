import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'

export default function Layout() {

    const isAuthenticated = false; // Replace with actual authentication logic

    if(!isAuthenticated) {
        return (
            <Redirect href="/(auth)/sign-in" />
        );
    }
  return (
   <Slot />
  )
}