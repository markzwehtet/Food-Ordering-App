import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Link, router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from '@sentry/react-native'
export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", password: "" });
  const submit = async () => {
    if (!form.email || !form.password) {
      return alert("Please fill in all fields");
    }
    setIsSubmitting(true);
    try {
      // Call appwrite sign-in function here
      // await signIn(form.email, form.password);
      console.log("Signing in with:", form);
      // Reset form after successful sign-in
      setForm({ email: "", password: "" });
      router.push("/");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      alert("Failed to sign in. Please try again.");
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white rounded-lg p-4">
      <View className="flex-1 justify-center gap-6">
        <CustomInput
          placeholder="Enter your email"
          value={form.email}
          onChangeText={(text: string) =>
            setForm((prev) => ({ ...prev, email: text }))
          }
          label="Email"
          keyboardType="email-address"
        />
        <CustomInput
          placeholder="Enter your password"
          value={form.password}
          onChangeText={(text: string) =>
            setForm((prev) => ({ ...prev, password: text }))
          }
          label="Password"
          secureTextEntry={true}
        />
        <CustomButton
          title="Sign In"
          isLoading={isSubmitting}
          onPress={submit}
        />
      </View>
      <View className="flex justify-center flex-row gap-2 mb-4 mt-10">
        <Text className="base-regular text-grey-500 text-center">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary base-bold">
            Sign Up
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
