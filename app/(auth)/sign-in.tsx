/**
 * Sign In Screen
 *
 * User authentication screen with email and password.
 */

import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { isApiError } from '@/services/api/client';

export default function SignInScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.replace('/(tabs)');
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
            <ThemedText type="title">Welcome Back</ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
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
              testID="sign-in-email"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              testID="sign-in-password"
            />

            {error && <ThemedText style={styles.error}>{error}</ThemedText>}

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={isLoading}
              disabled={isLoading}
              testID="sign-in-button"
            />

            <Link href="/(auth)/forgot-password" asChild>
              <Button title="Forgot Password?" variant="outline" style={styles.forgotButton} />
            </Link>
          </View>

          <View style={styles.footer}>
            <ThemedText>Don't have an account? </ThemedText>
            <Link href="/(auth)/sign-up" asChild>
              <ThemedText type="link">Sign Up</ThemedText>
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
    gap: 8,
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 8,
  },
  forgotButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
});
