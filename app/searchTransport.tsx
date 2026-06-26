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

const BACKEND_URL = `${API_BASE}/api/transports`;

export default function SearchTransport() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [allTransports, setAllTransports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load ALL transports on mount
  useEffect(() => {
    fetchAllTransports();
  }, []);

  const fetchAllTransports = async () => {
    try {
      setLoading(true);
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      setAllTransports(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load transports.");
    } finally {
      setLoading(false);
    }
  };

  // Filter locally as user types
  const filteredTransports = useMemo(() => {
    if (!search.trim()) return allTransports;
    const q = search.toLowerCase();
    return allTransports.filter(
      (t) =>
        t.companyName?.toLowerCase().includes(q) ||
        t.contactNumber?.includes(q) ||
        t.driverName?.toLowerCase().includes(q) ||
        t.vehicleNumber?.toLowerCase().includes(q)
    );
  }, [search, allTransports]);

  // Delete transport
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
                setAllTransports((prev) => prev.filter((t) => t._id !== id));
              } else {
                const err = await res.json();
                Alert.alert("Error", err.message || "Failed to delete transport.");
              }
            } catch {
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
          onPress={() => router.push("/search")}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1e3a8a" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.logoBadge}>
            <Ionicons name="bus" size={20} color="#1e3a8a" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Transports</Text>
            <Text style={styles.headerSubtitle}>
              {!loading ? `${allTransports.length} registered` : "Loading..."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={fetchAllTransports}
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
            placeholder="Search by name, phone or vehicle…"
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
            {filteredTransports.length} of {allTransports.length} transports
          </Text>
        )}
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading transports…</Text>
        </View>
      ) : filteredTransports.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={search ? "search-outline" : "bus-outline"}
            size={56}
            color="#cbd5e1"
          />
          <Text style={styles.emptyText}>
            {search ? `No results for "${search}"` : "No transports yet"}
          </Text>
          <Text style={styles.emptySubtext}>
            {search
              ? "Try a different search term"
              : "Add transports via Dashboard → ⋮ → Add Transport"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransports}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.companyName?.charAt(0)?.toUpperCase() ?? "?"}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{item.companyName}</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={13} color="#64748b" />
                    <Text style={styles.infoText}>{item.contactNumber}</Text>
                  </View>
                  {item.driverName ? (
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={13} color="#64748b" />
                      <Text style={styles.infoText}>{item.driverName}</Text>
                    </View>
                  ) : null}
                  {item.vehicleNumber ? (
                    <View style={styles.infoRow}>
                      <Ionicons name="car-outline" size={13} color="#64748b" />
                      <Text style={styles.infoText}>{item.vehicleNumber}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => deleteTransport(item._id)}
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
    borderLeftColor: "#1e3a8a",
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
    color: "#1e3a8a",
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
