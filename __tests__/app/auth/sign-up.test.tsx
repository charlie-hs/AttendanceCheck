/**
 * Sign Up Screen Tests
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
const mockSignUp = jest.fn();
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
  }),
}));

// Mock isApiError
jest.mock('@/services/api/client', () => ({
  isApiError: (err: unknown) =>
    typeof err === 'object' && err !== null && 'statusCode' in err && 'message' in err,
}));

import SignUpScreen from '@/app/(auth)/sign-up';
import { router } from 'expo-router';

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render sign up form', () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);

    expect(getByText('Create Account')).toBeTruthy();
    expect(getByTestId('sign-up-name')).toBeTruthy();
    expect(getByTestId('sign-up-email')).toBeTruthy();
    expect(getByTestId('sign-up-password')).toBeTruthy();
    expect(getByTestId('sign-up-confirm-password')).toBeTruthy();
    expect(getByTestId('sign-up-button')).toBeTruthy();
  });

  it('should show error when name is empty', async () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('sign-up-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-up-password'), 'Password123');
    fireEvent.changeText(getByTestId('sign-up-confirm-password'), 'Password123');
    fireEvent.press(getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
    });

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('should show error when email is invalid', async () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('sign-up-name'), 'Test User');
    fireEvent.changeText(getByTestId('sign-up-email'), 'invalid-email');
    fireEvent.changeText(getByTestId('sign-up-password'), 'Password123');
    fireEvent.changeText(getByTestId('sign-up-confirm-password'), 'Password123');
    fireEvent.press(getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('should show error when passwords do not match', async () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('sign-up-name'), 'Test User');
    fireEvent.changeText(getByTestId('sign-up-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-up-password'), 'Password123');
    fireEvent.changeText(getByTestId('sign-up-confirm-password'), 'Different123');
    fireEvent.press(getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('should show error for weak password', async () => {
    const { getByTestId, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('sign-up-name'), 'Test User');
    fireEvent.changeText(getByTestId('sign-up-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-up-password'), 'weak');
    fireEvent.changeText(getByTestId('sign-up-confirm-password'), 'weak');
    fireEvent.press(getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(getByText('Password must be at least 8 characters')).toBeTruthy();
    });

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('should call signUp with valid data', async () => {
    mockSignUp.mockResolvedValueOnce({});

    const { getByTestId } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('sign-up-name'), 'Test User');
    fireEvent.changeText(getByTestId('sign-up-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-up-password'), 'Password123');
    fireEvent.changeText(getByTestId('sign-up-confirm-password'), 'Password123');
    fireEvent.press(getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123', 'Test User');
    });
  });

  it('should navigate to tabs on successful sign up', async () => {
    mockSignUp.mockResolvedValueOnce({});

    const { getByTestId } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('sign-up-name'), 'Test User');
    fireEvent.changeText(getByTestId('sign-up-email'), 'test@example.com');
    fireEvent.changeText(getByTestId('sign-up-password'), 'Password123');
    fireEvent.changeText(getByTestId('sign-up-confirm-password'), 'Password123');
    fireEvent.press(getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('should show API error message on sign up failure', async () => {
    mockSignUp.mockRejectedValueOnce({
      message: 'Email already exists',
      statusCode: 400,
    });

    const { getByTestId, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId('sign-up-name'), 'Test User');
    fireEvent.changeText(getByTestId('sign-up-email'), 'existing@example.com');
    fireEvent.changeText(getByTestId('sign-up-password'), 'Password123');
    fireEvent.changeText(getByTestId('sign-up-confirm-password'), 'Password123');
    fireEvent.press(getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(getByText('Email already exists')).toBeTruthy();
    });
  });
});
