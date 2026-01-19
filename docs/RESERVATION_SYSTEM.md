# CrossFit Class Reservation System

## Overview

This document describes the reservation system implementation for the AttendanceCheck CrossFit application. The system allows users to book classes, coaches to manage their class reservations, and admins to oversee all operations.

## Features

### 1. User Features
- **Browse Classes**: View upcoming CrossFit classes with coach, time, and availability
- **Make Reservations**: Book spots in classes with real-time capacity tracking
- **Cancel Reservations**: Cancel bookings with optional reason
- **Reservation History**: View past and upcoming reservations
- **Class Reminders**: Receive notifications before class starts (configurable)
- **Coach Preferences**: Choose which coaches to receive notifications from

### 2. Coach Features
- **Class Management**: Create, update, and cancel classes
- **View Reservations**: See all users registered for their classes
- **Mark Attendance**: Mark users as attended or no-show
- **Reservation Notifications**: Get alerted when users book or cancel
- **Daily Summary**: Receive daily summary of class reservations
- **Notification Settings**: Configure when to receive alerts

### 3. Admin Features
- **System Overview**: View all classes and reservations across all coaches
- **User Management**: Manage user accounts and roles
- **Analytics**: Track attendance and reservation metrics

## Architecture

### Data Models

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole; // ADMIN | COACH | MEMBER
  phone?: string;
  avatarUrl?: string;
}
```

#### Coach
```typescript
interface Coach {
  id: string;
  userId: string;
  user: User;
  bio?: string;
  specialties: string[];
  certifications: string[];
  isActive: boolean;
}
```

#### CrossFitClass
```typescript
interface CrossFitClass {
  id: string;
  coachId: string;
  coach: Coach;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date; // 1 hour duration
  maxCapacity: number;
  currentReservations: number;
  status: ClassStatus; // SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED
}
```

#### Reservation
```typescript
interface Reservation {
  id: string;
  userId: string;
  user: User;
  classId: string;
  class: CrossFitClass;
  status: ReservationStatus; // CONFIRMED | CANCELLED | ATTENDED | NO_SHOW
  reservedAt: Date;
  cancelledAt?: Date;
  notes?: string;
}
```

### Notification Settings

#### User Notification Settings
```typescript
interface UserNotificationSettings {
  id: string;
  userId: string;

  // Global toggle
  notificationsEnabled: boolean;

  // Class reminders
  classReminderEnabled: boolean;
  classReminderMinutesBefore: number; // 15, 30, 60, or 120 minutes

  // Coach-specific preferences
  coachNotificationPreferences: CoachNotificationPreference[];
}
```

#### Coach Notification Settings
```typescript
interface CoachNotificationSettings {
  id: string;
  coachId: string;

  // Reservation alerts
  reservationNotificationsEnabled: boolean;
  cancellationNotificationsEnabled: boolean;

  // Daily summary
  dailySummaryEnabled: boolean;
  dailySummaryTime: string; // "HH:mm" format (e.g., "08:00")
}
```

## API Endpoints

### Classes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all classes (with filters) |
| GET | `/api/classes/:id` | Get single class |
| GET | `/api/classes/:id/reservations` | Get class reservations |
| GET | `/api/classes/:id/availability` | Check class availability |
| POST | `/api/classes` | Create class (coach/admin) |
| PATCH | `/api/classes/:id` | Update class (coach/admin) |
| PATCH | `/api/classes/:id/cancel` | Cancel class (coach/admin) |
| DELETE | `/api/classes/:id` | Delete class (admin) |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | Get reservations (with filters) |
| GET | `/api/reservations/:id` | Get single reservation |
| POST | `/api/reservations` | Create reservation |
| PATCH | `/api/reservations/:id/cancel` | Cancel reservation |
| PATCH | `/api/reservations/:id/status` | Update status (coach/admin) |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:userId/notification-settings` | Get user notification settings |
| PATCH | `/api/users/:userId/notification-settings` | Update notification settings |
| POST | `/api/users/:userId/notification-settings/coach-preferences` | Update coach preference |
| DELETE | `/api/users/:userId/notification-settings/coach-preferences/:coachId` | Remove coach preference |
| GET | `/api/coaches/:coachId/notification-settings` | Get coach notification settings |
| PATCH | `/api/coaches/:coachId/notification-settings` | Update coach settings |
| GET | `/api/users/:userId/notifications` | Get notification history |
| POST | `/api/users/:userId/notifications/mark-all-read` | Mark all as read |
| POST | `/api/users/:userId/push-tokens` | Register push token |

## Notification Flow

### User Class Reminders

1. User reserves a class
2. System checks user's notification settings:
   - Is `notificationsEnabled: true`?
   - Is `classReminderEnabled: true`?
   - Check `coachNotificationPreferences` for this coach
3. If all enabled, schedule local notification:
   - Time: `class.startTime - classReminderMinutesBefore`
   - Title: "Class Starting Soon! 🏋️"
   - Body: "{className} with {coachName} starts in {X} minutes"
   - Data: `{ type: 'CLASS_REMINDER', classId, coachId }`

