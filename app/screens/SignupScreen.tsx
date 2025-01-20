import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.log(error);
        setError(error.message); // Set error message to show on UI
      } else if (data?.user) {
        console.log("User signed up successfully:", data.user);

        // Insert user data into the custom 'users' table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
            },
          ]);

        if (userError) {
          console.log("Error inserting user into users table:", userError);
          setError(userError.message); // Show error message
        } else {
          console.log("User added to users table:", userData);
        }

        // Optionally, insert user data into custom tables like 'profiles'
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            username: email, // or set a different username
          });

        if (profileError) {
          console.log("Error creating profile:", profileError);
          setError(profileError.message); // Set profile-related error
        } else {
          console.log("Profile created successfully:", profileData);
        }

        // Navigate to the login screen
        router.push("/login");
      }
    } catch (err) {
      console.log("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button
              title="Already have an account! Log In?"
              onPress={() => router.push("/login")}
            />
      {error && <Text>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12, // Added horizontal padding for space inside input
    borderRadius: 4,
  },
  error: {
    color: "red",
    marginTop: 8,
  },
});
