import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import React from 'react'

const Profile = () => {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View>
        <Text className="text-center text-2xl font-bold text-gray-800">(user.name)</Text>
      </View>
    </ScrollView>
  )
}

export default Profile