import React, { useState } from "react";

import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { TextInput, Button, StyleSheet, Text } from "react-native";

import { supabase } from "../utils/supabaseClient";
import { setUser } from "../redux/slices/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      setError(error.message);
    } else if (data?.user) {
      dispatch(setUser({ user: data.user, token: data.session?.access_token }));
      router.push("/feed");
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
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Create Account" onPress={() => router.push("/signup")} />
      {error && <Text style={styles.error}>{error}</Text>}
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
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  error: {
    color: "red",
    marginTop: 8,
  },
});
