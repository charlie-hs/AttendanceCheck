/**
 * ReservationList Component
 *
 * Displays a list of reservations for coaches/admins
 */

import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import type { Reservation, ReservationStatus } from '@/types/models';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ReservationListProps {
  reservations: Reservation[];
  onMarkAttended?: (reservationId: string) => void;
  onMarkNoShow?: (reservationId: string) => void;
  emptyMessage?: string;
}

export function ReservationList({
  reservations,
  onMarkAttended,
  onMarkNoShow,
  emptyMessage = 'No reservations found',
}: ReservationListProps) {
  const backgroundColor = useThemeColor(
    { light: '#f5f5f5', dark: '#2a2a2a' },
    'background'
  );

  if (reservations.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReservationCard
          reservation={item}
          onMarkAttended={onMarkAttended}
          onMarkNoShow={onMarkNoShow}
          backgroundColor={backgroundColor}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContainer}
    />
  );
}

interface ReservationCardProps {
  reservation: Reservation;
  onMarkAttended?: (reservationId: string) => void;
  onMarkNoShow?: (reservationId: string) => void;
  backgroundColor: string;
}

function ReservationCard({
  reservation,
  onMarkAttended,
  onMarkNoShow,
  backgroundColor,
}: ReservationCardProps) {
  const tintColor = useThemeColor({}, 'tint');

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return '#3b82f6';
      case 'ATTENDED':
        return '#10b981';
      case 'NO_SHOW':
        return '#ef4444';
      case 'CANCELLED':
        return '#6b7280';
      default:
        return '#9ca3af';
    }
  };

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'ATTENDED':
        return 'Attended';
      case 'NO_SHOW':
        return 'No Show';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const showActions = reservation.status === 'CONFIRMED';

  return (
    <ThemedView style={[styles.card, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <ThemedText type="defaultSemiBold" style={styles.userName}>
            {reservation.user.name}
          </ThemedText>
          <ThemedText style={styles.userEmail}>{reservation.user.email}</ThemedText>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(reservation.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(reservation.status)}</Text>
        </View>
      </View>

      {/* Class Info */}
      <View style={styles.classInfo}>
        <ThemedText style={styles.className}>{reservation.class.title}</ThemedText>
        <ThemedText style={styles.classTime}>
          {formatDateTime(reservation.class.startTime)}
        </ThemedText>
      </View>

      {/* Reservation Time */}
      <ThemedText style={styles.reservedAt}>
        Reserved: {formatDateTime(reservation.reservedAt)}
      </ThemedText>

      {/* Notes */}
      {reservation.notes && (
        <View style={styles.notesContainer}>
          <ThemedText style={styles.notesLabel}>Note:</ThemedText>
          <ThemedText style={styles.notesText}>{reservation.notes}</ThemedText>
        </View>
      )}

      {/* Action Buttons */}
      {showActions && (onMarkAttended || onMarkNoShow) && (
        <View style={styles.actions}>
          {onMarkAttended && (
            <Pressable
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              onPress={() => onMarkAttended(reservation.id)}
            >
              <Text style={styles.actionButtonText}>Mark Attended</Text>
            </Pressable>
          )}
          {onMarkNoShow && (
            <Pressable
              style={[styles.actionButton, styles.noShowButton]}
              onPress={() => onMarkNoShow(reservation.id)}
            >
              <Text style={[styles.actionButtonText, styles.noShowButtonText]}>
                No Show
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  separator: {
    height: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  classInfo: {
    marginBottom: 8,
  },
  className: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  classTime: {
    fontSize: 14,
    opacity: 0.8,
  },
  reservedAt: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.7,
  },
  notesText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noShowButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  noShowButtonText: {
    color: '#ef4444',
  },
});
