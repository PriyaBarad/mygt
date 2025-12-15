// // import { Image } from 'expo-image';
// // import { Platform, StyleSheet } from 'react-native';

// // import { HelloWave } from '@/components/HelloWave';
// // import ParallaxScrollView from '@/components/ParallaxScrollView';
// // import { ThemedText } from '@/components/ThemedText';
// // import { ThemedView } from '@/components/ThemedView';

// // export default function HomeScreen() {
// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         <ThemedText type="title">Welcome!</ThemedText>
// //         <HelloWave />
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //         <ThemedText>
// //           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //           Press{' '}
// //           <ThemedText type="defaultSemiBold">
// //             {Platform.select({
// //               ios: 'cmd + d',
// //               android: 'cmd + m',
// //               web: 'F12',
// //             })}
// //           </ThemedText>{' '}
// //           to open developer tools.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //         <ThemedText>
// //           {`Tap the Explore tab to learn more about what's included in this starter app.`}
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //         <ThemedText>
// //           {`When you're ready, run `}
// //           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //         </ThemedText>
// //       </ThemedView>
// //     </ParallaxScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// // });







// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";

// export default function Welcome() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to Amrut Automobiles</Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => router.push("../dashboard")}
//       >
//         <Text style={styles.buttonText}>Get Started</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     padding: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 30,
//     textAlign: "center",
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
// });



import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

// Import your background image (place it in assets folder)

const backgroundImage = require("../../assets/images/Mobile.png");



export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground
  source={backgroundImage}
  style={styles.background}
  resizeMode="cover" // <-- change this from "cover" to "contain"
>
  <View style={styles.overlay}>
    <Text style={styles.title}>Welcome to Amrut Automobiles</Text>

    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("../dashboard")}
    >
      <Text style={styles.buttonText}>Get Started</Text>
    </TouchableOpacity>
  </View>
</ImageBackground>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 70, // push slightly lower
    backgroundColor: "rgba(0,0,0,0.3)", // optional: semi-transparent overlay
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
