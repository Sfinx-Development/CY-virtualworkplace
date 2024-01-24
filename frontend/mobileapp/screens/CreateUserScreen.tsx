import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";

export default function CreateUserScreen() {
  return (
    <View style={styles.container}>
      <Text>CreateUserScreen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
