import React, { useState } from "react";
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

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const BACKEND_URL = "http://10.34.28.52:5000/api/details";
  // const BACKEND_URL = "https://goodsnotifier-production.up.railway.app/api/details";

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a receiver name to search");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Fetch all details from backend
      const response = await fetch(BACKEND_URL);
      const data = await response.json();

      // Filter by receiverName (case-insensitive)
      const filtered = data.filter((item: any) =>
        item.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filtered);
      
      if (filtered.length === 0) {
        Alert.alert("No Results", `No entries found for "${searchQuery}"`);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch data from server");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const formatPhoneNumber = (number: string) => {
    // Simple phone number formatting
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0,5)} ${cleaned.slice(5)}`;
    }
    return number;
  };

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
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Search Entries</Text>
          <Text style={styles.subtitle}>Find dispatch records by receiver name</Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#1976d2" style={styles.searchIcon} />
            <TextInput
              placeholder="Enter receiver name..."
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              placeholderTextColor="#90a4ae"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#90a4ae" />
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
                {loading ? "Searching..." : "Search"}
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
          {hasSearched && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Text>
            </View>
          )}
        </View>

        {/* Results Section */}
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1976d2" />
              <Text style={styles.loadingText}>Searching records...</Text>
            </View>
          ) : results.length > 0 ? (
            <>
              <Text style={styles.resultsTitle}>Search Results</Text>
              <FlatList
                data={results}
                scrollEnabled={false}
                keyExtractor={(item, index) => `${item.receiverName}-${index}`}
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
                        <View style={styles.infoItem}>
                          <Ionicons name="cube" size={16} color="#1976d2" />
                          <Text style={styles.infoLabel}>Goods:</Text>
                          <Text style={styles.infoValue}>{item.goodsName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Ionicons name="stats-chart" size={16} color="#1976d2" />
                          <Text style={styles.infoLabel}>Qty:</Text>
                          <Text style={styles.infoValue}>{item.quantity}</Text>
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
          ) : hasSearched && !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-circle" size={80} color="#90caf9" />
              <Text style={styles.emptyStateTitle}>No Results Found</Text>
              <Text style={styles.emptyStateText}>
                No entries found for "{searchQuery}"
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Try searching with a different name or check the spelling
              </Text>
            </View>
          ) : (
            <View style={styles.initialState}>
              <Ionicons name="search" size={80} color="#e3f2fd" />
              <Text style={styles.initialStateTitle}>Search Dispatch Records</Text>
              <Text style={styles.initialStateText}>
                Enter a receiver's name in the search bar above to find specific dispatch entries
              </Text>
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
    backgroundColor: "#f0f8ff" 
  },
  header: {
    backgroundColor: "#1976d2",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  clientButton: {
  backgroundColor: "#7b1fa2", // purple
},

transportButton: {
  backgroundColor: "#00838f", // teal
},

  subtitle: {
    fontSize: 14,
    color: "#e3f2fd",
    textAlign: "center",
  },
  searchContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e3f2fd",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#1565c0",
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
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButton: {
    backgroundColor: "#1976d2",
  },
  backButtonStyle: {
    backgroundColor: "#42a5f5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  statsContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  statsText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "600",
    textAlign: "center",
  },
  resultsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#1976d2",
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
    fontWeight: "bold",
    color: "#1976d2",
    marginLeft: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dispatchedBadge: {
    backgroundColor: "#fff3e0",
  },
  deliveredBadge: {
    backgroundColor: "#e8f5e8",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1976d2",
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
    fontWeight: "600",
    color: "#1976d2",
    marginLeft: 4,
    marginRight: 2,
  },
  infoValue: {
    fontSize: 12,
    color: "#424242",
    flex: 1,
  },
  transportContact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  transportText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 1,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#424242",
    textAlign: "center",
    marginTop: 8,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
    marginTop: 4,
  },
  initialState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 1,
  },
  initialStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
    marginTop: 12,
  },
  initialStateText: {
    fontSize: 14,
    color: "#424242",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});