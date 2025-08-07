import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

interface DrawerToggleProps {
  /**
   * Custom text to display. Defaults to "☰"
   */
  title?: string;
  /**
   * Custom styles for the button container
   */
  buttonStyle?: ViewStyle;
  /**
   * Custom styles for the text
   */
  textStyle?: TextStyle;
  /**
   * Callback function called when button is pressed (optional)
   */
  onPress?: () => void;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

const DrawerToggle: React.FC<DrawerToggleProps> = ({
  title = "☰",
  buttonStyle,
  textStyle,
  onPress,
  disabled = false,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44, // Accessibility minimum touch target
    minHeight: 44,
  },
  text: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default DrawerToggle;