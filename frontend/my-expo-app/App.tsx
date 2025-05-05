import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import "./global.css"; // Ensure this import is here and correct

export default function App() {
  return (
    // Using NativeWind's className
    <View className="flex-1 items-center justify-center bg-green-500">
      <Text className="text-white text-lg font-bold">NativeWind Test</Text>
      <StatusBar style="auto" />
    </View>
  );
}