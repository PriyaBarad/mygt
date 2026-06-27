import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as SMS from "expo-sms";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE } from "../constants/config";

type RootStackParamList = {
  Dashboard: undefined;
  Search: undefined;
  AddClient: undefined;
  AddTransport: undefined;
};

type DashboardScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

type GoodsItem = {
  goodsName: string;
  quantity: string;
};

type ClientType = { _id: string; name: string; contactNumber: string };
type TransportType = { _id: string; companyName: string; contactNumber: string };

const BACKEND_URL = `${API_BASE}/api`;

// Shared focused-input state component helper
const FocusableInput = (props: any) => {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      {...props}
      style={[
        props.style,
        focused && styles.inputFocused,
      ]}
      onFocus={() => { setFocused(true); props.onFocus?.(); }}
      onBlur={() => { setFocused(false); props.onBlur?.(); }}
    />
  );
};

const Dashboard = () => {
  const router = useRouter();
  const navigation = useNavigation<DashboardScreenProp>();

  const [goodsName, setGoodsName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);

  const [transportName, setTransportName] = useState("");
  const [transportNumber, setTransportNumber] = useState("");
  const [transportSuggestions, setTransportSuggestions] = useState<TransportType[]>([]);
  const [showTransportDropdown, setShowTransportDropdown] = useState(false);

  const [receiverName, setReceiverName] = useState("");
  const [receiverNumber, setReceiverNumber] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState<ClientType[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(getTodayDateString());
  const [data, setData] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // --- Add Goods ---
  const handleAddGoods = () => {
    if (!goodsName.trim() || !quantity.trim()) {
      Alert.alert("Error", "Please enter both goods name and quantity");
      return;
    }
    const newGoods: GoodsItem = { goodsName: goodsName.trim(), quantity: quantity.trim() };
    setGoodsList([...goodsList, newGoods]);
    setGoodsName("");
    setQuantity("");
  };

  const handleRemoveGoods = (index: number) => {
    setGoodsList(goodsList.filter((_, i) => i !== index));
  };

  // --- Autocomplete Client ---
  useEffect(() => {
    if (receiverName.trim() === "") {
      setClientSuggestions([]);
      return;
    }
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/clients`, { params: { search: receiverName } });
        setClientSuggestions(res.data);
      } catch (err) {
        console.log("Client fetch error", err);
      }
    };
    const delayDebounceFn = setTimeout(fetchClients, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [receiverName]);

  const selectClient = (client: ClientType) => {
    setReceiverName(client.name);
    setReceiverNumber(client.contactNumber);
    setShowClientDropdown(false);
  };

  // --- Autocomplete Transport ---
  useEffect(() => {
    if (transportName.trim() === "") {
      setTransportSuggestions([]);
      return;
    }
    const fetchTransports = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/transports`, { params: { search: transportName } });
        setTransportSuggestions(res.data);
      } catch (err) {
        console.log("Transport fetch error", err);
      }
    };
    const delayDebounceFn = setTimeout(fetchTransports, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [transportName]);

  const selectTransport = (transport: TransportType) => {
    setTransportName(transport.companyName);
    setTransportNumber(transport.contactNumber);
    setShowTransportDropdown(false);
  };

  // --- Add & Send SMS ---
  const handleAddAndSendSMS = async () => {
    if (
      goodsList.length === 0 ||
      !transportName ||
      !transportNumber ||
      !receiverName ||
      !receiverNumber ||
      !date
    ) {
      Alert.alert("Error", "Please fill all fields and add at least one good");
      return;
    }

    const newEntry = { goods: goodsList, transportName, transportNumber, receiverName, receiverNumber, date };

    try {
      const response = await axios.post(`${BACKEND_URL}/details`, newEntry);
      const result = response.data;
      setData([...data, result]);

      let goodsMessage = "";
      goodsList.forEach((item, index) => {
        goodsMessage += `📦 ${item.goodsName}: ${item.quantity}`;
        if (index < goodsList.length - 1) goodsMessage += "\n";
      });

      const message = `📌 Amrut Automobiles\n\n${goodsMessage}\n\n🎯 Receiver: ${receiverName}\n📅 Date: ${date}\n🚚 Transport: ${transportName}\n📞 Contact: ${transportNumber}\n\nis Dispatched from Amrut Automobiles Solapur`;

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync([receiverNumber], message);
        Alert.alert("Success", "Data saved and SMS sent successfully!");
      } else {
        Alert.alert("Success", "Data saved successfully! (SMS not available on this device)");
      }

      setGoodsName("");
      setQuantity("");
      setGoodsList([]);
      setTransportName("");
      setTransportNumber("");
      setReceiverName("");
      setReceiverNumber("");
      setDate(getTodayDateString());
      setEditIndex(null);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to save data");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Left: Logo (tap to go Home) + Title */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.logoBadge}
              activeOpacity={0.7}
              onPress={() => router.replace("/")}
            >
              <Ionicons name="cube" size={22} color="#1e3a8a" />
              <View style={styles.logoTruck}>
                <Ionicons name="bus" size={10} color="#fff" />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Goods Dispatch Portal</Text>
              <Text style={styles.subtitle}>Amrut Automobiles · Solapur</Text>
            </View>
          </View>

          {/* Right: 3-dot menu */}
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Ionicons name={showSettings ? "close" : "ellipsis-vertical"} size={20} color="#1e3a8a" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu — floats below header */}
        {showSettings && (
          <View style={styles.settingsDropdown}>
            <TouchableOpacity
              style={styles.settingsOption}
              activeOpacity={0.6}
              onPress={() => { setShowSettings(false); router.push("/mainDashboard"); }}
            >
              <View style={styles.settingsIconWrap}>
                <Ionicons name="stats-chart" size={16} color="#2563eb" />
              </View>
              <Text style={styles.settingsOptionText}>Main Dashboard</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.settingsOption}
              activeOpacity={0.6}
              onPress={() => { setShowSettings(false); router.push("/addClient"); }}
            >
              <View style={styles.settingsIconWrap}>
                <Ionicons name="person-add" size={16} color="#2563eb" />
              </View>
              <Text style={styles.settingsOptionText}>Add Client</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.settingsOption}
              activeOpacity={0.6}
              onPress={() => { setShowSettings(false); router.push("/addTransport"); }}
            >
              <View style={styles.settingsIconWrap}>
                <Ionicons name="bus" size={16} color="#2563eb" />
              </View>
              <Text style={styles.settingsOptionText}>Add Transport</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.settingsOption}
              activeOpacity={0.6}
              onPress={() => { setShowSettings(false); router.push("/search"); }}
            >
              <View style={styles.settingsIconWrap}>
                <Ionicons name="search" size={16} color="#2563eb" />
              </View>
              <Text style={styles.settingsOptionText}>Search Logs</Text>
              <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        )}

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>
            {editIndex !== null ? "Edit Entry" : "Create Dispatch Entry"}
          </Text>

          {/* Goods Section */}
          <View style={styles.goodsCard}>
            <View style={styles.cardSubtitleRow}>
              <Ionicons name="cube-outline" size={15} color="#2563eb" />
              <Text style={styles.cardSubtitle}>GOODS DETAILS</Text>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 2, marginRight: 8 }]}>
                <Text style={styles.label}>Goods Name</Text>
                <FocusableInput
                  placeholder="e.g. Engine Oil"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  value={goodsName}
                  onChangeText={setGoodsName}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Qty</Text>
                <FocusableInput
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.addGoodsButton}
              activeOpacity={0.7}
              onPress={handleAddGoods}
            >
              <Ionicons name="add-circle" size={18} color="#2563eb" />
              <Text style={styles.addGoodsButtonText}>Add Item</Text>
            </TouchableOpacity>

            {goodsList.length > 0 && (
              <View style={styles.goodsListContainer}>
                {goodsList.map((item, index) => (
                  <View key={index} style={styles.goodsItemRow}>
                    <Ionicons name="cube" size={14} color="#2563eb" />
                    <Text style={styles.goodsItemText}>
                      <Text style={{ fontWeight: "700", color: "#1e293b" }}>{item.goodsName}</Text>
                      {"  ·  "}{item.quantity}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => handleRemoveGoods(index)}
                      style={styles.removeBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Transport Info */}
          <View style={styles.sectionLabel}>
            <Ionicons name="bus-outline" size={15} color="#2563eb" />
            <Text style={styles.sectionLabelText}>TRANSPORT</Text>
          </View>

          <View style={[styles.inputContainer, showTransportDropdown && transportSuggestions.length > 0 && styles.inputContainerActive]}>
            <Text style={styles.label}>Transport Company</Text>
            <FocusableInput
              placeholder="Search or enter company name"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={transportName}
              onChangeText={(text: string) => {
                setTransportName(text);
                setShowTransportDropdown(true);
              }}
            />
            {showTransportDropdown && transportSuggestions.length > 0 && (
              <View style={styles.dropdownWrapper}>
                <ScrollView
                  style={styles.dropdownScrollView}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {transportSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => selectTransport(item)}
                      style={styles.dropdownItem}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="business-outline" size={14} color="#2563eb" style={{ marginRight: 8 }} />
                      <Text style={styles.dropdownItemText}>{item.companyName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Driver / Contact Number</Text>
            <FocusableInput
              placeholder="Enter contact number"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={transportNumber}
              onChangeText={setTransportNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Receiver Info */}
          <View style={styles.sectionLabel}>
            <Ionicons name="person-outline" size={15} color="#2563eb" />
            <Text style={styles.sectionLabelText}>RECEIVER</Text>
          </View>

          <View style={[styles.inputContainer, showClientDropdown && clientSuggestions.length > 0 && styles.inputContainerActive]}>
            <Text style={styles.label}>Receiver Name</Text>
            <FocusableInput
              placeholder="Search or enter receiver name"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={receiverName}
              onChangeText={(text: string) => {
                setReceiverName(text);
                setShowClientDropdown(true);
              }}
            />
            {showClientDropdown && clientSuggestions.length > 0 && (
              <View style={styles.dropdownWrapper}>
                <ScrollView
                  style={styles.dropdownScrollView}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {clientSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => selectClient(item)}
                      style={styles.dropdownItem}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="person-outline" size={14} color="#2563eb" style={{ marginRight: 8 }} />
                      <Text style={styles.dropdownItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Receiver Contact Number</Text>
            <FocusableInput
              placeholder="Enter contact number"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={receiverNumber}
              onChangeText={setReceiverNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Date */}
          <View style={styles.sectionLabel}>
            <Ionicons name="calendar-outline" size={15} color="#2563eb" />
            <Text style={styles.sectionLabelText}>DISPATCH DATE</Text>
          </View>

          <View style={styles.inputContainer}>
            <FocusableInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={date}
              onChangeText={setDate}
            />
          </View>

          {/* Action Buttons */}
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              activeOpacity={0.85}
              onPress={handleAddAndSendSMS}
            >
              <Ionicons name="paper-plane" size={18} color="#fff" />
              <Text style={styles.buttonText}>Dispatch & Send SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              activeOpacity={0.85}
              onPress={() => router.push("/search")}
            >
              <Ionicons name="search" size={18} color="#2563eb" />
              <Text style={styles.secondaryButtonText}>Search Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  scrollContent: {
    paddingBottom: 48,
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
    zIndex: 99,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logoBadge: {
    width: 46,
    height: 46,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoTruck: {
    position: "absolute",
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    backgroundColor: "#2563eb",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
    letterSpacing: 0.2,
    marginTop: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsDropdown: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  settingsOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsIconWrap: {
    width: 32,
    height: 32,
    backgroundColor: "#eff6ff",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingsOptionText: {
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "600",
    flex: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 16,
  },

  // ── Form ────────────────────────────────────────
  formContainer: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: 1.2,
  },

  // ── Goods Card ──────────────────────────────────
  goodsCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: 1.2,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addGoodsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    marginTop: 8,
  },
  addGoodsButtonText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  goodsListContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
    gap: 8,
  },
  goodsItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  goodsItemText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  removeBtn: {
    padding: 4,
  },

  // ── Inputs ──────────────────────────────────────
  inputContainer: {
    marginBottom: 16,
    position: "relative",
    zIndex: 1,
  },
  inputContainerActive: {
    zIndex: 9999,
    elevation: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 6,
    letterSpacing: 0.2,
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
    // Kill Android default outline glow
    ...(Platform.OS === "android" && { outlineWidth: 0 } as any),
  },
  inputFocused: {
    borderColor: "#2563eb",
    borderWidth: 1.5,
    // Crisp, no blur
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 0,
  },

  // ── Dropdown ────────────────────────────────────
  dropdownWrapper: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    overflow: "hidden",
    maxHeight: 200,
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginTop: 4,
  },
  dropdownScrollView: {
    flexGrow: 0,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    minHeight: 48,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
    lineHeight: 20,
    flex: 1,
  },

  // ── Buttons ─────────────────────────────────────
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    marginVertical: 5,
  },
  primaryButton: {
    backgroundColor: "#1e3a8a",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
});
