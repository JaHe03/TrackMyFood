import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
    height: '',
    currWeight: '',
    activityLevel: '',
    unitPreference: 'MET',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const activityLevels = [
    { value: 'SED', label: 'Sedentary (little or no exercise)' },
    { value: 'LAC', label: 'Lightly active (light exercise 1-3 days/week)' },
    { value: 'MAC', label: 'Moderately active (moderate exercise 3-5 days/week)' },
    { value: 'VAC', label: 'Very active (hard exercise 6-7 days/week)' },
    { value: 'EAC', label: 'Extra active (very hard exercise & physical job)' },
  ];

  const handleRegister = async () => {
    // Validation
    if (!formData.username || !formData.email || !formData.password1 || !formData.password2) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password1 !== formData.password2) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password1.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      
      const registerData = {
        ...formData,
        height: formData.height ? parseFloat(formData.height) : undefined,
        currWeight: formData.currWeight ? parseFloat(formData.currWeight) : undefined,
      };

      await register(registerData);
      // Navigation will be handled by AuthProvider
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-gray-800 mb-2">Join TrackMyFood</Text>
            <Text className="text-gray-600">Start your nutrition journey today</Text>
          </View>

          {/* Registration Form */}
          <View className="bg-white rounded-lg p-6 shadow-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Create Account</Text>
            
            {/* Basic Information */}
            <Text className="text-lg font-semibold text-gray-700 mb-3">Basic Information</Text>
            
            <View className="mb-3">
              <Text className="text-gray-700 mb-1 font-medium">Username *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                placeholder="Choose a username"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View className="mb-3">
              <Text className="text-gray-700 mb-1 font-medium">Email *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-gray-700 mb-1 font-medium">First Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                  placeholder="First name"
                  value={formData.first_name}
                  onChangeText={(value) => handleInputChange('first_name', value)}
                  editable={!loading}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-1 font-medium">Last Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChangeText={(value) => handleInputChange('last_name', value)}
                  editable={!loading}
                />
              </View>
            </View>

            <View className="mb-3">
              <Text className="text-gray-700 mb-1 font-medium">Password *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                placeholder="Create a password"
                value={formData.password1}
                onChangeText={(value) => handleInputChange('password1', value)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">Confirm Password *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                placeholder="Confirm your password"
                value={formData.password2}
                onChangeText={(value) => handleInputChange('password2', value)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Physical Information */}
            <Text className="text-lg font-semibold text-gray-700 mb-3">Physical Information (Optional)</Text>
            
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-gray-700 mb-1 font-medium">Height (cm)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                  placeholder="e.g., 175"
                  value={formData.height}
                  onChangeText={(value) => handleInputChange('height', value)}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-1 font-medium">Weight (kg)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                  placeholder="e.g., 70"
                  value={formData.currWeight}
                  onChangeText={(value) => handleInputChange('currWeight', value)}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">Activity Level</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg">
                <Picker
                  selectedValue={formData.activityLevel}
                  onValueChange={(value: string) => handleInputChange('activityLevel', value)}
                  enabled={!loading}
                >
                  <Picker.Item label="Select activity level" value="" />
                  {activityLevels.map((level) => (
                    <Picker.Item key={level.value} label={level.label} value={level.value} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`rounded-lg py-3 mb-4 ${
                loading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold ml-2">Creating account...</Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
                <Text className="text-blue-500 font-semibold">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
