# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies (1 min)

```bash
npm install
```

### Step 2: Configure Environment (1 min)

Create `.env` file in project root:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
```

### Step 3: Start Development Server (30 sec)

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Step 4: Verify Setup (2 min)

1. App should load with welcome screen
2. Check console for any errors
3. Test navigation between tabs

---

## 📱 Key Features Overview

### For Users
1. **Browse Classes** → Home tab → View upcoming CrossFit classes
2. **Make Reservation** → Tap class card → "Reserve Spot" button
3. **Set Notifications** → Settings → Configure reminders
4. **Choose Coaches** → Settings → Select which coaches to follow

### For Coaches
1. **View Reservations** → Coach Dashboard → See all bookings
2. **Mark Attendance** → Tap reservation → "Mark Attended" or "No Show"
3. **Configure Alerts** → Settings → Set notification preferences
4. **Daily Summary** → Settings → Enable daily email at chosen time

---

## 🔧 Quick Configuration

### Enable Push Notifications

```typescript
// app/_layout.tsx
import { pushNotificationService } from '@/services/notifications';

useEffect(() => {
  pushNotificationService.requestPermissions();
  pushNotificationService.configureNotificationChannels();
}, []);
```

### Connect to Backend API

```typescript
// services/api/client.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
```

### Set Auth Token

```typescript
import { apiClient } from '@/services/api';

apiClient.setAuthToken(userToken);
```

---

## 🎨 Customize Theme

Edit `constants/theme.ts`:

```typescript
export const Colors = {
  light: {
    tint: '#0a7ea4', // Your brand color
  },
  dark: {
    tint: '#fff',
  },
};
```

---

## 📦 What's Included

### ✅ Complete Data Models
- User, Coach, Class, Reservation models
- Notification settings models
- TypeScript types for all API requests/responses

### ✅ API Service Layer
- Class management (`classService`)
- Reservation management (`reservationService`)
- Notification management (`notificationService`)
- Configured API client with auth support

### ✅ UI Components
- `<ClassCard />` - Display and book classes
- `<ReservationList />` - Manage reservations
- `<NotificationSettings />` - User notification preferences
- `<CoachNotificationSettings />` - Coach notification config

### ✅ Notification System
- Local push notifications
- Class reminders
- Reservation alerts
- Coach-specific preferences

### ✅ Documentation
- Complete system documentation
- API endpoint reference
- Component usage examples
- Backend requirements

---

## 🛠️ Common Tasks

### Add a New Screen

```typescript
// app/my-screen.tsx
import { ThemedView } from '@/components/themed-view';

export default function MyScreen() {
  return <ThemedView>My Screen</ThemedView>;
}
```

Navigate: `router.push('/my-screen')`

### Fetch Data from API

```typescript
import { classService } from '@/services/api';

const classes = await classService.getUpcomingClasses();
```

### Schedule Notification

```typescript
import { pushNotificationService } from '@/services/notifications';

await pushNotificationService.scheduleClassReminder({
  class: classData,
  minutesBefore: 30,
});
```

---

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache
npm start -- --clear

# Reinstall dependencies
rm -rf node_modules && npm install
```

### Can't connect to backend?
- Check `EXPO_PUBLIC_API_URL` in `.env`
- Use your computer's IP address (not `localhost`) for physical devices
- Verify backend is running

### Notifications not working?
- Test on **physical device** (not simulator)
- Check notification permissions in device settings
- Verify `expo-notifications` plugin in `app.json`

---

## 📚 Next Steps

1. **Read Full Documentation**
   - [Reservation System](./RESERVATION_SYSTEM.md)
   - [Setup Guide](../README_SETUP.md)

2. **Implement Backend**
   - See API requirements in docs
   - Database schema provided
   - Push notification service needed

3. **Customize for Your Gym**
   - Update branding colors
   - Add your logo
   - Configure class types

4. **Test Thoroughly**
   - User flows
   - Coach flows
   - Notification delivery
   - Cross-platform compatibility

---

## 💡 Pro Tips

- **Development**: Use Expo Go app for fastest iteration
- **Debugging**: Enable remote debugging in dev menu (shake device)
- **Performance**: Use React DevTools for performance profiling
- **State**: Consider adding Redux/Zustand for complex state
- **Forms**: Add React Hook Form for complex forms
- **Dates**: Use date-fns or day.js for date manipulation

---

## 🤝 Need Help?

- Check [docs/RESERVATION_SYSTEM.md](./RESERVATION_SYSTEM.md) for detailed docs
- Review component examples in `components/` directory
- Look at service implementations in `services/` directory
- Refer to [Expo Documentation](https://docs.expo.dev/)

---

## ✨ You're Ready!

Your CrossFit reservation system foundation is complete. Start building your custom features and screens on top of this solid architecture.

Happy coding! 🏋️‍♀️
