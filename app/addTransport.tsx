// import React, { useState } from "react";
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
//   ActivityIndicator,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// const AddTransport = () => {
//   const router = useRouter();
  
//   const [companyName, setCompanyName] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [driverName, setDriverName] = useState("");
//   const [vehicleNumber, setVehicleNumber] = useState("");
//   const [loading, setLoading] = useState(false);

//   const BACKEND_URL = "http://10.235.82.52:5000/api/transports";
//   // const BACKEND_URL = "https://goodsnotifier-production.up.railway.app/api/transports";


//   const handleAddTransport = async () => {
//     if (!companyName.trim() || !contactNumber.trim()) {
//       Alert.alert("Error", "Please enter company name and contact number");
//       return;
//     }

//     if (contactNumber.length < 10) {
//       Alert.alert("Error", "Please enter a valid contact number");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(BACKEND_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           companyName: companyName.trim(),
//           contactNumber: contactNumber.trim(),
//           driverName: driverName.trim(),
//           vehicleNumber: vehicleNumber.trim(),
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", "Transport added successfully!", [
//           {
//             text: "OK",
//             onPress: () => router.back(),
//           },
//         ]);
//         // Clear form
//         setCompanyName("");
//         setContactNumber("");
//         setDriverName("");
//         setVehicleNumber("");
//       } else {
//         Alert.alert("Error", result.message || "Failed to add transport");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to connect to server");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <Ionicons name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.title}>Add New Transport</Text>
//           <View style={styles.placeholder} />
//         </View>

//         {/* Form Section */}
//         <View style={styles.formContainer}>
//           <Text style={styles.sectionTitle}>Transport Information</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Company Name *</Text>
//             <TextInput
//               placeholder="Enter transport company name"
//               style={styles.input}
//               value={companyName}
//               onChangeText={setCompanyName}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Contact Number *</Text>
//             <TextInput
//               placeholder="Enter contact number"
//               style={styles.input}
//               value={contactNumber}
//               onChangeText={setContactNumber}
//               keyboardType="phone-pad"
//               maxLength={10}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Driver Name</Text>
//             <TextInput
//               placeholder="Enter driver name (optional)"
//               style={styles.input}
//               value={driverName}
//               onChangeText={setDriverName}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Vehicle Number</Text>
//             <TextInput
//               placeholder="Enter vehicle number (optional)"
//               style={styles.input}
//               value={vehicleNumber}
//               onChangeText={setVehicleNumber}
//               autoCapitalize="characters"
//             />
//           </View>

//           {/* Add Button */}
//           <TouchableOpacity
//             style={[styles.addButton, loading && styles.disabledButton]}
//             onPress={handleAddTransport}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="bus" size={20} color="#fff" />
//                 <Text style={styles.addButtonText}>Add Transport</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           {/* Info Text */}
//           <View style={styles.infoContainer}>
//             <Ionicons name="information-circle" size={16} color="#1976d2" />
//             <Text style={styles.infoText}>
//               Fields marked with * are required
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default AddTransport;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f8ff",
//   },
//   header: {
//     backgroundColor: "#1976d2",
//     padding: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 20,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   backButton: {
//     padding: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     flex: 1,
//   },
//   placeholder: {
//     width: 40,
//   },
//   formContainer: {
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     padding: 20,
//     borderRadius: 16,
//     marginBottom: 20,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1976d2",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#1976d2",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1.5,
//     borderColor: "#e3f2fd",
//     borderRadius: 12,
//     padding: 12,
//     backgroundColor: "#fafafa",
//     fontSize: 14,
//     color: "#1565c0",
//   },
//   addButton: {
//     backgroundColor: "#1976d2",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 10,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   disabledButton: {
//     backgroundColor: "#90caf9",
//   },
//   addButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     marginLeft: 8,
//   },
//   infoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 16,
//     padding: 8,
//     backgroundColor: "#e3f2fd",
//     borderRadius: 8,
//   },
//   infoText: {
//     fontSize: 12,
//     color: "#1976d2",
//     marginLeft: 6,
//   },
// });




import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AddTransport = () => {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://10.34.28.52:5000/api/transports";
  // const BACKEND_URL = "https://goodsnotifier-production.up.railway.app/api/transports";

  const handleAddTransport = async () => {
    const trimmedCompany = companyName.trim();
    const trimmedNumber = contactNumber.trim();
    const trimmedDriver = driverName.trim();

    // Validate company name
    if (!trimmedCompany || !/^[A-Za-z ]+$/.test(trimmedCompany)) {
      Alert.alert("Error", "Company name must contain alphabets only");
      return;
    }

    // Validate driver name if provided
    if (trimmedDriver && !/^[A-Za-z ]+$/.test(trimmedDriver)) {
      Alert.alert("Error", "Driver name must contain alphabets only");
      return;
    }

    // Validate contact number
    if (!/^\d{10}$/.test(trimmedNumber)) {
      Alert.alert("Error", "Contact number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: trimmedCompany,
          contactNumber: "+91" + trimmedNumber, // prepend +91
          driverName: trimmedDriver,
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Transport added successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
        // Clear form
        setCompanyName("");
        setContactNumber("");
        setDriverName("");
        setVehicleNumber("");
      } else {
        Alert.alert("Error", result.message || "Failed to add transport");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Transport</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Transport Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Company Name *</Text>
            <TextInput
              placeholder="Enter transport company name"
              style={styles.input}
              value={companyName}
              onChangeText={(text) => {
                const formatted = text.replace(/[^A-Za-z ]/g, "");
                setCompanyName(formatted);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              placeholder="Enter contact number"
              style={styles.input}
              value={contactNumber}
              onChangeText={(text) => {
                const formatted = text.replace(/[^0-9]/g, "").slice(0, 10);
                setContactNumber(formatted);
              }}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Driver Name</Text>
            <TextInput
              placeholder="Enter driver name (optional)"
              style={styles.input}
              value={driverName}
              onChangeText={(text) => {
                const formatted = text.replace(/[^A-Za-z ]/g, "");
                setDriverName(formatted);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Vehicle Number</Text>
            <TextInput
              placeholder="Enter vehicle number (optional)"
              style={styles.input}
              value={vehicleNumber}
              onChangeText={(text) => setVehicleNumber(text.toUpperCase())}
              autoCapitalize="characters"
            />
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addButton, loading && styles.disabledButton]}
            onPress={handleAddTransport}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="bus" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Transport</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={16} color="#1976d2" />
            <Text style={styles.infoText}>
              Fields marked with * are required
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTransport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  header: {
    backgroundColor: "#1976d2",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976d2",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e3f2fd",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fafafa",
    fontSize: 14,
    color: "#1565c0",
  },
  addButton: {
    backgroundColor: "#1976d2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: "#90caf9",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 8,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#1976d2",
    marginLeft: 6,
  },
});
