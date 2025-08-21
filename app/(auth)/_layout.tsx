import { images } from "@/constants";
import { Slot } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
export default function Layout() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-white-100 h-full"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full relative"
          style={{ height: Dimensions.get("window").height / 2.25 }}
        >
          <ImageBackground
            source={images.loginGraphic}
            className="rounded-b-3xl h-full w-full"
            resizeMode="stretch"
          >
            <Image
              source={images.logo}
              className="self-center size-20 absolute -bottom-10 z-10"
            />
          </ImageBackground>
        </View>
        {/*  SIGN IN/ SIGN UP SCREEN */}
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
