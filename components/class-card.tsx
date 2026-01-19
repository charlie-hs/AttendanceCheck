/**
 * ClassCard Component
 *
 * Displays a single class with reservation functionality
 */

import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import type { CrossFitClass } from '@/types/models';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ClassCardProps {
  class: CrossFitClass;
  onReserve?: (classId: string) => void;
  onCancel?: (classId: string) => void;
  isReserved?: boolean;
  showReserveButton?: boolean;
}

export function ClassCard({
  class: classData,
  onReserve,
  onCancel,
  isReserved = false,
  showReserveButton = true,
}: ClassCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor(
    { light: '#f5f5f5', dark: '#2a2a2a' },
    'background'
  );

  const startTime = new Date(classData.startTime);
  const endTime = new Date(classData.endTime);
  const spotsLeft = classData.maxCapacity - classData.currentReservations;
  const isFull = spotsLeft <= 0;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleReserve = async () => {
    if (isFull) {
      Alert.alert('Class Full', 'This class is already at maximum capacity.');
      return;
    }

    setIsLoading(true);
    try {
      await onReserve?.(classData.id);
    } catch (error) {
      console.error('Error reserving class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel your reservation for this class?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await onCancel?.(classData.id);
            } catch (error) {
              console.error('Error canceling reservation:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={[styles.card, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {classData.title}
        </ThemedText>
        {isReserved && (
          <View style={[styles.badge, { backgroundColor: tintColor }]}>
            <Text style={styles.badgeText}>Reserved</Text>
          </View>
        )}
      </View>

      {/* Coach Info */}
      <View style={styles.row}>
        <ThemedText style={styles.label}>Coach:</ThemedText>
        <ThemedText style={styles.value}>{classData.coach.user.name}</ThemedText>
      </View>

      {/* Date & Time */}
      <View style={styles.row}>
        <ThemedText style={styles.label}>Date:</ThemedText>
        <ThemedText style={styles.value}>{formatDate(startTime)}</ThemedText>
      </View>

      <View style={styles.row}>
        <ThemedText style={styles.label}>Time:</ThemedText>
        <ThemedText style={styles.value}>
          {formatTime(startTime)} - {formatTime(endTime)}
        </ThemedText>
      </View>

      {/* Capacity */}
      <View style={styles.row}>
        <ThemedText style={styles.label}>Spots:</ThemedText>
        <ThemedText
          style={[
            styles.value,
            isFull && { color: '#ef4444' },
            spotsLeft <= 3 && spotsLeft > 0 && { color: '#f59e0b' },
          ]}
        >
          {spotsLeft} / {classData.maxCapacity} available
        </ThemedText>
      </View>

      {/* Description */}
      {classData.description && (
        <ThemedText style={styles.description}>{classData.description}</ThemedText>
      )}

      {/* Action Button */}
      {showReserveButton && (
        <View style={styles.buttonContainer}>
          {!isReserved ? (
            <Pressable
              style={[
                styles.button,
                { backgroundColor: isFull ? '#9ca3af' : tintColor },
              ]}
              onPress={handleReserve}
              disabled={isFull || isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Reserving...' : isFull ? 'Class Full' : 'Reserve Spot'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {isLoading ? 'Canceling...' : 'Cancel Reservation'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    width: 80,
  },
  value: {
    fontSize: 14,
    flex: 1,
  },
  description: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#ef4444',
  },
});
