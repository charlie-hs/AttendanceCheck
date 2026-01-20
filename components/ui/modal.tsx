/**
 * Modal Component
 *
 * A flexible modal component with backdrop and close button.
 * Supports theming (light/dark mode).
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  type ModalProps as RNModalProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface ModalProps extends Omit<RNModalProps, 'onRequestClose'> {
  /** Whether the modal is visible */
  visible: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children?: React.ReactNode;
  /** Show close button in header */
  showCloseButton?: boolean;
  /** Close on backdrop press */
  closeOnBackdropPress?: boolean;
  /** Custom content style */
  contentStyle?: StyleProp<ViewStyle>;
  /** Custom header style */
  headerStyle?: StyleProp<ViewStyle>;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  contentStyle,
  headerStyle,
  animationType = 'fade',
  transparent = true,
  testID,
  ...modalProps
}: ModalProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      testID={testID}
      {...modalProps}
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleBackdropPress}
        testID={testID ? `${testID}-backdrop` : undefined}
      >
        <Pressable
          style={[styles.content, { backgroundColor }, contentStyle]}
          onPress={(e) => e.stopPropagation()}
          testID={testID ? `${testID}-content` : undefined}
        >
          {(title || showCloseButton) && (
            <View style={[styles.header, headerStyle]}>
              {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  style={styles.closeButton}
                  testID={testID ? `${testID}-close` : undefined}
                  accessibilityLabel="Close modal"
                  accessibilityRole="button"
                >
                  <Text style={[styles.closeText, { color: iconColor }]}>✕</Text>
                </Pressable>
              )}
            </View>
          )}

          <View style={styles.body}>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 12,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '300',
  },
  body: {
    padding: 16,
    paddingTop: 8,
  },
});
