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
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(credentials);
      // Navigation will be handled by AuthProvider
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-gray-800 mb-2">TrackMyFood</Text>
            <Text className="text-lg text-gray-600">Welcome back!</Text>
          </View>

          {/* Login Form */}
          <View className="bg-white rounded-lg p-6 shadow-sm">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</Text>
            
            {/* Username Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Username</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your username"
                value={credentials.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your password"
                value={credentials.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`rounded-lg py-4 mb-4 ${
                loading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold ml-2">Logging in...</Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">Login</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
                <Text className="text-blue-500 font-semibold">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-gray-500 text-sm">
              Track your nutrition journey with ease
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
