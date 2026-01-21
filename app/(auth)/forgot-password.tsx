/**
 * Forgot Password Screen
 *
 * Password reset request screen.
 */

import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { authApi } from '@/services/api/auth';
import { isApiError } from '@/services/api/client';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="title">Check Your Email</ThemedText>
          <ThemedText style={styles.message}>
            We've sent a password reset link to {email}. Please check your inbox and follow the
            instructions.
          </ThemedText>
          <Button title="Back to Sign In" onPress={() => router.back()} style={styles.button} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title">Forgot Password</ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your email and we'll send you a link to reset your password.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={error ?? undefined}
              testID="forgot-password-email"
            />

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              testID="forgot-password-button"
            />

            <Button
              title="Back to Sign In"
              variant="outline"
              onPress={() => router.back()}
              style={styles.backButton}
            />
          </View>
        </View>
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
  content: {
    flex: 1,
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
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  message: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 8,
  },
});
