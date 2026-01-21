/**
 * Sign In Screen Tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  Link: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => children,
}));

// Mock auth hook
const mockSignIn = jest.fn();
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

// Mock isApiError
jest.mock('@/services/api/client', () => ({
  isApiError: (err: unknown) =>
    typeof err === 'object' && err !== null && 'statusCode' in err && 'message' in err,
}));

import SignInScreen from '@/app/(auth)/sign-in';
import { router } from 'expo-router';

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render sign in form', () => {
    const { getByTestId, getByText } = render(<SignInScreen />);

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByTestId('sign-in-email')).toBeTruthy();
    expect(getByTestId('sign-in-password')).toBeTruthy();
    expect(getByTestId('sign-in-button')).toBeTruthy();
  });

  it('should show error when fields are empty', async () => {
    const { getByTestId, getByText } = render(<SignInScreen />);

    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(getByText('Please enter email and password')).toBeTruthy();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('should call signIn with email and password', async () => {
    mockSignIn.mockResolvedValueOnce({});

    const { getByTestId } = render(<SignInScreen />);

    fireEvent.changeText(getByTestId('sign-in-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-in-password'), 'password123');
    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should navigate to tabs on successful sign in', async () => {
    mockSignIn.mockResolvedValueOnce({});

    const { getByTestId } = render(<SignInScreen />);

    fireEvent.changeText(getByTestId('sign-in-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-in-password'), 'password123');
    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('should show error message on sign in failure', async () => {
    mockSignIn.mockRejectedValueOnce({
      message: 'Invalid credentials',
      statusCode: 401,
    });

    const { getByTestId, getByText } = render(<SignInScreen />);

    fireEvent.changeText(getByTestId('sign-in-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-in-password'), 'wrongpassword');
    fireEvent.press(getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });
});
