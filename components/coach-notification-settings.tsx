/**
 * CoachNotificationSettings Component
 *
 * Coach-specific notification preferences UI
 */

import { View, StyleSheet, Switch, Alert } from 'react-native';
import { useState } from 'react';
import type { CoachNotificationSettings } from '@/types/models';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Picker } from '@react-native-picker/picker';

interface CoachNotificationSettingsProps {
  settings: CoachNotificationSettings;
  onUpdateSettings: (settings: Partial<CoachNotificationSettings>) => Promise<void>;
}

export function CoachNotificationSettingsComponent({
  settings,
  onUpdateSettings,
}: CoachNotificationSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#2a2a2a' }, 'background');

  const handleToggleSetting = async (key: keyof CoachNotificationSettings, value: boolean) => {
    setIsUpdating(true);
    try {
      await onUpdateSettings({ [key]: value });
    } catch (error) {
      console.error('Error updating coach notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDailySummaryTime = async (time: string) => {
    setIsUpdating(true);
    try {
      await onUpdateSettings({ dailySummaryTime: time });
    } catch (error) {
      console.error('Error updating daily summary time:', error);
      Alert.alert('Error', 'Failed to update summary time');
    } finally {
      setIsUpdating(false);
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { label: `${hour}:00`, value: `${hour}:00` };
  });

  return (
    <View style={styles.container}>
      {/* Reservation Notifications */}
      <ThemedView style={[styles.section, { backgroundColor }]}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Class Reservations
        </ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>New Reservations</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Get notified when users reserve your classes
            </ThemedText>
          </View>
          <Switch
            value={settings.reservationNotificationsEnabled}
            onValueChange={(value) => handleToggleSetting('reservationNotificationsEnabled', value)}
            disabled={isUpdating}
            trackColor={{ false: '#767577', true: tintColor }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Cancellations</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Get notified when users cancel reservations
            </ThemedText>
          </View>
          <Switch
            value={settings.cancellationNotificationsEnabled}
            onValueChange={(value) =>
              handleToggleSetting('cancellationNotificationsEnabled', value)
            }
            disabled={isUpdating}
            trackColor={{ false: '#767577', true: tintColor }}
            thumbColor="#fff"
          />
        </View>
      </ThemedView>

      {/* Daily Summary */}
      <ThemedView style={[styles.section, { backgroundColor }]}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Daily Summary
        </ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Enable Daily Summary</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Receive a daily summary of your class reservations
            </ThemedText>
          </View>
          <Switch
            value={settings.dailySummaryEnabled}
            onValueChange={(value) => handleToggleSetting('dailySummaryEnabled', value)}
            disabled={isUpdating}
            trackColor={{ false: '#767577', true: tintColor }}
            thumbColor="#fff"
          />
        </View>

        {settings.dailySummaryEnabled && (
          <View style={styles.timePickerContainer}>
            <ThemedText style={styles.timePickerLabel}>Send summary at:</ThemedText>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={settings.dailySummaryTime}
                onValueChange={(value) => handleUpdateDailySummaryTime(value as string)}
                enabled={!isUpdating}
                style={styles.picker}
              >
                {timeOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>
        )}
      </ThemedView>

      {/* Information */}
      <ThemedView style={[styles.infoSection, { backgroundColor }]}>
        <ThemedText style={styles.infoIcon}>ℹ️</ThemedText>
        <ThemedText style={styles.infoText}>
          These settings control notifications you receive about your classes. Users can also choose
          which coaches they want to receive notifications from.
        </ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  timePickerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
  },
});
