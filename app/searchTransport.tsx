import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// const BACKEND_URL = "http://10.235.82.52:5000/api/transports";
const BACKEND_URL = "https://goodsnotifier-production.up.railway.app/api/transports";

export default function SearchTransport() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [transports, setTransports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch transports by company name
  const fetchTransports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/search?name=${search}`);
      const data = await res.json();
      setTransports(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch transports.");
    } finally {
      setLoading(false);
    }
  };

  // Delete transport with confirmation
  const deleteTransport = (id: string) => {
  Alert.alert(
    "Delete Transport",
    "Are you sure you want to delete this transport?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });

            if (res.ok) {
              // Remove the deleted transport from local state so list updates immediately
              setTransports(prev => prev.filter(item => item._id !== id));
              Alert.alert("Success", "Transport deleted successfully.");
            } else {
              const errorData = await res.json();
              Alert.alert("Error", errorData.message || "Failed to delete transport.");
            }
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to delete transport.");
          }
        },
      },
    ]
  );
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Search Transport</Text>
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Enter company name"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={fetchTransports}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#1976d2" />}

      {/* No results */}
      {!loading && transports.length === 0 && (
        <Text style={styles.noResults}>No transports found.</Text>
      )}

      {/* Results List */}
      <FlatList
        data={transports}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}><Text style={styles.label}>Company:</Text> {item.companyName}</Text>
            <Text style={styles.text}><Text style={styles.label}>Contact:</Text> {item.contactNumber}</Text>
            <Text style={styles.text}><Text style={styles.label}>Driver:</Text> {item.driverName}</Text>
            <Text style={styles.text}><Text style={styles.label}>Vehicle:</Text> {item.vehicleNumber}</Text>

            <View style={styles.actionRow}>
              {/* Edit button (optional) */}
              {/* <TouchableOpacity
                onPress={() => router.push({ pathname: "/editTransport", params: { id: item._id } })}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="create" size={20} color="#1976d2" />
              </TouchableOpacity> */}

              {/* Delete button */}
              <TouchableOpacity onPress={() => deleteTransport(item._id)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  header: {
    backgroundColor: "#1976d2",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#1976d2",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 3,
  },
  label: {
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 6,
  },
});
