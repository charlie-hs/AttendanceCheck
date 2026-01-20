# AttendanceCheck - CrossFit Class Reservation System

A React Native mobile application for managing CrossFit class reservations with coach and user notifications.

## Features

### For Members

- 📅 Browse and book CrossFit classes
- 🔔 Receive reminders before classes start
- ⚙️ Customize notification preferences per coach
- 📊 View reservation history
- ❌ Cancel reservations easily

### For Coaches

- 👥 View all reservations for your classes
- ✅ Mark attendance (attended/no-show)
- 🔔 Get notified when users book or cancel
- 📈 Receive daily class summary
- ⚙️ Configure notification preferences

### For Admins

- 🏢 Manage all classes and reservations
- 👤 User account management
- 📊 System-wide analytics

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Notifications**: Expo Notifications
- **Styling**: StyleSheet API with theme support
- **State Management**: Local state (ready for Redux/Zustand)

## Project Structure

```
AttendanceCheck/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx            # Home screen
│   │   ├── explore.tsx          # Explore screen
│   │   └── _layout.tsx          # Tab layout
│   ├── _layout.tsx              # Root layout
│   └── modal.tsx                # Modal screen
├── components/                   # Reusable UI components
│   ├── class-card.tsx           # Class display card
│   ├── reservation-list.tsx     # Reservation list for coaches
│   ├── notification-settings.tsx # User notification settings
│   ├── coach-notification-settings.tsx # Coach settings
│   ├── themed-text.tsx          # Theme-aware text
│   └── themed-view.tsx          # Theme-aware view
├── services/                     # Business logic and API
│   ├── api/
│   │   ├── client.ts            # API client configuration
│   │   ├── classes.ts           # Class endpoints
│   │   ├── reservations.ts      # Reservation endpoints
│   │   ├── notifications.ts     # Notification endpoints
│   │   └── index.ts             # Service exports
│   └── notifications/
│       ├── push-notifications.ts # Push notification service
│       └── index.ts
├── types/                        # TypeScript type definitions
│   └── models.ts                # Data models
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── constants/                    # App constants
│   └── theme.ts                 # Theme configuration
├── docs/                         # Documentation
│   └── RESERVATION_SYSTEM.md    # System documentation
└── package.json                 # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- iOS Simulator (macOS) or Android Studio (for emulator)
- Expo Go app on physical device (optional)
- Backend API (see Backend Requirements below)

### Installation

1. **Clone the repository**

   ```bash
   cd /home/datamaker/development/projects/AttendanceCheck
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   EXPO_PUBLIC_API_URL=http://your-backend-url/api
   EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on specific platform**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Backend Requirements

The app requires a backend API with the following endpoints:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Classes

- `GET /api/classes` - List classes
- `GET /api/classes/:id` - Get class details
- `POST /api/classes` - Create class (coach/admin)
- `PATCH /api/classes/:id` - Update class (coach/admin)
- `DELETE /api/classes/:id` - Delete class (admin)
- `GET /api/classes/:id/reservations` - Get class reservations
- `GET /api/classes/:id/availability` - Check availability

### Reservations

- `GET /api/reservations` - List reservations (with filters)
- `POST /api/reservations` - Create reservation
- `PATCH /api/reservations/:id/cancel` - Cancel reservation
- `PATCH /api/reservations/:id/status` - Update status (coach/admin)

### Notifications

- `GET /api/users/:userId/notification-settings` - Get settings
- `PATCH /api/users/:userId/notification-settings` - Update settings
- `POST /api/users/:userId/notification-settings/coach-preferences` - Set coach preference
- `GET /api/coaches/:coachId/notification-settings` - Get coach settings
- `PATCH /api/coaches/:coachId/notification-settings` - Update coach settings
- `POST /api/users/:userId/push-tokens` - Register push token

See [RESERVATION_SYSTEM.md](docs/RESERVATION_SYSTEM.md) for complete API specification.

## Configuration

### Push Notifications

1. **Configure in app.json**

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

2. **iOS Setup**
   - Add capabilities in Xcode: Push Notifications
   - Configure APNs in Apple Developer Portal

3. **Android Setup**
   - Firebase Cloud Messaging (FCM) is handled by Expo
   - No additional setup required

### Theme Customization

Edit `constants/theme.ts`:

```typescript
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4', // Primary color
    // ...
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff', // Primary color
    // ...
  },
};
```

## Development Workflow

### Adding a New Screen

1. Create file in `app/` directory

   ```tsx
   // app/new-screen.tsx
   export default function NewScreen() {
     return <ThemedView>...</ThemedView>;
   }
   ```

2. Navigation is automatic with Expo Router
   ```tsx
   import { router } from 'expo-router';
   router.push('/new-screen');
   ```

### Adding a New API Endpoint

1. Add service method in `services/api/`

   ```typescript
   // services/api/example.ts
   export const exampleService = {
     async getData(): Promise<Data> {
       return apiClient.get('/example');
     },
   };
   ```

2. Export from `services/api/index.ts`
   ```typescript
   export { exampleService } from './example';
   ```

### Adding a New Component

1. Create component file in `components/`

   ```tsx
   // components/my-component.tsx
   export function MyComponent({ prop }: MyComponentProps) {
     return <ThemedView>...</ThemedView>;
   }
   ```

2. Use in screens
   ```tsx
   import { MyComponent } from '@/components/my-component';
   ```

## Testing

### Run Linter

```bash
npm run lint
```

### Manual Testing Checklist

- [ ] User can register and login
- [ ] User can view classes
- [ ] User can make/cancel reservations
- [ ] Notifications appear on time
- [ ] Coach can view reservations
- [ ] Coach can mark attendance
- [ ] Settings persist after restart
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Dark mode works correctly

## Deployment

### Build for Production

1. **Configure app.json** with production settings

2. **Build for iOS**

   ```bash
   eas build --platform ios
   ```

3. **Build for Android**

   ```bash
   eas build --platform android
   ```

4. **Submit to stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

See [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/) for details.

## Troubleshooting

### Common Issues

**1. "Cannot connect to backend"**

- Verify `EXPO_PUBLIC_API_URL` is correct
- Check backend is running
- On iOS simulator, use computer's IP instead of localhost

**2. "Notifications not appearing"**

- Check permissions: Settings → AttendanceCheck → Notifications
- Test on physical device (not simulator)
- Verify push token is registered with backend

**3. "Module not found" errors**

- Clear cache: `npm start -- --clear`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**4. "Types not found"**

- Restart TypeScript server in VS Code
- Check `tsconfig.json` paths are correct

### Debug Mode

Enable debug logs:

```typescript
// In app/_layout.tsx
if (__DEV__) {
  console.log('Development mode enabled');
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Documentation

- [Reservation System Documentation](docs/RESERVATION_SYSTEM.md)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

MIT

## Support

For questions or issues:

- Create an issue in the repository
- Contact the development team
- Refer to documentation in `docs/`
