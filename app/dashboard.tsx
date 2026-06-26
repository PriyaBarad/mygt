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

 const BACKEND_URL = " https://mygt-0l9k.onrender.com/api";
// const BACKEND_URL = "https://goodsnotifier-production.up.railway.app/api";

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

  const [date, setDate] = useState("");
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
    const updatedGoods = goodsList.filter((_, i) => i !== index);
    setGoodsList(updatedGoods);
  };

  // --- Autocomplete Client ---
  useEffect(() => {
    if (receiverName.trim() === "") {
      setClientSuggestions([]);
      return;
    }

    const fetchClients = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/clients`, {
          params: { search: receiverName }
        });
        setClientSuggestions(res.data);
      } catch (err) {
        console.log("Client fetch error", err);
      }
    };

    fetchClients();
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
        const res = await axios.get(`${BACKEND_URL}/transports`, {
          params: { search: transportName }
        });
        setTransportSuggestions(res.data);
      } catch (err) {
        console.log("Transport fetch error", err);
      }
    };

    fetchTransports();
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

    const newEntry = {
      goods: goodsList,
      transportName,
      transportNumber,
      receiverName,
      receiverNumber,
      date,
    };

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
        Alert.alert("Error", "SMS service is not available on this device");
      }

      setGoodsName("");
      setQuantity("");
      setGoodsList([]);
      setTransportName("");
      setTransportNumber("");
      setReceiverName("");
      setReceiverNumber("");
      setDate("");
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
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Goods Dispatch Manager</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(!showSettings)}
            >
              <Ionicons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Track and manage your shipments</Text>

          {showSettings && (
            <View style={styles.settingsDropdown}>
              <TouchableOpacity
                style={styles.settingsOption}
                onPress={() => router.push("/addClient")}
              >
                <Ionicons name="person-add" size={18} color="#1976d2" />
                <Text style={styles.settingsOptionText}>Add Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingsOption}
                onPress={() => router.push("/addTransport")}
              >
                <Ionicons name="bus" size={18} color="#1976d2" />
                <Text style={styles.settingsOptionText}>Add Transport</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>
            {editIndex !== null ? "Edit Entry" : "New Dispatch Entry"}
          </Text>

          {/* Goods */}
          <View style={styles.goodsSection}>
            <Text style={styles.sectionSubtitle}>Goods Details</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Goods Name</Text>
                <TextInput
                  placeholder="Enter goods name"
                  style={styles.input}
                  value={goodsName}
                  onChangeText={setGoodsName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  placeholder="Enter quantity"
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.addGoodsButton}
              onPress={handleAddGoods}
            >
              <Ionicons name="add-circle" size={20} color="#1976d2" />
              <Text style={styles.addGoodsButtonText}>Add Goods</Text>
            </TouchableOpacity>

            {goodsList.length > 0 &&
              goodsList.map((item, index) => (
                <View key={index} style={styles.goodsItemContent}>
                  <Text>{item.goodsName} - {item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleRemoveGoods(index)}>
                    <Ionicons name="close-circle" size={18} color="#d32f2f" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>

          {/* Transport */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Transport Name</Text>
            <TextInput
              placeholder="Transport company"
              style={styles.input}
              value={transportName}
              onChangeText={(text) => {
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
                    >
                      <Text>{item.companyName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Driver Number</Text>
            <TextInput
              placeholder="Driver's phone"
              style={styles.input}
              value={transportNumber}
              onChangeText={setTransportNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Receiver */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Receiver Name</Text>
            <TextInput
              placeholder="Receiver's name"
              style={styles.input}
              value={receiverName}
              onChangeText={(text) => {
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
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Receiver Number</Text>
            <TextInput
              placeholder="Receiver's phone"
              style={styles.input}
              value={receiverNumber}
              onChangeText={setReceiverNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dispatch Date</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              style={styles.input}
              value={date}
              onChangeText={setDate}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleAddAndSendSMS}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add & Send SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.searchButton]}
            onPress={() => router.push("/search")}
          >
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.buttonText}>Search Dispatch</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  header: { backgroundColor: "#1976d2", padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center", flex: 1 },
  subtitle: { fontSize: 14, color: "#e3f2fd", textAlign: "center" },
  goodsSection: { marginBottom: 16 },
  searchButton: { backgroundColor: "#388e3c" },
  settingsButton: { padding: 8 },
  settingsDropdown: { backgroundColor: "#fff", marginTop: 15, borderRadius: 12, padding: 8 },
  settingsOption: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8 },
  settingsOptionText: { fontSize: 16, color: "#1976d2", fontWeight: "600", marginLeft: 10 },
  formContainer: { backgroundColor: "#fff", margin: 16, padding: 20, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1976d2", marginBottom: 15 },
  sectionSubtitle: { fontSize: 16, fontWeight: "bold", color: "#1976d2", marginBottom: 12 },
  inputRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  inputContainer: { marginBottom: 12, position: 'relative' },
  label: { fontSize: 14, fontWeight: "600", color: "#1976d2", marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: "#e3f2fd", borderRadius: 12, padding: 12, backgroundColor: "#fafafa", fontSize: 14, color: "#1565c0" },
  addGoodsButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderWidth: 1.5, borderColor: "#1976d2", borderRadius: 12, backgroundColor: "#e3f2fd", marginBottom: 12 },
  addGoodsButtonText: { color: "#1976d2", fontSize: 14, fontWeight: "bold", marginLeft: 6 },
  goodsItemContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6, padding: 8, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#e3f2fd" },
  dropdownWrapper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3f2fd',
    borderRadius: 8,
    maxHeight: 120,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dropdownScrollView: {
    maxHeight: 120,
  },
  dropdownItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#e3f2fd",
  },
  button: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 12, 
    borderRadius: 12, 
    flex: 1, 
    marginVertical: 8, 
    backgroundColor: "#1976d2" 
  },
  primaryButton: { backgroundColor: "#1976d2" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginLeft: 6 },
});
