/**
 * Card Component
 *
 * A flexible card component with header, body, and footer slots.
 * Supports theming (light/dark mode).
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface CardProps extends ViewProps {
  /** Card header content */
  header?: React.ReactNode;
  /** Card header title (alternative to header) */
  title?: string;
  /** Card header subtitle */
  subtitle?: string;
  /** Card body content (alternative to children) */
  body?: React.ReactNode;
  /** Card footer content */
  footer?: React.ReactNode;
  /** Card children (used as body if body prop not provided) */
  children?: React.ReactNode;
  /** Custom header style */
  headerStyle?: StyleProp<ViewStyle>;
  /** Custom body style */
  bodyStyle?: StyleProp<ViewStyle>;
  /** Custom footer style */
  footerStyle?: StyleProp<ViewStyle>;
  /** Elevation/shadow depth (0-5) */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

const ELEVATIONS: Record<number, ViewStyle> = {
  0: {},
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export function Card({
  header,
  title,
  subtitle,
  body,
  footer,
  children,
  style,
  headerStyle,
  bodyStyle,
  footerStyle,
  elevation = 2,
  ...viewProps
}: CardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const hasHeader = header || title || subtitle;
  const bodyContent = body ?? children;
  const hasBody = bodyContent !== undefined;
  const hasFooter = footer !== undefined;

  return (
    <View style={[styles.card, { backgroundColor }, ELEVATIONS[elevation], style]} {...viewProps}>
      {hasHeader && (
        <View style={[styles.header, headerStyle]}>
          {header ?? (
            <>
              {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
              {subtitle && <Text style={[styles.subtitle, { color: iconColor }]}>{subtitle}</Text>}
            </>
          )}
        </View>
      )}

      {hasBody && (
        <View style={[styles.body, hasHeader && styles.bodyWithHeader, bodyStyle]}>
          {bodyContent}
        </View>
      )}

      {hasFooter && <View style={[styles.footer, footerStyle]}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  body: {
    padding: 16,
  },
  bodyWithHeader: {
    paddingTop: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});
