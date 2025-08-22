import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as Sentry from '@sentry/react-native';
import { useAuthStore } from "@/store/auth.store";

Sentry.init({
  dsn: 'https://f4f3d08a15df009fa96f1f5354523f7c@o4509885568057344.ingest.us.sentry.io/4509885599121408',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
 
  const { isLoading, fetchAuthenticatedUser} = useAuthStore();
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

  useEffect(() => {
    fetchAuthenticatedUser()
  }, [])

  if ( !fontsLoaded || isLoading) return null;
  return <Stack screenOptions={{headerShown: false, animation: "ios_from_right"}}/>;
});