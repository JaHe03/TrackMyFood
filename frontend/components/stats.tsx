import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const Stats = () => {
  return (
    <ScrollView className="flex-1 bg-white p-4">
        <View>
            <Text className="text-center text-2xl font-bold text-gray-800">Statistics</Text>
            {/* user stats content goes here */}
            {/* charts, graphs, summaries */}

            <View className="mt-4">
                <Text className="text-center text-lg font-semibold text-gray-700"> Weekly Stats </Text>
                {/* Weekly stats content goes here */}
                <View className="mt-2">
                    <Text className="text-center text-gray-600"> No data available </Text>
                </View>
            </View>
            <View>
                <Text className="text-center text-lg font-semibold text-gray-700"> Monthly Stats </Text>
                {/* Monthly stats content goes here */}
                <View className="mt-2">
                    <Text className="text-center text-gray-600"> No data available </Text>
                </View>
            </View>
            <View>
                <Text className="text-center text-lg font-semibold text-gray-700"> Yearly Stats </Text>
                {/* Yearly stats content goes here */}
                <View className="mt-2">
                    <Text className="text-center text-gray-600"> No data available </Text>
                </View>
            </View>
        </View>
    </ScrollView>
  )
}

export default Stats