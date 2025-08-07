import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import MealSection from "../../components/mealSection";
import WaterIntake from "../../components/waterIntake";
import MacroSection from "../../components/macroSection";

export default function Index() {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Daily Summary Header */}
      <View className="bg-white p-4 rounded-lg mb-4 items-center">
        <Text className="text-2xl font-bold text-gray-800">Today's Log</Text>
        <Text className="text-base text-gray-600 mt-1">{new Date().toLocaleDateString()}</Text>
      </View>

      {/* Macro Info Section */}
      <View className="bg-white p-4 rounded-lg mb-4">
        <MacroSection 
          calories={0}
          protein={0}
          carbs={0}
          fat={0}
        />
      </View>

      {/* Meals Section */}
      <View className="mb-4">
        <MealSection 
          mealName="Breakfast"
          onAddFood={() => console.log('Add breakfast food')}
        />
        <MealSection 
          mealName="Lunch"
          onAddFood={() => console.log('Add lunch food')}
        />
        <MealSection 
          mealName="Dinner"
          onAddFood={() => console.log('Add dinner food')}
        />
      </View>

      {/* Water Intake Section */}
      <View className="mb-4">
        <WaterIntake 
          intake={0}
          onIncrease={() => console.log('Increase water intake')}
          onDecrease={() => console.log('Decrease water intake')}
        />
      </View>
    </ScrollView>
  );
}
