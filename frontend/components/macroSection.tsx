import React  from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";


interface MacroSectionProps {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

const MacroSection: React.FC<MacroSectionProps> = ({
    calories,
    protein,
    carbs,
    fat
}) => {
    return (
        <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">Daily Macros</Text>
            <View className="flex-row justify-around">
                <View className="items-center">
                    <Text className="text-xl font-bold text-blue-500">{calories}</Text>
                    <Text className="text-xs text-gray-600 mt-1">Calories</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xl font-bold text-blue-500">{protein}g</Text>
                    <Text className="text-xs text-gray-600 mt-1">Protein</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xl font-bold text-blue-500">{carbs}g</Text>
                    <Text className="text-xs text-gray-600 mt-1">Carbs</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xl font-bold text-blue-500">{fat}g</Text>
                    <Text className="text-xs text-gray-600 mt-1">Fat</Text>
                </View>
            </View>
        </View>
    );
};

export default MacroSection;
