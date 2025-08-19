import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'

export default function Layout() {
  return (
    <SafeAreaView>
      <Text>Auth</Text>
      <Slot />
    </SafeAreaView>
  )
}