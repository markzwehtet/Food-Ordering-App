import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });
  const submit = async () => {
    if (!form.email || !form.password || !form.name) {
      return alert("Please fill in all fields");
    }
    setIsSubmitting(true);
    try {
      // Call appwrite sign-in function here
      await createUser({
        name: form.name,
        email: form.email,
        password: form.password
      })
      // Reset form after successful sign-in
      setForm({ name: "", email: "", password: "" });
      router.push("/");
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white rounded-lg p-4">
      <View className="flex-1 justify-center gap-6">
        <CustomInput
          placeholder="Enter your full name"
          value={form.name}
          onChangeText={(text: string) =>
            setForm((prev) => ({ ...prev, name: text }))
          }
          label="Full Name"
        />
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
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={submit}
        />
      </View>
      <View className="flex justify-center flex-row gap-2 mb-4 mt-10">
        <Text className="base-regular text-grey-500 text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary base-bold">
            Sign In
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
