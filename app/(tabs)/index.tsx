import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const backgroundImage = require("../../assets/images/Mobile.png");

export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground
  source={backgroundImage}
  style={styles.background}
  resizeMode="cover" // <-- change this from "cover" to "contain"
>
  <View style={styles.overlay}>
    <Text style={styles.title}>Welcome to Amrut Automobiles</Text>

    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("../dashboard")}
    >
      <Text style={styles.buttonText}>Get Started</Text>
    </TouchableOpacity>
  </View>
</ImageBackground>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 70, // push slightly lower
    backgroundColor: "rgba(0,0,0,0.3)", // optional: semi-transparent overlay
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
