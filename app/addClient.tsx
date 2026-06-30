import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE } from "../constants/config";

const FocusableInput = (props: any) => {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      {...props}
      style={[props.style, focused && styles.inputFocused]}
      onFocus={() => { setFocused(true); props.onFocus?.(); }}
      onBlur={() => { setFocused(false); props.onBlur?.(); }}
    />
  );
};

const AddClient = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = `${API_BASE}/api/clients`;

  const handleAddClient = async () => {
    const trimmedName = name.trim();
    const trimmedNumber = contactNumber.trim();

    if (!trimmedName || !/^[A-Za-z ]+$/.test(trimmedName)) {
      Alert.alert("Validation Error", "Client name must contain alphabets only");
      return;
    }

    if (!/^\d{10}$/.test(trimmedNumber)) {
      Alert.alert("Validation Error", "Contact number must be exactly 10 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          contactNumber: "+91" + trimmedNumber,
          address: address.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Client added successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
        setName("");
        setContactNumber("");
        setAddress("");
      } else {
        Alert.alert("Error", result.message || "Failed to add client");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#1e3a8a" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.logoBadge}>
              <Ionicons name="person" size={20} color="#1e3a8a" />
            </View>
            <View>
              <Text style={styles.title}>Add Client</Text>
              <Text style={styles.subtitle}>Register a new receiver</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <View style={styles.iconBadge}>
              <Ionicons name="person" size={22} color="#2563eb" />
            </View>
            <Text style={styles.sectionTitle}>Client Information</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Client Name <Text style={styles.required}>*</Text></Text>
            <FocusableInput
              placeholder="Enter full name"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={name}
              onChangeText={(text: string) => setName(text.replace(/[^A-Za-z ]/g, ""))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number <Text style={styles.required}>*</Text></Text>
            <View style={styles.phoneRow}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>+91</Text>
              </View>
              <FocusableInput
                placeholder="10-digit number"
                placeholderTextColor="#94a3b8"
                style={[styles.input, styles.phoneInput]}
                value={contactNumber}
                onChangeText={(text: string) => setContactNumber(text.replace(/[^0-9]/g, "").slice(0, 10))}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address <Text style={styles.optional}>(optional)</Text></Text>
            <FocusableInput
              placeholder="Enter client address"
              placeholderTextColor="#94a3b8"
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.addButton, loading && styles.disabledButton]}
            onPress={handleAddClient}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="person-add" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add Client</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={15} color="#64748b" />
            <Text style={styles.infoText}>Fields marked with * are required</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddClient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logoBadge: {
    width: 42,
    height: 42,
    backgroundColor: "#eff6ff",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 1,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  required: {
    color: "#ef4444",
  },
  optional: {
    color: "#94a3b8",
    fontWeight: "400",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
  },
  phonePrefix: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  phonePrefixText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  phoneInput: {
    flex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#1e293b",
    ...(Platform.OS === "android" && { outlineWidth: 0 } as any),
  },
  inputFocused: {
    borderColor: "#2563eb",
    borderWidth: 1.5,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 0,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 13,
  },
  addButton: {
    backgroundColor: "#1e3a8a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#93c5fd",
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
