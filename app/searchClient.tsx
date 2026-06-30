import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_BASE } from "../constants/config";

const BACKEND_URL = `${API_BASE}/api/clients`;

export default function SearchClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [allClients, setAllClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load ALL clients on mount
  useEffect(() => {
    fetchAllClients();
  }, []);

  const fetchAllClients = async () => {
    try {
      setLoading(true);
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      setAllClients(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  // Filter locally as user types
  const filteredClients = useMemo(() => {
    if (!search.trim()) return allClients;
    const q = search.toLowerCase();
    return allClients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.contactNumber?.includes(q) ||
        c.address?.toLowerCase().includes(q)
    );
  }, [search, allClients]);

  // Delete client
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
                setAllClients((prev) => prev.filter((c) => c._id !== id));
              } else {
                const err = await res.json();
                Alert.alert("Error", err.message || "Failed to delete client.");
              }
            } catch {
              Alert.alert("Error", "Failed to delete client.");
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
          onPress={() => router.push("/search")}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1e3a8a" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.logoBadge}>
            <Ionicons name="person" size={20} color="#1e3a8a" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Clients</Text>
            <Text style={styles.headerSubtitle}>
              {!loading ? `${allClients.length} registered` : "Loading..."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={fetchAllClients}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color="#1e3a8a" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#2563eb" />
          <TextInput
            placeholder="Search by name, phone or address…"
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
        {search.trim() !== "" && (
          <Text style={styles.filterInfo}>
            {filteredClients.length} of {allClients.length} clients
          </Text>
        )}
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading clients…</Text>
        </View>
      ) : filteredClients.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={search ? "search-outline" : "people-outline"}
            size={56}
            color="#cbd5e1"
          />
          <Text style={styles.emptyText}>
            {search ? `No results for "${search}"` : "No clients yet"}
          </Text>
          <Text style={styles.emptySubtext}>
            {search
              ? "Try a different search term"
              : "Add clients via Dashboard → Settings → Add Client"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={13} color="#64748b" />
                    <Text style={styles.infoText}>{item.contactNumber}</Text>
                  </View>
                  {item.address ? (
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={13} color="#64748b" />
                      <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => deleteClient(item._id)}
                activeOpacity={0.6}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  // ── Header ──────────────────────────────────────
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 1,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Search ──────────────────────────────────────
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    paddingVertical: 13,
    ...(Platform.OS === "android" && { outlineWidth: 0 } as any),
  },
  filterInfo: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 8,
    marginLeft: 4,
  },

  // ── States ──────────────────────────────────────
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
    textAlign: "center",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
  },

  // ── List ────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563eb",
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoText: {
    fontSize: 13,
    color: "#64748b",
    flex: 1,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
