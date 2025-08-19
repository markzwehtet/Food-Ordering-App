import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default function CartButton() {
  const totalItems = 10;

  return (
    <TouchableOpacity
      className="cart-btn"
      onPress={() => console.log("Cart Pressed")}
    >
        <Ionicons name="bag" size={24} color="white" />
      {totalItems > 0 && (
        <View className="cart-badge">
          <Text className="text-white">
            {totalItems}
            </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
