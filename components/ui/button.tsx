/**
 * Button Component
 *
 * A flexible button component with multiple variants and sizes.
 * Supports theming (light/dark mode).
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Button text (alternative to children) */
  title?: string;
  /** Button content */
  children?: React.ReactNode;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Loading state */
  loading?: boolean;
  /** Custom style for the button container */
  style?: StyleProp<ViewStyle>;
  /** Custom style for the button text */
  textStyle?: StyleProp<TextStyle>;
}

const VARIANT_COLORS = {
  primary: {
    background: '#0a7ea4',
    text: '#ffffff',
    border: '#0a7ea4',
    pressedBackground: '#086e8e',
  },
  secondary: {
    background: '#6c757d',
    text: '#ffffff',
    border: '#6c757d',
    pressedBackground: '#5a6268',
  },
  outline: {
    background: 'transparent',
    text: '#0a7ea4',
    border: '#0a7ea4',
    pressedBackground: 'rgba(10, 126, 164, 0.1)',
  },
  danger: {
    background: '#dc3545',
    text: '#ffffff',
    border: '#dc3545',
    pressedBackground: '#c82333',
  },
};

const SIZE_STYLES = {
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    fontSize: 18,
  },
};

export function Button({
  title,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
  ...pressableProps
}: ButtonProps) {
  const colors = VARIANT_COLORS[variant];
  const sizeStyles = SIZE_STYLES[size];

  const isDisabled = disabled || loading;

  const buttonContent = children ?? title;

  return (
    <Pressable
      testID={testID}
      disabled={isDisabled}
      accessibilityLabel={
        accessibilityLabel ?? (typeof buttonContent === 'string' ? buttonContent : undefined)
      }
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            variant === 'outline'
              ? pressed
                ? colors.pressedBackground
                : colors.background
              : pressed
                ? colors.pressedBackground
                : colors.background,
          borderColor: colors.border,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator
          testID={`${testID}-loading`}
          color={colors.text}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: colors.text,
              fontSize: sizeStyles.fontSize,
            },
            textStyle,
          ]}
        >
          {buttonContent}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
