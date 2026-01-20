/**
 * Button Component Tests
 *
 * TDD: RED phase - Write failing tests first
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { getByText } = render(<Button title="Click me" />);
      expect(getByText('Click me')).toBeTruthy();
    });

    it('should render with children text', () => {
      const { getByText } = render(<Button>Submit</Button>);
      expect(getByText('Submit')).toBeTruthy();
    });
  });

  describe('variants', () => {
    it('should render primary variant by default', () => {
      const { getByTestId } = render(<Button title="Primary" testID="btn" />);
      const button = getByTestId('btn');
      expect(button).toBeTruthy();
    });

    it('should render secondary variant', () => {
      const { getByTestId } = render(<Button title="Secondary" variant="secondary" testID="btn" />);
      const button = getByTestId('btn');
      expect(button).toBeTruthy();
    });

    it('should render outline variant', () => {
      const { getByTestId } = render(<Button title="Outline" variant="outline" testID="btn" />);
      const button = getByTestId('btn');
      expect(button).toBeTruthy();
    });

    it('should render danger variant', () => {
      const { getByTestId } = render(<Button title="Danger" variant="danger" testID="btn" />);
      const button = getByTestId('btn');
      expect(button).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      const { getByTestId } = render(<Button title="Small" size="sm" testID="btn" />);
      expect(getByTestId('btn')).toBeTruthy();
    });

    it('should render medium size by default', () => {
      const { getByTestId } = render(<Button title="Medium" testID="btn" />);
      expect(getByTestId('btn')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByTestId } = render(<Button title="Large" size="lg" testID="btn" />);
      expect(getByTestId('btn')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="Press me" onPress={onPress} />);

      fireEvent.press(getByText('Press me'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="Disabled" onPress={onPress} disabled />);

      fireEvent.press(getByText('Disabled'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading indicator when loading', () => {
      const { getByTestId, queryByText } = render(<Button title="Submit" loading testID="btn" />);

      expect(getByTestId('btn-loading')).toBeTruthy();
      expect(queryByText('Submit')).toBeNull();
    });

    it('should be disabled when loading', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Submit" loading onPress={onPress} testID="btn" />
      );

      fireEvent.press(getByTestId('btn'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have accessible label', () => {
      const { getByLabelText } = render(<Button title="Submit" accessibilityLabel="Submit form" />);
      expect(getByLabelText('Submit form')).toBeTruthy();
    });

    it('should indicate disabled state', () => {
      const { getByRole } = render(<Button title="Disabled" disabled />);
      const button = getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });
});
