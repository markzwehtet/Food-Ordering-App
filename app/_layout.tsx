import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),

  });

  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
    }
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);  
  return <Stack screenOptions={{headerShown: false, animation: "ios_from_right"}}/>;
}
