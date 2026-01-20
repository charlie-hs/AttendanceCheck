/**
 * Input Component
 *
 * A flexible text input component with label, error state, and password toggle.
 * Supports theming (light/dark mode).
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface InputProps extends TextInputProps {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Error text style */
  errorStyle?: StyleProp<TextStyle>;
}

export function Input({
  label,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
  style,
  testID,
  secureTextEntry,
  accessibilityLabel,
  ...textInputProps
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const hasError = !!error;
  const isSecure = secureTextEntry && !isPasswordVisible;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          style={[styles.label, { color: textColor }, labelStyle]}
        >
          {label}
        </Text>
      )}

      <View
        testID={testID ? `${testID}-container` : undefined}
        style={[
          styles.inputContainer,
          {
            borderColor: hasError ? '#dc3545' : '#ccc',
            backgroundColor,
          },
        ]}
      >
        <TextInput
          testID={testID}
          style={[
            styles.input,
            { color: textColor },
            secureTextEntry && styles.inputWithToggle,
            style,
          ]}
          secureTextEntry={isSecure}
          placeholderTextColor={iconColor}
          accessibilityLabel={accessibilityLabel ?? label}
          {...textInputProps}
        />

        {secureTextEntry && (
          <Pressable
            testID={testID ? `${testID}-toggle-password` : undefined}
            onPress={togglePasswordVisibility}
            style={styles.toggleButton}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            <Text style={[styles.toggleText, { color: iconColor }]}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}
      </View>

      {hasError && (
        <Text testID={testID ? `${testID}-error` : undefined} style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithToggle: {
    paddingRight: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
});
