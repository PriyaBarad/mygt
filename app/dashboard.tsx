// // // // // // // // // import React, { useState } from "react";
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   TextInput,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   FlatList,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   Alert,
// // // // // // // // // } from "react-native";
// // // // // // // // // import * as SMS from "expo-sms";

// // // // // // // // // const Dashboard = () => {
// // // // // // // // //   const [goodsName, setGoodsName] = useState("");
// // // // // // // // //   const [quantity, setQuantity] = useState("");
// // // // // // // // //   const [transportName, setTransportName] = useState("");
// // // // // // // // //   const [transportNumber, setTransportNumber] = useState("");
// // // // // // // // //   const [receiverName, setReceiverName] = useState("");
// // // // // // // // //   const [receiverNumber, setReceiverNumber] = useState("");
// // // // // // // // //   const [date, setDate] = useState("");

// // // // // // // // //   const [data, setData] = useState<any[]>([]);
// // // // // // // // //   const [editIndex, setEditIndex] = useState<number | null>(null);

// // // // // // // // //   // Search state
// // // // // // // // //   const [searchMode, setSearchMode] = useState(false);
// // // // // // // // //   const [searchQuery, setSearchQuery] = useState("");

// // // // // // // // //   const handleAddAndSendSMS = async () => {
// // // // // // // // //     if (
// // // // // // // // //       !goodsName ||
// // // // // // // // //       !quantity ||
// // // // // // // // //       !transportName ||
// // // // // // // // //       !transportNumber ||
// // // // // // // // //       !receiverName ||
// // // // // // // // //       !receiverNumber ||
// // // // // // // // //       !date
// // // // // // // // //     ) {
// // // // // // // // //       Alert.alert("Error", "Please fill all fields");
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const newEntry = {
// // // // // // // // //       goodsName,
// // // // // // // // //       quantity,
// // // // // // // // //       transportName,
// // // // // // // // //       transportNumber,
// // // // // // // // //       receiverName,
// // // // // // // // //       receiverNumber,
// // // // // // // // //       date,
// // // // // // // // //     };

// // // // // // // // //     // Save data
// // // // // // // // //     setData([...data, newEntry]);

// // // // // // // // //     // Format SMS text
// // // // // // // // //     const message = `📌 Amrut Automobiles\n\n📦 Goods: ${goodsName}\n📊 Quantity: ${quantity}\n🎯 Receiver: ${receiverName}\n📅 Date: ${date}\n🚚 Transport: ${transportName}\n📞 Contact: ${transportNumber} \n is Dispatched`;

// // // // // // // // //     try {
// // // // // // // // //       const isAvailable = await SMS.isAvailableAsync();
// // // // // // // // //       if (isAvailable) {
// // // // // // // // //         await SMS.sendSMSAsync([receiverNumber], message);
// // // // // // // // //       } else {
// // // // // // // // //         Alert.alert("Error", "SMS service is not available on this device");
// // // // // // // // //       }
// // // // // // // // //     } catch (error) {
// // // // // // // // //       Alert.alert("Error", "Failed to send SMS");
// // // // // // // // //     }

// // // // // // // // //     // Clear form
// // // // // // // // //     setGoodsName("");
// // // // // // // // //     setQuantity("");
// // // // // // // // //     setTransportName("");
// // // // // // // // //     setTransportNumber("");
// // // // // // // // //     setReceiverName("");
// // // // // // // // //     setReceiverNumber("");
// // // // // // // // //     setDate("");
// // // // // // // // //   };

// // // // // // // // //   const handleEdit = (index: number) => {
// // // // // // // // //     const entry = data[index];
// // // // // // // // //     setGoodsName(entry.goodsName);
// // // // // // // // //     setQuantity(entry.quantity);
// // // // // // // // //     setTransportName(entry.transportName);
// // // // // // // // //     setTransportNumber(entry.transportNumber);
// // // // // // // // //     setReceiverName(entry.receiverName);
// // // // // // // // //     setReceiverNumber(entry.receiverNumber);
// // // // // // // // //     setDate(entry.date);
// // // // // // // // //     setEditIndex(index);
// // // // // // // // //   };

// // // // // // // // //   const handleDelete = (index: number) => {
// // // // // // // // //     const updated = data.filter((_, i) => i !== index);
// // // // // // // // //     setData(updated);
// // // // // // // // //   };

// // // // // // // // //   // Filtered data based on search query
// // // // // // // // //   const filteredData = data.filter((item) =>
// // // // // // // // //     item.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
// // // // // // // // //   );

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <Text style={styles.title}>Goods Entry Form</Text>

// // // // // // // // //       {!searchMode && (
// // // // // // // // //         <>
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Goods Name"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={goodsName}
// // // // // // // // //             onChangeText={setGoodsName}
// // // // // // // // //           />
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Quantity"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={quantity}
// // // // // // // // //             onChangeText={setQuantity}
// // // // // // // // //             keyboardType="numeric"
// // // // // // // // //           />
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Transport Name"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={transportName}
// // // // // // // // //             onChangeText={setTransportName}
// // // // // // // // //           />
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Transport Person's Number"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={transportNumber}
// // // // // // // // //             onChangeText={setTransportNumber}
// // // // // // // // //             keyboardType="phone-pad"
// // // // // // // // //           />
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Receiver's Name"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={receiverName}
// // // // // // // // //             onChangeText={setReceiverName}
// // // // // // // // //           />
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Receiver's Number"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={receiverNumber}
// // // // // // // // //             onChangeText={setReceiverNumber}
// // // // // // // // //             keyboardType="phone-pad"
// // // // // // // // //           />
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Date (YYYY-MM-DD)"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={date}
// // // // // // // // //             onChangeText={setDate}
// // // // // // // // //           />

// // // // // // // // //           {/* Row with two buttons */}
// // // // // // // // //           <View style={styles.buttonRow}>
// // // // // // // // //             <TouchableOpacity style={styles.button} onPress={handleAddAndSendSMS}>
// // // // // // // // //               <Text style={styles.buttonText}>
// // // // // // // // //                 {editIndex !== null ? "Update & Send SMS" : "Add & Send SMS"}
// // // // // // // // //               </Text>
// // // // // // // // //             </TouchableOpacity>

// // // // // // // // //             <TouchableOpacity
// // // // // // // // //               style={[styles.button, { backgroundColor: "green" }]}
// // // // // // // // //               onPress={() => setSearchMode(!searchMode)}
// // // // // // // // //             >
// // // // // // // // //               <Text style={styles.buttonText}>Search</Text>
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           </View>
// // // // // // // // //         </>
// // // // // // // // //       )}

// // // // // // // // //       {/* Search bar if in search mode */}
// // // // // // // // //       {searchMode && (
// // // // // // // // //         <>
// // // // // // // // //           <TextInput
// // // // // // // // //             placeholder="Search by Receiver's Name"
// // // // // // // // //             style={styles.input}
// // // // // // // // //             value={searchQuery}
// // // // // // // // //             onChangeText={setSearchQuery}
// // // // // // // // //           />

// // // // // // // // //           <TouchableOpacity
// // // // // // // // //             style={[styles.button, { backgroundColor: "red" }]}
// // // // // // // // //             onPress={() => setSearchMode(false)}
// // // // // // // // //           >
// // // // // // // // //             <Text style={styles.buttonText}>Back to Form</Text>
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //         </>
// // // // // // // // //       )}

// // // // // // // // //       {/* List of Records */}
// // // // // // // // //       <FlatList
// // // // // // // // //         data={searchMode ? filteredData : data}
// // // // // // // // //         keyExtractor={(_, index) => index.toString()}
// // // // // // // // //         renderItem={({ item, index }) => (
// // // // // // // // //           <View style={styles.card}>
// // // // // // // // //             <Text style={styles.cardTitle}>📌 Amrut Automobiles</Text>
// // // // // // // // //             <Text style={styles.cardText}>
// // // // // // // // //               📦 {item.goodsName} ({item.quantity})
// // // // // // // // //             </Text>
// // // // // // // // //             <Text style={styles.cardText}>
// // // // // // // // //               🚚 {item.transportName} ({item.transportNumber})
// // // // // // // // //             </Text>
// // // // // // // // //             <Text style={styles.cardText}>
// // // // // // // // //               🎯 {item.receiverName} ({item.receiverNumber})
// // // // // // // // //             </Text>
// // // // // // // // //             <Text style={styles.cardText}>📅 {item.date}</Text>

// // // // // // // // //             {!searchMode && (
// // // // // // // // //               <View style={styles.actions}>
// // // // // // // // //                 <TouchableOpacity onPress={() => handleEdit(index)}>
// // // // // // // // //                   <Text style={styles.edit}>✏️ Edit</Text>
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //                 <TouchableOpacity onPress={() => handleDelete(index)}>
// // // // // // // // //                   <Text style={styles.delete}>🗑️ Delete</Text>
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //               </View>
// // // // // // // // //             )}
// // // // // // // // //           </View>
// // // // // // // // //         )}
// // // // // // // // //       />
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default Dashboard;

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
// // // // // // // // //   title: {
// // // // // // // // //     fontSize: 20,
// // // // // // // // //     fontWeight: "bold",
// // // // // // // // //     marginBottom: 15,
// // // // // // // // //     textAlign: "center",
// // // // // // // // //   },
// // // // // // // // //   input: {
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#ccc",
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     padding: 10,
// // // // // // // // //     marginBottom: 10,
// // // // // // // // //     backgroundColor: "#fff",
// // // // // // // // //   },
// // // // // // // // //   button: {
// // // // // // // // //     backgroundColor: "#007bff",
// // // // // // // // //     padding: 12,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     flex: 1,
// // // // // // // // //     marginHorizontal: 5,
// // // // // // // // //   },
// // // // // // // // //   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// // // // // // // // //   buttonRow: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //     marginBottom: 10,
// // // // // // // // //   },
// // // // // // // // //   card: {
// // // // // // // // //     backgroundColor: "#fff",
// // // // // // // // //     padding: 12,
// // // // // // // // //     borderRadius: 10,
// // // // // // // // //     marginBottom: 10,
// // // // // // // // //     elevation: 2,
// // // // // // // // //   },
// // // // // // // // //   cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
// // // // // // // // //   cardText: { fontSize: 14, marginBottom: 4 },
// // // // // // // // //   actions: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //     marginTop: 5,
// // // // // // // // //   },
// // // // // // // // //   edit: { color: "green", fontWeight: "bold" },
// // // // // // // // //   delete: { color: "red", fontWeight: "bold" },
// // // // // // // // // });




// // // // // // // // import React, { useState } from "react";
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   TextInput,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   FlatList,
// // // // // // // //   StyleSheet,
// // // // // // // //   Alert,
// // // // // // // // } from "react-native";
// // // // // // // // import * as SMS from "expo-sms";

// // // // // // // // const Dashboard = () => {
// // // // // // // //   const [goodsName, setGoodsName] = useState("");
// // // // // // // //   const [quantity, setQuantity] = useState("");
// // // // // // // //   const [transportName, setTransportName] = useState("");
// // // // // // // //   const [transportNumber, setTransportNumber] = useState("");
// // // // // // // //   const [receiverName, setReceiverName] = useState("");
// // // // // // // //   const [receiverNumber, setReceiverNumber] = useState("");
// // // // // // // //   const [date, setDate] = useState("");

// // // // // // // //   const [data, setData] = useState<any[]>([]);
// // // // // // // //   const [editIndex, setEditIndex] = useState<number | null>(null);

// // // // // // // //   // Search state
// // // // // // // //   const [searchMode, setSearchMode] = useState(false);
// // // // // // // //   const [searchQuery, setSearchQuery] = useState("");

// // // // // // // //   // Replace with your backend URL
// // // // // // // //   const BACKEND_URL = "http://10.147.147.52:5000/api/details";

// // // // // // // //   const handleAddAndSendSMS = async () => {
// // // // // // // //     if (
// // // // // // // //       !goodsName ||
// // // // // // // //       !quantity ||
// // // // // // // //       !transportName ||
// // // // // // // //       !transportNumber ||
// // // // // // // //       !receiverName ||
// // // // // // // //       !receiverNumber ||
// // // // // // // //       !date
// // // // // // // //     ) {
// // // // // // // //       Alert.alert("Error", "Please fill all fields");
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const newEntry = {
// // // // // // // //       goodsName,
// // // // // // // //       quantity,
// // // // // // // //       transportName,
// // // // // // // //       transportNumber,
// // // // // // // //       receiverName,
// // // // // // // //       receiverNumber,
// // // // // // // //       date,
// // // // // // // //     };

// // // // // // // //     try {
// // // // // // // //       // 1️⃣ Save to backend (MongoDB)
// // // // // // // //       const response = await fetch(BACKEND_URL, {
// // // // // // // //         method: "POST",
// // // // // // // //         headers: {
// // // // // // // //           "Content-Type": "application/json",
// // // // // // // //         },
// // // // // // // //         body: JSON.stringify(newEntry),
// // // // // // // //       });

// // // // // // // //       const result = await response.json();

// // // // // // // //       if (response.ok) {
// // // // // // // //         // 2️⃣ Update local state
// // // // // // // //         setData([...data, result]);

// // // // // // // //         // 3️⃣ Format SMS
// // // // // // // //         const message = `📌 Amrut Automobiles\n\n📦 Goods: ${goodsName}\n📊 Quantity: ${quantity}\n🎯 Receiver: ${receiverName}\n📅 Date: ${date}\n🚚 Transport: ${transportName}\n📞 Contact: ${transportNumber} \n is Dispatched`;

// // // // // // // //         // 4️⃣ Send SMS
// // // // // // // //         const isAvailable = await SMS.isAvailableAsync();
// // // // // // // //         if (isAvailable) {
// // // // // // // //           await SMS.sendSMSAsync([receiverNumber], message);
// // // // // // // //         } else {
// // // // // // // //           Alert.alert("Error", "SMS service is not available on this device");
// // // // // // // //         }

// // // // // // // //         // 5️⃣ Clear form
// // // // // // // //         setGoodsName("");
// // // // // // // //         setQuantity("");
// // // // // // // //         setTransportName("");
// // // // // // // //         setTransportNumber("");
// // // // // // // //         setReceiverName("");
// // // // // // // //         setReceiverNumber("");
// // // // // // // //         setDate("");
// // // // // // // //       } else {
// // // // // // // //         Alert.alert("Error", result.message || "Failed to save data");
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       Alert.alert("Error", "Failed to save data to server");
// // // // // // // //       console.log(error);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleEdit = (index: number) => {
// // // // // // // //     const entry = data[index];
// // // // // // // //     setGoodsName(entry.goodsName);
// // // // // // // //     setQuantity(entry.quantity);
// // // // // // // //     setTransportName(entry.transportName);
// // // // // // // //     setTransportNumber(entry.transportNumber);
// // // // // // // //     setReceiverName(entry.receiverName);
// // // // // // // //     setReceiverNumber(entry.receiverNumber);
// // // // // // // //     setDate(entry.date);
// // // // // // // //     setEditIndex(index);
// // // // // // // //   };

// // // // // // // //   const handleDelete = (index: number) => {
// // // // // // // //     const updated = data.filter((_, i) => i !== index);
// // // // // // // //     setData(updated);
// // // // // // // //   };

// // // // // // // //   const filteredData = data.filter((item) =>
// // // // // // // //     item.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <View style={styles.container}>
// // // // // // // //       <Text style={styles.title}>Goods Entry Form</Text>

// // // // // // // //       {!searchMode && (
// // // // // // // //         <>
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Goods Name"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={goodsName}
// // // // // // // //             onChangeText={setGoodsName}
// // // // // // // //           />
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Quantity"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={quantity}
// // // // // // // //             onChangeText={setQuantity}
// // // // // // // //             keyboardType="numeric"
// // // // // // // //           />
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Transport Name"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={transportName}
// // // // // // // //             onChangeText={setTransportName}
// // // // // // // //           />
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Transport Person's Number"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={transportNumber}
// // // // // // // //             onChangeText={setTransportNumber}
// // // // // // // //             keyboardType="phone-pad"
// // // // // // // //           />
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Receiver's Name"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={receiverName}
// // // // // // // //             onChangeText={setReceiverName}
// // // // // // // //           />
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Receiver's Number"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={receiverNumber}
// // // // // // // //             onChangeText={setReceiverNumber}
// // // // // // // //             keyboardType="phone-pad"
// // // // // // // //           />
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Date (YYYY-MM-DD)"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={date}
// // // // // // // //             onChangeText={setDate}
// // // // // // // //           />

// // // // // // // //           <View style={styles.buttonRow}>
// // // // // // // //             <TouchableOpacity style={styles.button} onPress={handleAddAndSendSMS}>
// // // // // // // //               <Text style={styles.buttonText}>
// // // // // // // //                 {editIndex !== null ? "Update & Send SMS" : "Add & Send SMS"}
// // // // // // // //               </Text>
// // // // // // // //             </TouchableOpacity>

// // // // // // // //             <TouchableOpacity
// // // // // // // //               style={[styles.button, { backgroundColor: "green" }]}
// // // // // // // //               onPress={() => setSearchMode(!searchMode)}
// // // // // // // //             >
// // // // // // // //               <Text style={styles.buttonText}>Search</Text>
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           </View>
// // // // // // // //         </>
// // // // // // // //       )}

// // // // // // // //       {searchMode && (
// // // // // // // //         <>
// // // // // // // //           <TextInput
// // // // // // // //             placeholder="Search by Receiver's Name"
// // // // // // // //             style={styles.input}
// // // // // // // //             value={searchQuery}
// // // // // // // //             onChangeText={setSearchQuery}
// // // // // // // //           />

// // // // // // // //           <TouchableOpacity
// // // // // // // //             style={[styles.backButton, { backgroundColor: "red" }]}
// // // // // // // //             onPress={() => setSearchMode(false)}
// // // // // // // //           >
// // // // // // // //             <Text style={styles.buttonText}>Back to Form</Text>
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </>
// // // // // // // //       )}

// // // // // // // //       <FlatList
// // // // // // // //         data={searchMode ? filteredData : data}
// // // // // // // //         keyExtractor={(_, index) => index.toString()}
// // // // // // // //         renderItem={({ item, index }) => (
// // // // // // // //           <View style={styles.card}>
// // // // // // // //             <Text style={styles.cardTitle}>📌 Amrut Automobiles</Text>
// // // // // // // //             <Text style={styles.cardText}>
// // // // // // // //               📦 {item.goodsName} ({item.quantity})
// // // // // // // //             </Text>
// // // // // // // //             <Text style={styles.cardText}>
// // // // // // // //               🚚 {item.transportName} ({item.transportNumber})
// // // // // // // //             </Text>
// // // // // // // //             <Text style={styles.cardText}>
// // // // // // // //               🎯 {item.receiverName} ({item.receiverNumber})
// // // // // // // //             </Text>
// // // // // // // //             <Text style={styles.cardText}>📅 {item.date}</Text>

// // // // // // // //             {!searchMode && (
// // // // // // // //               <View style={styles.actions}>
// // // // // // // //                 <TouchableOpacity onPress={() => handleEdit(index)}>
// // // // // // // //                   <Text style={styles.edit}>✏️ Edit</Text>
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //                 <TouchableOpacity onPress={() => handleDelete(index)}>
// // // // // // // //                   <Text style={styles.delete}>🗑️ Delete</Text>
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //               </View>
// // // // // // // //             )}
// // // // // // // //           </View>
// // // // // // // //         )}
// // // // // // // //       />
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default Dashboard;

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
// // // // // // // //   title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
// // // // // // // //   input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: "#fff" },
// // // // // // // //   button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center", flex: 1, marginHorizontal: 5 },
// // // // // // // //   backButton: {
// // // // // // // //   backgroundColor: "red",
// // // // // // // //   padding: 12,
// // // // // // // //   borderRadius: 8,
// // // // // // // //   alignItems: "center",
// // // // // // // //   width: 150, // set a fixed width
// // // // // // // //   alignSelf: "center", // center the button
// // // // // // // // },
// // // // // // // //   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// // // // // // // //   buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
// // // // // // // //   card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10, elevation: 2 },
// // // // // // // //   cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
// // // // // // // //   cardText: { fontSize: 14, marginBottom: 4 },
// // // // // // // //   actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
// // // // // // // //   edit: { color: "green", fontWeight: "bold" },
// // // // // // // //   delete: { color: "red", fontWeight: "bold" },
// // // // // // // // });




// // // // import React, { useState } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   FlatList,
// // // //   StyleSheet,
// // // //   Alert,
// // // //   ScrollView,
// // // //   KeyboardAvoidingView,
// // // //   Platform,
// // // // } from "react-native";
// // // // import * as SMS from "expo-sms";
// // // // import { useRouter } from "expo-router";
// // // // import { useNavigation } from "@react-navigation/native";
// // // // import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// // // // import { Ionicons } from "@expo/vector-icons";

// // // // // Define your navigation stack types
// // // // type RootStackParamList = {
// // // //   Dashboard: undefined;
// // // //   Search: undefined;
// // // //   AddClient: undefined;
// // // //   AddTransport: undefined;
// // // // };

// // // // type DashboardScreenProp = NativeStackNavigationProp<
// // // //   RootStackParamList,
// // // //   "Dashboard"
// // // // >;

// // // // // Type for goods item
// // // // type GoodsItem = {
// // // //   goodsName: string;
// // // //   quantity: string;
// // // // };

// // // // const Dashboard = () => {
// // // //   const router = useRouter();
// // // //   const navigation = useNavigation<DashboardScreenProp>();

// // // //   const [goodsName, setGoodsName] = useState("");
// // // //   const [quantity, setQuantity] = useState("");
// // // //   const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);
// // // //   const [transportName, setTransportName] = useState("");
// // // //   const [transportNumber, setTransportNumber] = useState("");
// // // //   const [receiverName, setReceiverName] = useState("");
// // // //   const [receiverNumber, setReceiverNumber] = useState("");
// // // //   const [date, setDate] = useState("");

// // // //   const [data, setData] = useState<any[]>([]);
// // // //   const [editIndex, setEditIndex] = useState<number | null>(null);
  
// // // //   // Settings dropdown state
// // // //   const [showSettings, setShowSettings] = useState(false);

// // // //   const BACKEND_URL = "http://10.235.82.52:5000/api/details";

// // // //   // Add goods to the list
// // // //   const handleAddGoods = () => {
// // // //     if (!goodsName.trim() || !quantity.trim()) {
// // // //       Alert.alert("Error", "Please enter both goods name and quantity");
// // // //       return;
// // // //     }

// // // //     const newGoods: GoodsItem = {
// // // //       goodsName: goodsName.trim(),
// // // //       quantity: quantity.trim(),
// // // //     };

// // // //     setGoodsList([...goodsList, newGoods]);
// // // //     setGoodsName("");
// // // //     setQuantity("");
// // // //   };

// // // //   // Remove goods from the list
// // // //   const handleRemoveGoods = (index: number) => {
// // // //     const updatedGoods = goodsList.filter((_, i) => i !== index);
// // // //     setGoodsList(updatedGoods);
// // // //   };

// // // //   const handleAddAndSendSMS = async () => {
// // // //     if (
// // // //       goodsList.length === 0 ||
// // // //       !transportName ||
// // // //       !transportNumber ||
// // // //       !receiverName ||
// // // //       !receiverNumber ||
// // // //       !date
// // // //     ) {
// // // //       Alert.alert("Error", "Please fill all fields and add at least one good");
// // // //       return;
// // // //     }

// // // //     const newEntry = {
// // // //       goods: goodsList,
// // // //       transportName,
// // // //       transportNumber,
// // // //       receiverName,
// // // //       receiverNumber,
// // // //       date,
// // // //     };

// // // //     try {
// // // //       // Save to backend
// // // //       const response = await fetch(BACKEND_URL, {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify(newEntry),
// // // //       });

// // // //       const result = await response.json();

// // // //       if (response.ok) {
// // // //         setData([...data, result]);

// // // //         // Format SMS with all goods
// // // //         let goodsMessage = "";
// // // //         goodsList.forEach((item, index) => {
// // // //           goodsMessage += `📦 ${item.goodsName}: ${item.quantity}`;
// // // //           if (index < goodsList.length - 1) goodsMessage += "\n";
// // // //         });

// // // //         const message = `📌 Amrut Automobiles\n\n${goodsMessage}\n\n🎯 Receiver: ${receiverName}\n📅 Date: ${date}\n🚚 Transport: ${transportName}\n📞 Contact: ${transportNumber}\n\nis Dispatched from Amrut Automobiles Solapur`;

// // // //         // Send SMS
// // // //         const isAvailable = await SMS.isAvailableAsync();
// // // //         if (isAvailable) {
// // // //           await SMS.sendSMSAsync([receiverNumber], message);
// // // //           Alert.alert("Success", "Data saved and SMS sent successfully!");
// // // //         } else {
// // // //           Alert.alert("Error", "SMS service is not available on this device");
// // // //         }

// // // //         // Clear form
// // // //         setGoodsName("");
// // // //         setQuantity("");
// // // //         setGoodsList([]);
// // // //         setTransportName("");
// // // //         setTransportNumber("");
// // // //         setReceiverName("");
// // // //         setReceiverNumber("");
// // // //         setDate("");
// // // //         setEditIndex(null);
// // // //       } else {
// // // //         Alert.alert("Error", result.message || "Failed to save data");
// // // //       }
// // // //     } catch (error) {
// // // //       Alert.alert("Error", "Failed to save data to server");
// // // //       console.log(error);
// // // //     }
// // // //   };

// // // //   const handleEdit = (index: number) => {
// // // //     const entry = data[index];
// // // //     // For editing, we'll handle single goods for simplicity
// // // //     // You might want to enhance this to handle multiple goods in edit mode
// // // //     if (entry.goods && entry.goods.length > 0) {
// // // //       setGoodsName(entry.goods[0].goodsName);
// // // //       setQuantity(entry.goods[0].quantity);
// // // //       setGoodsList(entry.goods);
// // // //     }
// // // //     setTransportName(entry.transportName);
// // // //     setTransportNumber(entry.transportNumber);
// // // //     setReceiverName(entry.receiverName);
// // // //     setReceiverNumber(entry.receiverNumber);
// // // //     setDate(entry.date);
// // // //     setEditIndex(index);
// // // //   };

// // // //   const handleDelete = (index: number) => {
// // // //     Alert.alert(
// // // //       "Confirm Delete",
// // // //       "Are you sure you want to delete this entry?",
// // // //       [
// // // //         { text: "Cancel", style: "cancel" },
// // // //         { 
// // // //           text: "Delete", 
// // // //           style: "destructive",
// // // //           onPress: () => {
// // // //             const updated = data.filter((_, i) => i !== index);
// // // //             setData(updated);
// // // //           }
// // // //         }
// // // //       ]
// // // //     );
// // // //   };

// // // //   const handleCancelEdit = () => {
// // // //     setEditIndex(null);
// // // //     setGoodsName("");
// // // //     setQuantity("");
// // // //     setGoodsList([]);
// // // //     setTransportName("");
// // // //     setTransportNumber("");
// // // //     setReceiverName("");
// // // //     setReceiverNumber("");
// // // //     setDate("");
// // // //   };

// // // //   const handleAddClient = () => {
// // // //     setShowSettings(false);
// // // //     router.push("/addClient");
// // // //   };

// // // //   const handleAddTransport = () => {
// // // //     setShowSettings(false);
// // // //     router.push("/addTransport");
// // // //   };

// // // //   const filteredData = data.filter((item) =>
// // // //     item.receiverName.toLowerCase().includes(receiverName.toLowerCase())
// // // //   );

// // // //   return (
// // // //     <KeyboardAvoidingView 
// // // //       style={styles.container}
// // // //       behavior={Platform.OS === "ios" ? "padding" : "height"}
// // // //     >
// // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // //         {/* Header */}
// // // //         <View style={styles.header}>
// // // //           <View style={styles.headerTop}>
// // // //             <Text style={styles.title}>Goods Dispatch Manager</Text>
// // // //             <TouchableOpacity 
// // // //               style={styles.settingsButton}
// // // //               onPress={() => setShowSettings(!showSettings)}
// // // //             >
// // // //               <Ionicons name="settings" size={24} color="#fff" />
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //           <Text style={styles.subtitle}>Track and manage your shipments</Text>
          
// // // //           {/* Settings Dropdown */}
// // // //           {showSettings && (
// // // //             <View style={styles.settingsDropdown}>
// // // //               <TouchableOpacity 
// // // //                 style={styles.settingsOption}
// // // //                 onPress={handleAddClient}
// // // //               >
// // // //                 <Ionicons name="person-add" size={18} color="#1976d2" />
// // // //                 <Text style={styles.settingsOptionText}>Add Client</Text>
// // // //               </TouchableOpacity>
              
// // // //               <TouchableOpacity 
// // // //                 style={styles.settingsOption}
// // // //                 onPress={handleAddTransport}
// // // //               >
// // // //                 <Ionicons name="bus" size={18} color="#1976d2" />
// // // //                 <Text style={styles.settingsOptionText}>Add Transport</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}
// // // //         </View>

// // // //         {/* Form Section */}
// // // //         <View style={styles.formContainer}>
// // // //           <Text style={styles.sectionTitle}>
// // // //             {editIndex !== null ? "Edit Entry" : "New Dispatch Entry"}
// // // //           </Text>

// // // //           {/* Goods Section */}
// // // //           <View style={styles.goodsSection}>
// // // //             <Text style={styles.sectionSubtitle}>Goods Details</Text>
            
// // // //             <View style={styles.inputRow}>
// // // //               <View style={styles.inputContainer}>
// // // //                 <Text style={styles.label}>Goods Name</Text>
// // // //                 <TextInput
// // // //                   placeholder="Enter goods name"
// // // //                   style={styles.input}
// // // //                   value={goodsName}
// // // //                   onChangeText={setGoodsName}
// // // //                 />
// // // //               </View>
              
// // // //               <View style={styles.inputContainer}>
// // // //                 <Text style={styles.label}>Quantity</Text>
// // // //                 <TextInput
// // // //                   placeholder="Enter quantity"
// // // //                   style={styles.input}
// // // //                   value={quantity}
// // // //                   onChangeText={setQuantity}
// // // //                   keyboardType="numeric"
// // // //                 />
// // // //               </View>
// // // //             </View>

// // // //             <TouchableOpacity 
// // // //               style={styles.addGoodsButton}
// // // //               onPress={handleAddGoods}
// // // //             >
// // // //               <Ionicons name="add-circle" size={20} color="#1976d2" />
// // // //               <Text style={styles.addGoodsButtonText}>Add Goods</Text>
// // // //             </TouchableOpacity>

// // // //             {/* Added Goods List */}
// // // //             {goodsList.length > 0 && (
// // // //               <View style={styles.goodsListContainer}>
// // // //                 <Text style={styles.goodsListTitle}>Added Goods ({goodsList.length})</Text>
// // // //                 {goodsList.map((item, index) => (
// // // //                   <View key={index} style={styles.goodsItem}>
// // // //                     <View style={styles.goodsItemContent}>
// // // //                       <Text style={styles.goodsItemText}>
// // // //                         {item.goodsName} - {item.quantity}
// // // //                       </Text>
// // // //                       <TouchableOpacity 
// // // //                         onPress={() => handleRemoveGoods(index)}
// // // //                         style={styles.removeGoodsButton}
// // // //                       >
// // // //                         <Ionicons name="close-circle" size={18} color="#d32f2f" />
// // // //                       </TouchableOpacity>
// // // //                     </View>
// // // //                   </View>
// // // //                 ))}
// // // //               </View>
// // // //             )}
// // // //           </View>

// // // //           <View style={styles.inputRow}>
// // // //             <View style={styles.inputContainer}>
// // // //               <Text style={styles.label}>Transport Name</Text>
// // // //               <TextInput
// // // //                 placeholder="Transport company"
// // // //                 style={styles.input}
// // // //                 value={transportName}
// // // //                 onChangeText={setTransportName}
// // // //               />
// // // //             </View>
            
// // // //             <View style={styles.inputContainer}>
// // // //               <Text style={styles.label}>Driver Number</Text>
// // // //               <TextInput
// // // //                 placeholder="Driver's phone"
// // // //                 style={styles.input}
// // // //                 value={transportNumber}
// // // //                 onChangeText={setTransportNumber}
// // // //                 keyboardType="phone-pad"
// // // //               />
// // // //             </View>
// // // //           </View>

// // // //           <View style={styles.inputRow}>
// // // //             <View style={styles.inputContainer}>
// // // //               <Text style={styles.label}>Receiver Name</Text>
// // // //               <TextInput
// // // //                 placeholder="Receiver's name"
// // // //                 style={styles.input}
// // // //                 value={receiverName}
// // // //                 onChangeText={setReceiverName}
// // // //               />
// // // //             </View>
            
// // // //             <View style={styles.inputContainer}>
// // // //               <Text style={styles.label}>Receiver Number</Text>
// // // //               <TextInput
// // // //                 placeholder="Receiver's phone"
// // // //                 style={styles.input}
// // // //                 value={receiverNumber}
// // // //                 onChangeText={setReceiverNumber}
// // // //                 keyboardType="phone-pad"
// // // //               />
// // // //             </View>
// // // //           </View>

// // // //           <View style={styles.inputContainer}>
// // // //             <Text style={styles.label}>Dispatch Date</Text>
// // // //             <TextInput
// // // //               placeholder="YYYY-MM-DD"
// // // //               style={styles.input}
// // // //               value={date}
// // // //               onChangeText={setDate}
// // // //             />
// // // //           </View>

// // // //           {/* Action Buttons */}
// // // //           <View style={styles.buttonRow}>
// // // //             {editIndex !== null && (
// // // //               <TouchableOpacity 
// // // //                 style={[styles.button, styles.cancelButton]} 
// // // //                 onPress={handleCancelEdit}
// // // //               >
// // // //                 <Ionicons name="close-circle" size={20} color="#fff" />
// // // //                 <Text style={styles.buttonText}>Cancel</Text>
// // // //               </TouchableOpacity>
// // // //             )}
            
// // // //             <TouchableOpacity 
// // // //               style={[styles.button, styles.primaryButton]} 
// // // //               onPress={handleAddAndSendSMS}
// // // //             >
// // // //               <Ionicons 
// // // //                 name={editIndex !== null ? "refresh" : "add-circle"} 
// // // //                 size={20} 
// // // //                 color="#fff" 
// // // //               />
// // // //               <Text style={styles.buttonText}>
// // // //                 {editIndex !== null ? "Update & Send SMS" : "Add & Send SMS"}
// // // //               </Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity
// // // //               style={[styles.button, styles.searchButton]}
// // // //               onPress={() => router.push("/search")}
// // // //             >
// // // //               <Ionicons name="search" size={20} color="#fff" />
// // // //               <Text style={styles.buttonText}>Search</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>

// // // //         {/* Recent Entries */}
// // // //         <View style={styles.entriesContainer}>
// // // //           <Text style={styles.sectionTitle}>Recent Entries ({data.length})</Text>
          
// // // //           {data.length === 0 ? (
// // // //             <View style={styles.emptyState}>
// // // //               <Ionicons name="document-text" size={50} color="#90caf9" />
// // // //               <Text style={styles.emptyStateText}>No entries yet</Text>
// // // //               <Text style={styles.emptyStateSubtext}>
// // // //                 Add your first dispatch entry above
// // // //               </Text>
// // // //             </View>
// // // //           ) : (
// // // //             <FlatList
// // // //               data={data}
// // // //               scrollEnabled={false}
// // // //               keyExtractor={(_, index) => index.toString()}
// // // //               renderItem={({ item, index }) => (
// // // //                 <View style={styles.card}>
// // // //                   <View style={styles.cardHeader}>
// // // //                     <Text style={styles.cardTitle}>📌 Amrut Automobiles</Text>
// // // //                     <View style={styles.badge}>
// // // //                       <Text style={styles.badgeText}>Dispatched</Text>
// // // //                     </View>
// // // //                   </View>
                  
// // // //                   <View style={styles.cardContent}>
// // // //                     {/* Display all goods */}
// // // //                     {item.goods && item.goods.map((goods: GoodsItem, goodsIndex: number) => (
// // // //                       <View key={goodsIndex} style={styles.cardRow}>
// // // //                         <Ionicons name="cube" size={16} color="#1976d2" />
// // // //                         <Text style={styles.cardText}>
// // // //                           {goods.goodsName} ({goods.quantity})
// // // //                         </Text>
// // // //                       </View>
// // // //                     ))}
                    
// // // //                     <View style={styles.cardRow}>
// // // //                       <Ionicons name="business" size={16} color="#1976d2" />
// // // //                       <Text style={styles.cardText}>
// // // //                         {item.transportName} ({item.transportNumber})
// // // //                       </Text>
// // // //                     </View>
                    
// // // //                     <View style={styles.cardRow}>
// // // //                       <Ionicons name="person" size={16} color="#1976d2" />
// // // //                       <Text style={styles.cardText}>
// // // //                         {item.receiverName} ({item.receiverNumber})
// // // //                       </Text>
// // // //                     </View>
                    
// // // //                     <View style={styles.cardRow}>
// // // //                       <Ionicons name="calendar" size={16} color="#1976d2" />
// // // //                       <Text style={styles.cardText}>{item.date}</Text>
// // // //                     </View>
// // // //                   </View>

// // // //                   <View style={styles.actions}>
// // // //                     <TouchableOpacity 
// // // //                       style={styles.actionButton} 
// // // //                       onPress={() => handleEdit(index)}
// // // //                     >
// // // //                       <Ionicons name="create" size={18} color="#1976d2" />
// // // //                       <Text style={styles.editText}>Edit</Text>
// // // //                     </TouchableOpacity>
                    
// // // //                     <TouchableOpacity 
// // // //                       style={styles.actionButton} 
// // // //                       onPress={() => handleDelete(index)}
// // // //                     >
// // // //                       <Ionicons name="trash" size={18} color="#d32f2f" />
// // // //                       <Text style={styles.deleteText}>Delete</Text>
// // // //                     </TouchableOpacity>
// // // //                   </View>
// // // //                 </View>
// // // //               )}
// // // //             />
// // // //           )}
// // // //         </View>
// // // //       </ScrollView>
// // // //     </KeyboardAvoidingView>
// // // //   );
// // // // };

// // // // export default Dashboard;

// // // // const styles = StyleSheet.create({
// // // //   container: { 
// // // //     flex: 1, 
// // // //     backgroundColor: "#f0f8ff" 
// // // //   },
// // // //   header: {
// // // //     backgroundColor: "#1976d2",
// // // //     padding: 20,
// // // //     borderBottomLeftRadius: 20,
// // // //     borderBottomRightRadius: 20,
// // // //     marginBottom: 20,
// // // //     elevation: 4,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 8,
// // // //   },
// // // //   headerTop: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     marginBottom: 5,
// // // //   },
// // // //   title: {
// // // //     fontSize: 24,
// // // //     fontWeight: "bold",
// // // //     color: "#fff",
// // // //     flex: 1,
// // // //     textAlign: "center",
// // // //   },
// // // //   subtitle: {
// // // //     fontSize: 14,
// // // //     color: "#e3f2fd",
// // // //     textAlign: "center",
// // // //   },
// // // //   settingsButton: {
// // // //     padding: 8,
// // // //     position: "absolute",
// // // //     right: 0,
// // // //     top: -5,
// // // //   },
// // // //   settingsDropdown: {
// // // //     backgroundColor: "#fff",
// // // //     marginTop: 15,
// // // //     borderRadius: 12,
// // // //     padding: 8,
// // // //     elevation: 4,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //   },
// // // //   settingsOption: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     padding: 12,
// // // //     borderRadius: 8,
// // // //   },
// // // //   settingsOptionText: {
// // // //     fontSize: 16,
// // // //     color: "#1976d2",
// // // //     fontWeight: "600",
// // // //     marginLeft: 10,
// // // //   },
// // // //   formContainer: {
// // // //     backgroundColor: "#fff",
// // // //     marginHorizontal: 16,
// // // //     padding: 20,
// // // //     borderRadius: 16,
// // // //     marginBottom: 20,
// // // //     elevation: 2,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //   },
// // // //   goodsSection: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   sectionSubtitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: "bold",
// // // //     color: "#1976d2",
// // // //     marginBottom: 12,
// // // //   },
// // // //   entriesContainer: {
// // // //     backgroundColor: "transparent",
// // // //     marginHorizontal: 16,
// // // //     marginBottom: 20,
// // // //   },
// // // //   sectionTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: "bold",
// // // //     color: "#1976d2",
// // // //     marginBottom: 15,
// // // //   },
// // // //   inputRow: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     marginBottom: 12,
// // // //   },
// // // //   inputContainer: {
// // // //     flex: 1,
// // // //     marginHorizontal: 4,
// // // //   },
// // // //   label: {
// // // //     fontSize: 14,
// // // //     fontWeight: "600",
// // // //     color: "#1976d2",
// // // //     marginBottom: 6,
// // // //   },
// // // //   input: {
// // // //     borderWidth: 1.5,
// // // //     borderColor: "#e3f2fd",
// // // //     borderRadius: 12,
// // // //     padding: 12,
// // // //     backgroundColor: "#fafafa",
// // // //     fontSize: 14,
// // // //     color: "#1565c0",
// // // //   },
// // // //   addGoodsButton: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     padding: 12,
// // // //     borderWidth: 1.5,
// // // //     borderColor: "#1976d2",
// // // //     borderRadius: 12,
// // // //     backgroundColor: "#e3f2fd",
// // // //     marginBottom: 12,
// // // //   },
// // // //   addGoodsButtonText: {
// // // //     color: "#1976d2",
// // // //     fontSize: 14,
// // // //     fontWeight: "bold",
// // // //     marginLeft: 6,
// // // //   },
// // // //   goodsListContainer: {
// // // //     backgroundColor: "#f8fdff",
// // // //     borderWidth: 1,
// // // //     borderColor: "#e3f2fd",
// // // //     borderRadius: 12,
// // // //     padding: 12,
// // // //   },
// // // //   goodsListTitle: {
// // // //     fontSize: 14,
// // // //     fontWeight: "bold",
// // // //     color: "#1976d2",
// // // //     marginBottom: 8,
// // // //   },
// // // //   goodsItem: {
// // // //     marginBottom: 6,
// // // //   },
// // // //   goodsItemContent: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     padding: 8,
// // // //     backgroundColor: "#fff",
// // // //     borderRadius: 8,
// // // //     borderWidth: 1,
// // // //     borderColor: "#e3f2fd",
// // // //   },
// // // //   goodsItemText: {
// // // //     fontSize: 14,
// // // //     color: "#424242",
// // // //     flex: 1,
// // // //   },
// // // //   removeGoodsButton: {
// // // //     padding: 4,
// // // //   },
// // // //   buttonRow: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     marginTop: 10,
// // // //   },
// // // //   button: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     padding: 12,
// // // //     borderRadius: 12,
// // // //     flex: 1,
// // // //     marginHorizontal: 4,
// // // //     elevation: 2,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 2,
// // // //   },
// // // //   primaryButton: {
// // // //     backgroundColor: "#1976d2",
// // // //   },
// // // //   searchButton: {
// // // //     backgroundColor: "#42a5f5",
// // // //   },
// // // //   cancelButton: {
// // // //     backgroundColor: "#78909c",
// // // //   },
// // // //   buttonText: {
// // // //     color: "#fff",
// // // //     fontSize: 14,
// // // //     fontWeight: "bold",
// // // //     marginLeft: 6,
// // // //   },
// // // //   card: {
// // // //     backgroundColor: "#fff",
// // // //     padding: 16,
// // // //     borderRadius: 16,
// // // //     marginBottom: 12,
// // // //     elevation: 2,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //     borderLeftWidth: 4,
// // // //     borderLeftColor: "#1976d2",
// // // //   },
// // // //   cardHeader: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     marginBottom: 8,
// // // //   },
// // // //   cardTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: "bold",
// // // //     color: "#1976d2",
// // // //   },
// // // //   badge: {
// // // //     backgroundColor: "#e3f2fd",
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 12,
// // // //   },
// // // //   badgeText: {
// // // //     fontSize: 10,
// // // //     fontWeight: "bold",
// // // //     color: "#1976d2",
// // // //   },
// // // //   cardContent: {
// // // //     marginBottom: 12,
// // // //   },
// // // //   cardRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginBottom: 6,
// // // //   },
// // // //   cardText: {
// // // //     fontSize: 14,
// // // //     color: "#424242",
// // // //     marginLeft: 8,
// // // //     flex: 1,
// // // //   },
// // // //   actions: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "flex-end",
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: "#f5f5f5",
// // // //     paddingTop: 12,
// // // //   },
// // // //   actionButton: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginLeft: 16,
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 4,
// // // //   },
// // // //   editText: {
// // // //     color: "#1976d2",
// // // //     fontWeight: "600",
// // // //     marginLeft: 4,
// // // //     fontSize: 14,
// // // //   },
// // // //   deleteText: {
// // // //     color: "#d32f2f",
// // // //     fontWeight: "600",
// // // //     marginLeft: 4,
// // // //     fontSize: 14,
// // // //   },
// // // //   emptyState: {
// // // //     alignItems: "center",
// // // //     padding: 40,
// // // //     backgroundColor: "#fff",
// // // //     borderRadius: 16,
// // // //     elevation: 1,
// // // //   },
// // // //   emptyStateText: {
// // // //     fontSize: 16,
// // // //     fontWeight: "bold",
// // // //     color: "#1976d2",
// // // //     marginTop: 12,
// // // //   },
// // // //   emptyStateSubtext: {
// // // //     fontSize: 14,
// // // //     color: "#757575",
// // // //     textAlign: "center",
// // // //     marginTop: 4,
// // // //   },
// // // // });



// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import * as SMS from "expo-sms";
// import { useRouter } from "expo-router";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";

// type RootStackParamList = {
//   Dashboard: undefined;
//   Search: undefined;
//   AddClient: undefined;
//   AddTransport: undefined;
// };

// type DashboardScreenProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "Dashboard"
// >;

// type GoodsItem = {
//   goodsName: string;
//   quantity: string;
// };

// type ClientType = { _id: string; name: string; contactNumber: string };
// type TransportType = { _id: string; companyName: string; contactNumber: string };

// const BACKEND_URL = "http://10.235.82.52:5000/api";

// const Dashboard = () => {
//   const router = useRouter();
//   const navigation = useNavigation<DashboardScreenProp>();

//   const [goodsName, setGoodsName] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);

//   const [transportName, setTransportName] = useState("");
//   const [transportNumber, setTransportNumber] = useState("");
//   const [transportSuggestions, setTransportSuggestions] = useState<TransportType[]>([]);
//   const [showTransportDropdown, setShowTransportDropdown] = useState(false);

//   const [receiverName, setReceiverName] = useState("");
//   const [receiverNumber, setReceiverNumber] = useState("");
//   const [clientSuggestions, setClientSuggestions] = useState<ClientType[]>([]);
//   const [showClientDropdown, setShowClientDropdown] = useState(false);

//   const [date, setDate] = useState("");
//   const [data, setData] = useState<any[]>([]);
//   const [editIndex, setEditIndex] = useState<number | null>(null);

//   const [showSettings, setShowSettings] = useState(false);

//   // --- Add Goods ---
//   const handleAddGoods = () => {
//     if (!goodsName.trim() || !quantity.trim()) {
//       Alert.alert("Error", "Please enter both goods name and quantity");
//       return;
//     }

//     const newGoods: GoodsItem = { goodsName: goodsName.trim(), quantity: quantity.trim() };
//     setGoodsList([...goodsList, newGoods]);
//     setGoodsName("");
//     setQuantity("");
//   };

//   const handleRemoveGoods = (index: number) => {
//     const updatedGoods = goodsList.filter((_, i) => i !== index);
//     setGoodsList(updatedGoods);
//   };

//   // --- Autocomplete Client ---
//   useEffect(() => {
//     if (receiverName.trim() === "") {
//       setClientSuggestions([]);
//       return;
//     }

//     const fetchClients = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/clients`, {
//           params: { search: receiverName }
//         });
//         setClientSuggestions(res.data);
//       } catch (err) {
//         console.log("Client fetch error", err);
//       }
//     };

//     fetchClients();
//   }, [receiverName]);

//   const selectClient = (client: ClientType) => {
//     setReceiverName(client.name);
//     setReceiverNumber(client.contactNumber);
//     setShowClientDropdown(false);
//   };

//   // --- Autocomplete Transport ---
//   useEffect(() => {
//     if (transportName.trim() === "") {
//       setTransportSuggestions([]);
//       return;
//     }

//     const fetchTransports = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/transports`, {
//           params: { search: transportName }
//         });
//         setTransportSuggestions(res.data);
//       } catch (err) {
//         console.log("Transport fetch error", err);
//       }
//     };

//     fetchTransports();
//   }, [transportName]);

//   const selectTransport = (transport: TransportType) => {
//     setTransportName(transport.companyName);
//     setTransportNumber(transport.contactNumber);
//     setShowTransportDropdown(false);
//   };

//   // --- Add & Send SMS ---
//   const handleAddAndSendSMS = async () => {
//     if (
//       goodsList.length === 0 ||
//       !transportName ||
//       !transportNumber ||
//       !receiverName ||
//       !receiverNumber ||
//       !date
//     ) {
//       Alert.alert("Error", "Please fill all fields and add at least one good");
//       return;
//     }

//     const newEntry = {
//       goods: goodsList,
//       transportName,
//       transportNumber,
//       receiverName,
//       receiverNumber,
//       date,
//     };

//     try {
//       const response = await axios.post(`${BACKEND_URL}/details`, newEntry);
//       const result = response.data;

//       setData([...data, result]);

//       let goodsMessage = "";
//       goodsList.forEach((item, index) => {
//         goodsMessage += `📦 ${item.goodsName}: ${item.quantity}`;
//         if (index < goodsList.length - 1) goodsMessage += "\n";
//       });

//       const message = `📌 Amrut Automobiles\n\n${goodsMessage}\n\n🎯 Receiver: ${receiverName}\n📅 Date: ${date}\n🚚 Transport: ${transportName}\n📞 Contact: ${transportNumber}\n\nis Dispatched from Amrut Automobiles Solapur`;

//       const isAvailable = await SMS.isAvailableAsync();
//       if (isAvailable) {
//         await SMS.sendSMSAsync([receiverNumber], message);
//         Alert.alert("Success", "Data saved and SMS sent successfully!");
//       } else {
//         Alert.alert("Error", "SMS service is not available on this device");
//       }

//       setGoodsName("");
//       setQuantity("");
//       setGoodsList([]);
//       setTransportName("");
//       setTransportNumber("");
//       setReceiverName("");
//       setReceiverNumber("");
//       setDate("");
//       setEditIndex(null);
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Failed to save data");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView 
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.headerTop}>
//             <Text style={styles.title}>Goods Dispatch Manager</Text>
//             <TouchableOpacity
//               style={styles.settingsButton}
//               onPress={() => setShowSettings(!showSettings)}
//             >
//               <Ionicons name="settings" size={24} color="#fff" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.subtitle}>Track and manage your shipments</Text>

//           {showSettings && (
//             <View style={styles.settingsDropdown}>
//               <TouchableOpacity
//                 style={styles.settingsOption}
//                 onPress={() => router.push("/addClient")}
//               >
//                 <Ionicons name="person-add" size={18} color="#1976d2" />
//                 <Text style={styles.settingsOptionText}>Add Client</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.settingsOption}
//                 onPress={() => router.push("/addTransport")}
//               >
//                 <Ionicons name="bus" size={18} color="#1976d2" />
//                 <Text style={styles.settingsOptionText}>Add Transport</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Form */}
//         <View style={styles.formContainer}>
//           <Text style={styles.sectionTitle}>
//             {editIndex !== null ? "Edit Entry" : "New Dispatch Entry"}
//           </Text>

//           {/* Goods */}
//           <View style={styles.goodsSection}>
//             <Text style={styles.sectionSubtitle}>Goods Details</Text>
//             <View style={styles.inputRow}>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Goods Name</Text>
//                 <TextInput
//                   placeholder="Enter goods name"
//                   style={styles.input}
//                   value={goodsName}
//                   onChangeText={setGoodsName}
//                 />
//               </View>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Quantity</Text>
//                 <TextInput
//                   placeholder="Enter quantity"
//                   style={styles.input}
//                   value={quantity}
//                   onChangeText={setQuantity}
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>
//             <TouchableOpacity
//               style={styles.addGoodsButton}
//               onPress={handleAddGoods}
//             >
//               <Ionicons name="add-circle" size={20} color="#1976d2" />
//               <Text style={styles.addGoodsButtonText}>Add Goods</Text>
//             </TouchableOpacity>

//             {goodsList.length > 0 &&
//               goodsList.map((item, index) => (
//                 <View key={index} style={styles.goodsItemContent}>
//                   <Text>{item.goodsName} - {item.quantity}</Text>
//                   <TouchableOpacity onPress={() => handleRemoveGoods(index)}>
//                     <Ionicons name="close-circle" size={18} color="#d32f2f" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//           </View>

//           {/* Transport */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Transport Name</Text>
//             <TextInput
//               placeholder="Transport company"
//               style={styles.input}
//               value={transportName}
//               onChangeText={(text) => {
//                 setTransportName(text);
//                 setShowTransportDropdown(true);
//               }}
//             />
//             {showTransportDropdown && transportSuggestions.length > 0 && (
//               <View style={styles.dropdownWrapper}>
//                 <ScrollView 
//                   style={styles.dropdownScrollView}
//                   nestedScrollEnabled={true}
//                   keyboardShouldPersistTaps="handled"
//                 >
//                   {transportSuggestions.map((item) => (
//                     <TouchableOpacity
//                       key={item._id}
//                       onPress={() => selectTransport(item)}
//                       style={styles.dropdownItem}
//                     >
//                       <Text>{item.companyName}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             )}
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Driver Number</Text>
//             <TextInput
//               placeholder="Driver's phone"
//               style={styles.input}
//               value={transportNumber}
//               onChangeText={setTransportNumber}
//               keyboardType="phone-pad"
//             />
//           </View>

//           {/* Receiver */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Receiver Name</Text>
//             <TextInput
//               placeholder="Receiver's name"
//               style={styles.input}
//               value={receiverName}
//               onChangeText={(text) => {
//                 setReceiverName(text);
//                 setShowClientDropdown(true);
//               }}
//             />
//             {showClientDropdown && clientSuggestions.length > 0 && (
//               <View style={styles.dropdownWrapper}>
//                 <ScrollView 
//                   style={styles.dropdownScrollView}
//                   nestedScrollEnabled={true}
//                   keyboardShouldPersistTaps="handled"
//                 >
//                   {clientSuggestions.map((item) => (
//                     <TouchableOpacity
//                       key={item._id}
//                       onPress={() => selectClient(item)}
//                       style={styles.dropdownItem}
//                     >
//                       <Text>{item.name}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             )}
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Receiver Number</Text>
//             <TextInput
//               placeholder="Receiver's phone"
//               style={styles.input}
//               value={receiverNumber}
//               onChangeText={setReceiverNumber}
//               keyboardType="phone-pad"
//             />
//           </View>

//           {/* Date */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Dispatch Date</Text>
//             <TextInput
//               placeholder="YYYY-MM-DD"
//               style={styles.input}
//               value={date}
//               onChangeText={setDate}
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, styles.primaryButton]}
//             onPress={handleAddAndSendSMS}
//           >
//             <Ionicons name="add-circle" size={20} color="#fff" />
//             <Text style={styles.buttonText}>Add & Send SMS</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.searchButton]}
//             onPress={() => router.push("/search")}
//           >
//             <Ionicons name="search" size={20} color="#fff" />
//             <Text style={styles.buttonText}>Search Dispatch</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default Dashboard;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f0f8ff" },
//   header: { backgroundColor: "#1976d2", padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
//   headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
//   title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" },
//   subtitle: { fontSize: 14, color: "#e3f2fd", textAlign: "center" },
//   goodsSection: { marginBottom: 16 },
//   searchButton: { backgroundColor: "#388e3c" },
//   settingsButton: { padding: 8, position: "absolute", right: 0, top: -5 },
//   settingsDropdown: { backgroundColor: "#fff", marginTop: 15, borderRadius: 12, padding: 8 },
//   settingsOption: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 8 },
//   settingsOptionText: { fontSize: 16, color: "#1976d2", fontWeight: "600", marginLeft: 10 },
//   formContainer: { backgroundColor: "#fff", margin: 16, padding: 20, borderRadius: 16 },
//   sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1976d2", marginBottom: 15 },
//   sectionSubtitle: { fontSize: 16, fontWeight: "bold", color: "#1976d2", marginBottom: 12 },
//   inputRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
//   inputContainer: { marginBottom: 12, position: 'relative' },
//   label: { fontSize: 14, fontWeight: "600", color: "#1976d2", marginBottom: 6 },
//   input: { borderWidth: 1.5, borderColor: "#e3f2fd", borderRadius: 12, padding: 12, backgroundColor: "#fafafa", fontSize: 14, color: "#1565c0" },
//   addGoodsButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderWidth: 1.5, borderColor: "#1976d2", borderRadius: 12, backgroundColor: "#e3f2fd", marginBottom: 12 },
//   addGoodsButtonText: { color: "#1976d2", fontSize: 14, fontWeight: "bold", marginLeft: 6 },
//   goodsItemContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6, padding: 8, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#e3f2fd" },
//   dropdownWrapper: {
//     position: 'absolute',
//     top: '100%',
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e3f2fd',
//     borderRadius: 8,
//     maxHeight: 120,
//     zIndex: 1000,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   dropdownScrollView: {
//     maxHeight: 120,
//   },
//   dropdownItem: { 
//     padding: 10, 
//     borderBottomWidth: 1, 
//     borderBottomColor: "#e3f2fd",
//   },
//   button: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     justifyContent: "center", 
//     padding: 12, 
//     borderRadius: 12, 
//     flex: 1, 
//     marginVertical: 8, 
//     backgroundColor: "#1976d2" 
//   },
//   primaryButton: { backgroundColor: "#1976d2" },
//   buttonText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginLeft: 6 },
// });





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

const BACKEND_URL = "http://10.235.82.52:5000/api";

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