import React, { useState, useEffect } from "react";

import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, FlatList, Text, StyleSheet } from "react-native";

import { RootState } from "../redux/store";

import PostItem from "../../components/PostItem";
import { supabase } from "../utils/supabaseClient";
import { logout } from "../redux/slices/authSlice";

interface Post {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  email: string;
}

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, created_at, user_id");

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        const postsWithEmails = await Promise.all(
          data.map(async (post) => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("email")
              .eq("id", post.user_id)
              .single();

            if (userError) {
              console.error("Error fetching user email:", userError);
            }

            return {
              ...post,
              email: userData?.email || "Unknown", // Default to "Unknown" if no email is found
            };
          })
        );
        setPosts(postsWithEmails);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    const { data, error } = await supabase
      .from("posts")
      .insert([{ content, user_id: user?.user?.id || "" }]);

    if (error) {
      console.error("Error posting message:", error.message);
    } else {
      setContent("");
      fetchPosts();
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Write a post..."
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <Button title="Post" onPress={handlePost} />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostItem
            content={item?.content}
            createdAt={item.created_at}
            email={item.email}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} />
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
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  error: {
    color: "red",
    marginTop: 8,
  },
});