### Coach New Reservation Alerts

1. User reserves a class
2. System checks coach's notification settings:
   - Is `reservationNotificationsEnabled: true`?
3. If enabled, send push notification to coach:
   - Title: "New Reservation"
   - Body: "{userName} reserved {className} at {time}"
   - Data: `{ type: 'NEW_RESERVATION', reservationId, classId }`

### Coach Daily Summary

1. Backend cron job runs daily
2. For each coach with `dailySummaryEnabled: true`:
   - Collect all reservations for today's classes
   - Generate summary message
   - Send at configured `dailySummaryTime`

## UI Components

### ClassCard
Displays a single class with reservation button.

**Props:**
- `class: CrossFitClass` - Class data
- `onReserve?: (classId: string) => void` - Reserve callback
- `onCancel?: (classId: string) => void` - Cancel callback
- `isReserved?: boolean` - Show as reserved
- `showReserveButton?: boolean` - Show action button

**Usage:**
```tsx
<ClassCard
  class={classData}
  onReserve={handleReserve}
  onCancel={handleCancel}
  isReserved={userHasReserved}
/>
```

### ReservationList
Displays list of reservations for coaches/admins.

**Props:**
- `reservations: Reservation[]` - List of reservations
- `onMarkAttended?: (id: string) => void` - Mark attended callback
- `onMarkNoShow?: (id: string) => void` - Mark no-show callback
- `emptyMessage?: string` - Message when empty

**Usage:**
```tsx
<ReservationList
  reservations={reservations}
  onMarkAttended={handleMarkAttended}
  onMarkNoShow={handleMarkNoShow}
/>
```

### NotificationSettings
User notification preferences UI.

**Props:**
- `settings: UserNotificationSettings` - Current settings
- `coaches: Coach[]` - Available coaches
- `onUpdateSettings: (settings) => Promise<void>` - Update callback
- `onUpdateCoachPreference: (coachId, enabled) => Promise<void>` - Coach preference callback

**Usage:**
```tsx
<NotificationSettings
  settings={userSettings}
  coaches={allCoaches}
  onUpdateSettings={handleUpdateSettings}
  onUpdateCoachPreference={handleUpdateCoachPref}
/>
```

### CoachNotificationSettings
Coach notification preferences UI.

**Props:**
- `settings: CoachNotificationSettings` - Current settings
- `onUpdateSettings: (settings) => Promise<void>` - Update callback

**Usage:**
```tsx
<CoachNotificationSettings
  settings={coachSettings}
  onUpdateSettings={handleUpdateCoachSettings}
/>
```

## Implementation Guide

### 1. Install Dependencies

```bash
npm install
```

New packages added:
- `expo-notifications` - Push notifications
- `expo-device` - Device detection
- `expo-secure-store` - Secure token storage
- `@react-native-picker/picker` - Time picker

### 2. Configure Push Notifications

Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

### 3. Initialize Notifications in Root Layout

Update `app/_layout.tsx`:
```tsx
import { useEffect } from 'react';
import { pushNotificationService } from '@/services/notifications';

export default function RootLayout() {
  useEffect(() => {
    // Request permissions
    pushNotificationService.requestPermissions();

    // Configure channels (Android)
    pushNotificationService.configureNotificationChannels();

    // Get push token and register with backend
    pushNotificationService.getExpoPushToken().then(token => {
      if (token) {
        // Send to backend
        notificationService.registerPushToken(userId, token);
      }
    });

    // Handle notification responses
    const subscription = pushNotificationService.addNotificationResponseListener(
      (response) => {
        const data = response.notification.request.content.data;
        // Navigate based on notification type
        if (data.type === 'CLASS_REMINDER') {
          router.push(`/classes/${data.classId}`);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  // ... rest of layout
}
```

### 4. Implement Class Listing Screen

Create `app/(tabs)/classes.tsx`:
```tsx
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { ClassCard } from '@/components/class-card';
import { classService, reservationService } from '@/services/api';
import { pushNotificationService } from '@/services/notifications';

export default function ClassesScreen() {
  const [classes, setClasses] = useState([]);
  const [userReservations, setUserReservations] = useState([]);

  useEffect(() => {
    loadClasses();
    loadUserReservations();
  }, []);

  const loadClasses = async () => {
    const data = await classService.getUpcomingClasses();
    setClasses(data);
  };

  const loadUserReservations = async () => {
    const data = await reservationService.getMyReservations(userId);
    setUserReservations(data);
  };

  const handleReserve = async (classId: string) => {
    const result = await reservationService.createReservation({ classId });

    // Schedule local notification
    const classData = classes.find(c => c.id === classId);
    if (classData && userSettings.classReminderEnabled) {
      await pushNotificationService.scheduleClassReminder({
        class: classData,
        minutesBefore: userSettings.classReminderMinutesBefore,
      });
    }

    // Reload data
    await loadClasses();
    await loadUserReservations();
  };

  const handleCancel = async (classId: string) => {
    const reservation = userReservations.find(r => r.classId === classId);
    await reservationService.cancelReservation({
      reservationId: reservation.id
    });

    await loadClasses();
    await loadUserReservations();
  };

  return (
    <FlatList
      data={classes}
      renderItem={({ item }) => (
        <ClassCard
          class={item}
          onReserve={handleReserve}
          onCancel={handleCancel}
          isReserved={userReservations.some(r => r.classId === item.id)}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

### 5. Implement Coach Dashboard

Create `app/(tabs)/coach-dashboard.tsx`:
```tsx
import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { ReservationList } from '@/components/reservation-list';
import { reservationService } from '@/services/api';

