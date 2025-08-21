import { CustomButtonProps } from "@/type";
import cn from "clsx";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View, Text } from "react-native";
export default function CustomButton({
  onPress,
  title = "Custom",
  style,
  textStyle,
  leftIcon,
  isLoading = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity className={cn("custom-btn", style)} onPress={onPress}>
      {leftIcon}

      <View className="flex-center flex-row">
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className={cn("text-white-100 paragraph-semibold", textStyle)}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
