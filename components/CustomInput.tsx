import { CustomInputProps } from "@/type";
import React from "react";
import { Text, TextInput, View } from "react-native";
import cn from "clsx";
export default function CustomInput({
  placeholder = "Enter text",
  value,
  label,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
}: CustomInputProps) {

    const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View>
      <Text className="label">{label}</Text>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={'#888'}
        className = {cn ('input', isFocused ? 'border-blue-500' : 'border-gray-300')}
      />
    </View>
  );
}
