/**
 * Sign Up Screen
 *
 * User registration screen with name, email, and password.
 */

import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { isApiError } from '@/services/api/client';
import { validatePassword } from '@/types';

export default function SignUpScreen() {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      // Generate error message based on which validation failed
      if (!passwordValidation.minLength) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!passwordValidation.hasUppercase) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!passwordValidation.hasLowercase) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!passwordValidation.hasNumber) {
        newErrors.password = 'Password must contain at least one number';
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      router.replace('/(tabs)');
    } catch (err) {
      if (isApiError(err)) {
        if (err.errors) {
          setErrors(
            Object.fromEntries(
              Object.entries(err.errors).map(([key, messages]) => [key, messages[0]])
            )
          );
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ThemedText type="title">Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>Sign up to get started</ThemedText>
          </View>

          <View style={styles.form}>
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              error={errors.name}
              testID="sign-up-name"
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              testID="sign-up-email"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              error={errors.password}
              testID="sign-up-password"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              error={errors.confirmPassword}
              testID="sign-up-confirm-password"
            />

            {errors.general && <ThemedText style={styles.error}>{errors.general}</ThemedText>}

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
              testID="sign-up-button"
            />
          </View>

          <View style={styles.footer}>
            <ThemedText>Already have an account? </ThemedText>
            <Link href="/(auth)/sign-in" asChild>
              <ThemedText type="link">Sign In</ThemedText>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  form: {
    gap: 4,
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
});
