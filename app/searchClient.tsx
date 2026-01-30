import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BACKEND_URL = "http://10.34.28.52:5000/api/clients";
// const BACKEND_URL = "https://goodsnotifier-production.up.railway.app/api/clients";

export default function SearchClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch clients from backend
  const fetchClients = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${BACKEND_URL}/search?name=${search}`);
    const data = await res.json();
    setClients(data);
  } catch (error) {
    Alert.alert("Error", "Failed to fetch clients.");
  } finally {
    setLoading(false);
  }
};


  // Delete client with confirmation
  // Delete client with confirmation
const deleteClient = (id: string) => {
  Alert.alert(
    "Delete Client",
    "Are you sure you want to delete this client?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
              // Remove the deleted client from local state so list updates immediately
              setClients(prev => prev.filter(client => client._id !== id));
              Alert.alert("Success", "Client deleted successfully.");
            } else {
              const errorData = await res.json();
              Alert.alert("Error", errorData.message || "Failed to delete client.");
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete client.");
          }
        },
      },
    ]
  );
};


  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#1976d2",
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/search")}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={{ color: "#fff", fontSize: 22 }}>Search Client</Text>
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Enter client name"
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />

      {/* Search Button */}
      <TouchableOpacity
        onPress={fetchClients}
        style={{
          backgroundColor: "#1976d2",
          padding: 10,
          alignItems: "center",
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Search</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#1976d2" />}

      {/* No Results */}
      {!loading && clients.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No clients found.
        </Text>
      )}

      {/* Results List */}
      <FlatList
        data={clients}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              marginVertical: 5,
            }}
          >
            <Text>Name: {item.name}</Text>
            <Text>Phone: {item.contactNumber}</Text>
            <Text>Address: {item.address}</Text>

            <View style={{ flexDirection: "row", marginTop: 6 }}>
              {/* Edit button (optional) */}
              {/* <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/editClient",
                    params: { id: item._id },
                  })
                }
                style={{ marginRight: 15 }}
              >
                <Ionicons name="create" size={20} color="#1976d2" />
              </TouchableOpacity> */}

              {/* Delete button */}
              <TouchableOpacity onPress={() => deleteClient(item._id)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
