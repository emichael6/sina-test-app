import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PostItemProps {
  content: string;
  createdAt: string;
  email: string; // Email prop
}

const PostItem = ({ content, createdAt, email }: PostItemProps) => {
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <View style={styles.card}>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.time}>{formattedDate}</Text>
      <Text style={styles.email}>Posted by: {email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
});

export default PostItem;
