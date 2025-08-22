import { offers } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import cn from "clsx";
import React from "react";
import { Button, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";
import CartButton from "@/components/CartButton";
import * as Sentry from '@sentry/react-native'
import { useAuthStore } from "@/store/auth.store";
export default function Index() {
  const insets = useSafeAreaInsets();

  const {user} = useAuthStore();
  
  
  return (
    <View className=" flex-1 bg-white">
      <FlatList
        data={offers}
        ListHeaderComponent={() => (
          <View className="flex-between flex-row my-5 px-5">
            <View className="flex-start">
              <Text className="small-bold text-primary-500">Deliver To</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="paragraph-bold text-primary-500">
                  New York
                </Text>
                <Ionicons name="chevron-down" size={20} color="#FF6C00" />
              </TouchableOpacity>
            </View>
            <CartButton />
          </View>
        )}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <TouchableOpacity
              className={cn(
                "offer-card",
                isEven ? "flex-row-reverse" : "flex-row"
              )}
              key={index}
              style={{
                backgroundColor: item.color,
                marginHorizontal: insets.left,
              }}
            >
              <Image
                source={item.image}
                className="w-full h-full"
                resizeMode="contain"
                style={{ marginHorizontal: insets.left - 80 }}
              />
              <View className={"offer-card-info"}>
                <Text className="h1-bold text-white" style={{ maxWidth: 130 }}>
                  {item.title}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color="white"
                  style={{ marginTop: 5 }}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerClassName="pb-4. px-5"
        contentContainerStyle={{ paddingTop: insets.top}}
        ListFooterComponent={
          <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
        }
      />
    </View>
  );
}
