import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface WaterIntakeProps {
    intake: number;
    onIncrease: () => void;
    onDecrease: () => void;

}

const WaterIntake: React.FC<WaterIntakeProps> = ({ 
    intake, 
    onIncrease,
    onDecrease 
}) => {
    return (
        <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">Water Intake</Text>
            <View className="flex-row justify-between items-center">
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded"
                    onPress={onDecrease}
                >
                    <Text className="text-white text-lg">-</Text>
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-3xl font-bold text-blue-500">{intake}</Text>
                    <Text className="text-sm text-gray-600">glasses</Text>
                </View>
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded"
                    onPress={onIncrease}
                >
                    <Text className="text-white text-lg">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WaterIntake;