export default function CoachDashboard() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const data = await reservationService.getCoachReservations(coachId);
    setReservations(data);
  };

  const handleMarkAttended = async (reservationId: string) => {
    await reservationService.markAttended(reservationId);
    await loadReservations();
  };

  const handleMarkNoShow = async (reservationId: string) => {
    await reservationService.markNoShow(reservationId);
    await loadReservations();
  };

  return (
    <ScrollView>
      <ReservationList
        reservations={reservations}
        onMarkAttended={handleMarkAttended}
        onMarkNoShow={handleMarkNoShow}
      />
    </ScrollView>
  );
}
```

### 6. Implement Settings Screen

Create `app/(tabs)/settings.tsx`:
```tsx
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { NotificationSettings } from '@/components/notification-settings';
import { notificationService } from '@/services/api';

export default function SettingsScreen() {
  const [settings, setSettings] = useState(null);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    loadSettings();
    loadCoaches();
  }, []);

  const loadSettings = async () => {
    const data = await notificationService.getUserNotificationSettings(userId);
    setSettings(data);
  };

  const handleUpdateSettings = async (updates) => {
    await notificationService.updateUserNotificationSettings(userId, updates);
    await loadSettings();
  };

  const handleUpdateCoachPreference = async (coachId, enabled) => {
    await notificationService.updateCoachNotificationPreference(userId, {
      coachId,
      notificationsEnabled: enabled,
    });
    await loadSettings();
  };

  return (
    <ScrollView>
      <NotificationSettings
        settings={settings}
        coaches={coaches}
        onUpdateSettings={handleUpdateSettings}
        onUpdateCoachPreference={handleUpdateCoachPreference}
      />
    </ScrollView>
  );
}
```

## Backend Requirements

### Database Schema

You'll need to create the following tables in your backend database:

1. **users** - User accounts
2. **coaches** - Coach profiles
3. **crossfit_classes** - Class schedule
4. **reservations** - User reservations
5. **user_notification_settings** - User notification preferences
6. **coach_notification_preferences** - Per-coach notification preferences
7. **coach_notification_settings** - Coach notification settings
8. **notifications** - Notification history
9. **push_tokens** - Device push tokens

### Background Jobs

Implement the following scheduled jobs:

1. **Class Reminder Sender** - Sends push notifications for upcoming classes
2. **Daily Summary Generator** - Sends daily summaries to coaches
3. **Notification Cleanup** - Removes old notifications

### Push Notification Service

Implement server-side push notification sending using Expo's Push Notification API:

```javascript
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(pushToken, title, body, data) {
  const messages = [{
    to: pushToken,
    sound: 'default',
    title,
    body,
    data,
  }];

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (let chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
  }

  return tickets;
}
```

## Testing Checklist

- [ ] User can view upcoming classes
- [ ] User can reserve a class
- [ ] User can cancel a reservation
- [ ] User receives notification before class starts
- [ ] User can configure notification settings
- [ ] User can choose coaches to receive notifications from
- [ ] Coach receives notification when user books their class
- [ ] Coach can view all reservations
- [ ] Coach can mark attendance
- [ ] Coach can configure their notification settings
- [ ] Coach receives daily summary at configured time
- [ ] Admin can view all reservations
- [ ] Push notifications work on iOS
- [ ] Push notifications work on Android
- [ ] Notification settings persist after app restart

## Troubleshooting

### Notifications Not Appearing

1. Check permissions: `await Notifications.getPermissionsAsync()`
2. Verify push token is registered with backend
3. Check notification settings are enabled
4. Test on physical device (not simulator)
5. Verify backend is sending notifications

### Reservation Conflicts

1. Implement optimistic locking on class capacity
2. Check capacity before confirming reservation
3. Handle race conditions with database constraints

### Performance

1. Implement pagination for class lists
2. Cache class data with expiration
3. Use optimistic UI updates
4. Implement pull-to-refresh

## Future Enhancements

- [ ] Waitlist functionality when classes are full
- [ ] Recurring class schedules
- [ ] Class packages and memberships
- [ ] Payment integration
- [ ] QR code check-in
- [ ] Calendar integration
- [ ] Social features (invite friends)
- [ ] Achievement/streak tracking
- [ ] Analytics dashboard for coaches
- [ ] Multi-location support

## Support

For issues or questions, please refer to:
- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
