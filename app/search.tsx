import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = `${API_BASE}/api/details`;

  const fetchAllEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      setAllEntries(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEntries();
  }, []);

  const handleSearch = () => {
    // Refresh records from server
    fetchAllEntries();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const formatPhoneNumber = (number: string) => {
    // Simple phone number formatting
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0,5)} ${cleaned.slice(5)}`;
    }
    return number;
  };

  // Filter locally as user types
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return allEntries;
    const query = searchQuery.toLowerCase().trim();
    return allEntries.filter((item) => {
      const receiverMatch = item.receiverName?.toLowerCase().includes(query);
      const transportMatch = item.transportName?.toLowerCase().includes(query);
      const goodsMatch = item.goods && Array.isArray(item.goods)
        ? item.goods.some((g: any) => g.goodsName?.toLowerCase().includes(query))
        : item.goodsName?.toLowerCase().includes(query);
      return receiverMatch || transportMatch || goodsMatch;
    });
  }, [searchQuery, allEntries]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/dashboard")}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#1e3a8a" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.logoBadge}>
              <Ionicons name="search" size={18} color="#1e3a8a" />
            </View>
            <View>
              <Text style={styles.title}>Search Entries</Text>
              <Text style={styles.subtitle}>Find dispatch records</Text>
            </View>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={18} color="#2563eb" style={styles.searchIcon} />
            <FocusableInput
              placeholder="Enter receiver name..."
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              placeholderTextColor="#94a3b8"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.searchButton]} 
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="search" size={20} color="#fff" />
              )}
              <Text style={styles.buttonText}>
                {loading ? "Refreshing..." : "Search"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.clientButton]}
              onPress={() => router.push("/searchClient")}
            >
              <Ionicons name="people" size={20} color="#fff" />
              <Text style={styles.buttonText}>Search Client</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.transportButton]}
              onPress={() => router.push("/searchTransport")}
            >
              <Ionicons name="bus" size={20} color="#fff" />
              <Text style={styles.buttonText}>Search Transport</Text>
            </TouchableOpacity>
          </View>

          {/* Search Stats */}
          {searchQuery.trim().length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                Found {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Text>
            </View>
          )}
        </View>

        {/* Results Section */}
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1976d2" />
              <Text style={styles.loadingText}>Loading records...</Text>
            </View>
          ) : filteredEntries.length > 0 ? (
            <>
              <Text style={styles.resultsTitle}>
                {searchQuery.trim() ? "Search Results" : "All Dispatch Records"}
              </Text>
              <FlatList
                data={filteredEntries}
                scrollEnabled={false}
                keyExtractor={(item, index) => item._id || `${item.receiverName}-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleContainer}>
                        <Ionicons name="business" size={20} color="#1976d2" />
                        <Text style={styles.cardTitle}>Amrut Automobiles</Text>
                      </View>
                      <View style={[styles.badge, 
                        item.status === 'delivered' ? styles.deliveredBadge : styles.dispatchedBadge
                      ]}>
                        <Text style={styles.badgeText}>
                          {item.status === 'delivered' ? 'Delivered' : 'Dispatched'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardContent}>
                      <View style={styles.infoRow}>
                        <View style={[styles.infoItem, { flex: 1 }]}>
                          <Ionicons name="cube" size={16} color="#1976d2" />
                          <Text style={styles.infoLabel}>Goods:</Text>
                          <Text style={styles.infoValue}>
                            {item.goods && Array.isArray(item.goods) && item.goods.length > 0
                              ? item.goods.map((g: any) => `${g.goodsName} (${g.quantity})`).join(", ")
                              : item.goodsName ? `${item.goodsName} (${item.quantity || "N/A"})` : "N/A"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                          <Ionicons name="person" size={16} color="#1976d2" />
                          <Text style={styles.infoLabel}>Receiver:</Text>
                          <Text style={styles.infoValue}>{item.receiverName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Ionicons name="call" size={16} color="#1976d2" />
                          <Text style={styles.infoLabel}>Phone:</Text>
                          <Text style={styles.infoValue}>
                            {formatPhoneNumber(item.receiverNumber)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                          <Ionicons name="bus" size={16} color="#1976d2" />
                          <Text style={styles.infoLabel}>Transport:</Text>
                          <Text style={styles.infoValue}>{item.transportName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Ionicons name="calendar" size={16} color="#1976d2" />
                          <Text style={styles.infoLabel}>Date:</Text>
                          <Text style={styles.infoValue}>{item.date}</Text>
                        </View>
                      </View>

                      {item.transportNumber && (
                        <View style={styles.transportContact}>
                          <Ionicons name="car" size={14} color="#1976d2" />
                          <Text style={styles.transportText}>
                            Driver Contact: {formatPhoneNumber(item.transportNumber)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-circle" size={80} color="#90caf9" />
              <Text style={styles.emptyStateTitle}>
                {searchQuery.trim() ? "No Results Found" : "No Records Found"}
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery.trim() 
                  ? `No entries found for "${searchQuery}"`
                  : "There are no dispatch records in the database yet."}
              </Text>
              {searchQuery.trim() && (
                <Text style={styles.emptyStateSubtext}>
                  Try searching with a different name or check the spelling
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Search;

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
    marginBottom: 16,
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
  clientButton: {
    backgroundColor: "#2563eb",
    shadowColor: "#2563eb",
  },
  transportButton: {
    backgroundColor: "#1e3a8a",
    shadowColor: "#1e3a8a",
  },
  searchContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1e293b",
    ...(Platform.OS === "android" && { outlineWidth: 0 } as any),
  },
  inputFocused: {
    borderColor: "#2563eb",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 14,
    flex: 1,
    marginHorizontal: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButton: {
    backgroundColor: "#2563eb", // blue-600
    shadowColor: "#2563eb",
  },
  backButtonStyle: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
  statsContainer: {
    backgroundColor: "#eff6ff", // blue-50
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  statsText: {
    fontSize: 14,
    color: "#2563eb", // blue-600
    fontWeight: "600",
    textAlign: "center",
  },
  resultsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb", // blue-600
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e3a8a",
    marginLeft: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dispatchedBadge: {
    backgroundColor: "#fef3c7", // amber-100
  },
  deliveredBadge: {
    backgroundColor: "#d1fae5", // emerald-100
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#b45309", // amber-700
  },
  cardContent: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginLeft: 4,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 12,
    color: "#1e293b",
    flex: 1,
  },
  transportContact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  transportText: {
    fontSize: 12,
    color: "#475569",
    marginLeft: 6,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginTop: 8,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 4,
  },
  initialState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  initialStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginTop: 12,
  },
  initialStateText: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
