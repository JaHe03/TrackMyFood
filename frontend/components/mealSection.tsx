import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface MealSectionProps {
 
  mealName: string;
  
  foods?: Array<{
    id: string;
    name: string;
    calories: number;
  }>;
  
  onAddFood?: () => void;
  
  emptyMessage?: string;
}

const MealSection: React.FC<MealSectionProps> = ({
  mealName,
  foods = [],
  onAddFood,
  emptyMessage = "No foods logged yet"
}) => {
  return (
    <View className="bg-white rounded-lg mb-3 overflow-hidden">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-800">{mealName}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-3 py-1.5 rounded"
          onPress={onAddFood}
        >
          <Text className="text-white text-sm font-semibold">+ Add Food</Text>
        </TouchableOpacity>
      </View>
      <View className="p-4 min-h-[50px] justify-center">
        {foods.length === 0 ? (
          <Text className="text-gray-500 italic text-center">{emptyMessage}</Text>
        ) : (
          <View>
            {foods.map((food) => (
              <View key={food.id} className="flex-row justify-between items-center py-2">
                <Text className="text-gray-800">{food.name}</Text>
                <Text className="text-gray-600">{food.calories} cal</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default MealSection;
