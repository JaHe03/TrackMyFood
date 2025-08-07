import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">
      <ActivityIndicator size="large" color="#007AFF" />
      <Text className="mt-4 text-gray-600 text-lg">Loading...</Text>
      <Text className="mt-2 text-gray-500 text-center px-8">
        Initializing TrackMyFood
      </Text>
    </View>
  );
}
