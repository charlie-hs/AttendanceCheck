/**
 * Input Component Tests
 *
 * TDD: RED phase - Write failing tests first
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { Input } from '@/components/ui/input';

describe('Input', () => {
  describe('rendering', () => {
    it('should render basic input', () => {
      const { getByTestId } = render(<Input testID="input" />);
      expect(getByTestId('input')).toBeTruthy();
    });

    it('should render with placeholder', () => {
      const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });
  });

  describe('label', () => {
    it('should render with label', () => {
      const { getByText } = render(<Input label="Email" testID="input" />);
      expect(getByText('Email')).toBeTruthy();
    });

    it('should not render label when not provided', () => {
      const { queryByTestId } = render(<Input testID="input" />);
      expect(queryByTestId('input-label')).toBeNull();
    });
  });

  describe('error state', () => {
    it('should display error message', () => {
      const { getByText } = render(<Input error="Invalid email" testID="input" />);
      expect(getByText('Invalid email')).toBeTruthy();
    });

    it('should apply error styling when error is present', () => {
      const { getByTestId } = render(<Input error="Error" testID="input" />);
      expect(getByTestId('input-container')).toBeTruthy();
    });

    it('should not show error message when no error', () => {
      const { queryByTestId } = render(<Input testID="input" />);
      expect(queryByTestId('input-error')).toBeNull();
    });
  });

  describe('password input', () => {
    it('should hide text when secureTextEntry is true', () => {
      const { getByTestId } = render(<Input secureTextEntry testID="input" />);
      const input = getByTestId('input');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should show password toggle button when secureTextEntry', () => {
      const { getByTestId } = render(<Input secureTextEntry testID="input" />);
      expect(getByTestId('input-toggle-password')).toBeTruthy();
    });

    it('should toggle password visibility when toggle pressed', () => {
      const { getByTestId } = render(<Input secureTextEntry testID="input" />);
      const toggle = getByTestId('input-toggle-password');
      const input = getByTestId('input');

      // Initially hidden
      expect(input.props.secureTextEntry).toBe(true);

      // After pressing toggle, should show
      fireEvent.press(toggle);
      expect(getByTestId('input').props.secureTextEntry).toBe(false);

      // After pressing again, should hide
      fireEvent.press(toggle);
      expect(getByTestId('input').props.secureTextEntry).toBe(true);
    });
  });

  describe('value handling', () => {
    it('should call onChangeText when text changes', () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(<Input onChangeText={onChangeText} testID="input" />);

      fireEvent.changeText(getByTestId('input'), 'new value');
      expect(onChangeText).toHaveBeenCalledWith('new value');
    });

    it('should display provided value', () => {
      const { getByDisplayValue } = render(<Input value="test value" testID="input" />);
      expect(getByDisplayValue('test value')).toBeTruthy();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when editable is false', () => {
      const { getByTestId } = render(<Input editable={false} testID="input" />);
      expect(getByTestId('input').props.editable).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have accessible label from label prop', () => {
      const { getByLabelText } = render(<Input label="Email" testID="input" />);
      expect(getByLabelText('Email')).toBeTruthy();
    });

    it('should support custom accessibilityLabel', () => {
      const { getByLabelText } = render(<Input accessibilityLabel="Custom label" testID="input" />);
      expect(getByLabelText('Custom label')).toBeTruthy();
    });
  });
});
