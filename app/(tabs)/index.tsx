import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Welcome() {
  const router = useRouter();

  // Animations
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslate = useRef(new Animated.Value(20)).current;
  const dividerScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textTranslate, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(dividerScale, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(buttonTranslate, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4ff" />

      {/* Logo Area */}
      <Animated.View style={[styles.logoArea, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        {/* Icon badge */}
        <View style={styles.iconBadge}>
          <Ionicons name="cube" size={36} color="#1e3a8a" />
          <View style={styles.truckBadge}>
            <Ionicons name="bus" size={18} color="#fff" />
          </View>
        </View>

        {/* Brand Name */}
        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslate }] }}>
          <Text style={styles.brandPrimary}>AMRUT</Text>
          <Text style={styles.brandSecondary}>AUTOMOBILES</Text>
        </Animated.View>

        {/* Divider */}
        <Animated.View style={[styles.divider, { transform: [{ scaleX: dividerScale }] }]} />

        {/* Tagline */}
        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslate }] }}>
          <Text style={styles.appName}>Dispatch Tracker</Text>
          <Text style={styles.tagline}>
            Track dispatches, manage shipments,{"\n"}and stay connected with your clients.
          </Text>
        </Animated.View>
      </Animated.View>

      {/* CTA Section */}
      <Animated.View style={[styles.ctaArea, { opacity: buttonOpacity, transform: [{ translateY: buttonTranslate }] }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push("../dashboard")}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <Text style={styles.footerNote}>Amrut Automobiles · Solapur</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 100 : 80,
    paddingBottom: 60,
    paddingHorizontal: 32,
  },
  logoArea: {
    alignItems: "center",
    gap: 8,
  },
  iconBadge: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  truckBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f0f4ff",
  },
  brandPrimary: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1e3a8a",
    letterSpacing: 6,
    textAlign: "center",
  },
  brandSecondary: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3b5fc0",
    letterSpacing: 5,
    textAlign: "center",
    marginTop: -4,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: "#2563eb",
    borderRadius: 2,
    marginVertical: 16,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
  ctaArea: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#1e3a8a",
    width: "100%",
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  footerNote: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
