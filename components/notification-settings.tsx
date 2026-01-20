/**
 * NotificationSettings Component
 *
 * User notification preferences UI
 */

import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import type { UserNotificationSettings, CoachNotificationPreference, Coach } from '@/types/models';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface NotificationSettingsProps {
  settings: UserNotificationSettings;
  coaches: Coach[];
  onUpdateSettings: (settings: Partial<UserNotificationSettings>) => Promise<void>;
  onUpdateCoachPreference: (coachId: string, enabled: boolean) => Promise<void>;
}

export function NotificationSettings({
  settings,
  coaches,
  onUpdateSettings,
  onUpdateCoachPreference,
}: NotificationSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#2a2a2a' }, 'background');

  const handleToggleNotifications = async (value: boolean) => {
    setIsUpdating(true);
    try {
      await onUpdateSettings({ notificationsEnabled: value });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleClassReminders = async (value: boolean) => {
    setIsUpdating(true);
    try {
      await onUpdateSettings({ classReminderEnabled: value });
    } catch (error) {
      console.error('Error updating class reminder settings:', error);
      Alert.alert('Error', 'Failed to update reminder settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateReminderTime = async (minutes: number) => {
    setIsUpdating(true);
    try {
      await onUpdateSettings({ classReminderMinutesBefore: minutes });
    } catch (error) {
      console.error('Error updating reminder time:', error);
      Alert.alert('Error', 'Failed to update reminder time');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleCoachNotifications = async (coachId: string, value: boolean) => {
    setIsUpdating(true);
    try {
      await onUpdateCoachPreference(coachId, value);
    } catch (error) {
      console.error('Error updating coach notification preference:', error);
      Alert.alert('Error', 'Failed to update coach notification preference');
    } finally {
      setIsUpdating(false);
    }
  };

  const getCoachPreference = (coachId: string): boolean => {
    const preference = settings.coachNotificationPreferences.find((p) => p.coachId === coachId);
    return preference?.notificationsEnabled ?? true; // Default to enabled
  };

  const reminderOptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
  ];

  return (
    <View style={styles.container}>
      {/* Global Notifications */}
      <ThemedView style={[styles.section, { backgroundColor }]}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Notifications
        </ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Enable Notifications</ThemedText>
            <ThemedText style={styles.settingDescription}>Receive all app notifications</ThemedText>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleToggleNotifications}
            disabled={isUpdating}
            trackColor={{ false: '#767577', true: tintColor }}
            thumbColor="#fff"
          />
        </View>
      </ThemedView>

      {/* Class Reminders */}
      <ThemedView style={[styles.section, { backgroundColor }]}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Class Reminders
        </ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Class Reminders</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Get notified before your class starts
            </ThemedText>
          </View>
          <Switch
            value={settings.classReminderEnabled}
            onValueChange={handleToggleClassReminders}
            disabled={isUpdating || !settings.notificationsEnabled}
            trackColor={{ false: '#767577', true: tintColor }}
            thumbColor="#fff"
          />
        </View>

        {settings.classReminderEnabled && (
          <View style={styles.reminderOptions}>
            <ThemedText style={styles.optionsLabel}>Remind me:</ThemedText>
            {reminderOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionButton,
                  settings.classReminderMinutesBefore === option.value && {
                    backgroundColor: tintColor,
                  },
                ]}
                onPress={() => handleUpdateReminderTime(option.value)}
                disabled={isUpdating}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.classReminderMinutesBefore === option.value && {
                      color: '#fff',
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ThemedView>

      {/* Coach-Specific Notifications */}
      <ThemedView style={[styles.section, { backgroundColor }]}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Coach Notifications
        </ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Choose which coaches you want to receive notifications from
        </ThemedText>

        {coaches.map((coach) => (
          <View key={coach.id} style={styles.coachRow}>
            <View style={styles.coachInfo}>
              <ThemedText style={styles.coachName}>{coach.user.name}</ThemedText>
              {coach.specialties.length > 0 && (
                <ThemedText style={styles.coachSpecialties}>
                  {coach.specialties.join(', ')}
                </ThemedText>
              )}
            </View>
            <Switch
              value={getCoachPreference(coach.id)}
              onValueChange={(value) => handleToggleCoachNotifications(coach.id, value)}
              disabled={isUpdating || !settings.notificationsEnabled}
              trackColor={{ false: '#767577', true: tintColor }}
              thumbColor="#fff"
            />
          </View>
        ))}
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  reminderOptions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  coachRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  coachInfo: {
    flex: 1,
    marginRight: 16,
  },
  coachName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  coachSpecialties: {
    fontSize: 12,
    opacity: 0.7,
  },
});
