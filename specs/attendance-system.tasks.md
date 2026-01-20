# AttendanceCheck - Implementation Tasks

**Spec:** [attendance-system.specs.md](attendance-system.specs.md)
**Generated:** 2024-01-20
**Total Tasks:** 45
**Methodology:** TDD (Test First) + Tidy First (Structural/Behavioral separation)

---

## Task Dependency Graph

```
Phase 1: Foundation
├── T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
│
Phase 2: Gym & Members
├── T9 → T10 → T11 → T12 → T13 → T14 → T15
│
Phase 3: Attendance
├── T16 → T17 → T18 → T19 → T20 → T21 → T22
│
Phase 4: WOD
├── T23 → T24 → T25 → T26 → T27 → T28 → T29
│
Phase 5: Notifications
├── T30 → T31 → T32 → T33 → T34
│
Phase 6: Analytics
└── T35 → T36 → T37
```

---

# Phase 1: Foundation (MVP Core)

## Task 1: Setup TypeScript Models

**Type:** structural
**Phase:** 1
**Depends on:** None

### Description

Create TypeScript interfaces for all data models used throughout the application.

### Files to create/modify

- `types/models.ts` (update existing)
- `types/auth.ts` (new)
- `types/gym.ts` (new)
- `types/attendance.ts` (new)
- `types/wod.ts` (new)

### Tests to write

- Type compilation test (TypeScript strict mode)

### Acceptance criteria

- [ ] User, AuthTokens interfaces defined
- [ ] Gym, GymMembership interfaces defined
- [ ] Attendance interface defined
- [ ] WOD, TimeSlot, WODVote interfaces defined
- [ ] All types exported from `types/index.ts`

---

## Task 2: Create UI Components Library

**Type:** structural
**Phase:** 1
**Depends on:** None

### Description

Create reusable UI components for consistent design across the app.

### Files to create/modify

- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/card.tsx`
- `components/ui/modal.tsx`
- `components/ui/index.ts`

### Tests to write

- `__tests__/components/ui/button.test.tsx`
- `__tests__/components/ui/input.test.tsx`

### Acceptance criteria

- [ ] Button component with variants (primary, secondary, outline, danger)
- [ ] Input component with label, error state, password toggle
- [ ] Card component with header, body, footer slots
- [ ] Modal component with backdrop and close button
- [ ] All components support theming (light/dark)

---

## Task 3: Setup API Client

**Type:** structural
**Phase:** 1
**Depends on:** Task 1

### Description

Create a configured API client with authentication interceptors.

### Files to create/modify

- `services/api/client.ts` (update existing)
- `services/storage/secure-storage.ts` (new)

### Tests to write

- `__tests__/services/api/client.test.ts`
- `__tests__/services/storage/secure-storage.test.ts`

### Acceptance criteria

- [ ] API client with base URL configuration
- [ ] Request interceptor adds auth token
- [ ] Response interceptor handles 401 (token refresh)
- [ ] Secure storage for tokens (expo-secure-store)
- [ ] Error handling with typed errors

---

## Task 4: Implement Auth API Service

**Type:** behavioral
**Phase:** 1
**Depends on:** Task 3

### Description

Create authentication API service with all auth endpoints.

### Files to create/modify

- `services/api/auth.ts` (new)

### Tests to write

- `__tests__/services/api/auth.test.ts`
  - Test register endpoint
  - Test login endpoint
  - Test logout endpoint
  - Test refresh token endpoint

### Acceptance criteria

- [ ] `register(email, password, name)` → User + tokens
- [ ] `login(email, password)` → User + tokens
- [ ] `logout()` → void
- [ ] `refreshToken(refreshToken)` → new tokens
- [ ] `getMe()` → current User
- [ ] `forgotPassword(email)` → void
- [ ] `resetPassword(token, password)` → void

---

## Task 5: Create Auth Context

**Type:** behavioral
**Phase:** 1
**Depends on:** Task 4

### Description

Create React context for authentication state management.

### Files to create/modify

- `contexts/auth-context.tsx` (new)
- `hooks/use-auth.ts` (new)

### Tests to write

- `__tests__/contexts/auth-context.test.tsx`
- `__tests__/hooks/use-auth.test.ts`

### Acceptance criteria

- [ ] AuthProvider wraps app
- [ ] `useAuth()` hook returns user, isAuthenticated, isLoading
- [ ] `signIn(email, password)` function
- [ ] `signUp(email, password, name)` function
- [ ] `signOut()` function
- [ ] Auto-restore session on app launch
- [ ] Token refresh on expiry

---

## Task 6: Create Auth Navigation Flow

**Type:** structural
**Phase:** 1
**Depends on:** Task 5

### Description

Setup authentication navigation with Expo Router.

### Files to create/modify

- `app/(auth)/_layout.tsx` (new)
- `app/(auth)/sign-in.tsx` (new)
- `app/(auth)/sign-up.tsx` (new)
- `app/(auth)/forgot-password.tsx` (new)
- `app/_layout.tsx` (update)

### Tests to write

- Navigation flow tests (manual/E2E)

### Acceptance criteria

- [ ] Auth group layout with stack navigation
- [ ] Sign-in screen skeleton
- [ ] Sign-up screen skeleton
- [ ] Forgot password screen skeleton
- [ ] Root layout checks auth state and redirects

---

## Task 7: Implement Sign-In Screen

**Type:** behavioral
**Phase:** 1
**Depends on:** Task 6, Task 2

### Description

Complete sign-in screen with form validation and API integration.

### Files to create/modify

- `app/(auth)/sign-in.tsx`
- `components/auth/sign-in-form.tsx` (new)

### Tests to write

- `__tests__/components/auth/sign-in-form.test.tsx`
  - Renders email and password fields
  - Shows validation errors
  - Calls onSubmit with valid data
  - Shows loading state

### Acceptance criteria

- [ ] Email input with validation
- [ ] Password input with show/hide toggle
- [ ] "Remember me" checkbox
- [ ] Sign in button with loading state
- [ ] Link to sign-up screen
- [ ] Link to forgot password
- [ ] Error message display
- [ ] Success redirects to home

---

## Task 8: Implement Sign-Up Screen

**Type:** behavioral
**Phase:** 1
**Depends on:** Task 6, Task 2

### Description

Complete sign-up screen with form validation and API integration.

### Files to create/modify

- `app/(auth)/sign-up.tsx`
- `components/auth/sign-up-form.tsx` (new)

### Tests to write

- `__tests__/components/auth/sign-up-form.test.tsx`
  - Renders all required fields
  - Validates password strength
  - Validates email format
  - Shows terms checkbox
  - Calls onSubmit with valid data

### Acceptance criteria

- [ ] Display name input
- [ ] Email input with format validation
- [ ] Password input with strength indicator
- [ ] Confirm password with match validation
- [ ] Terms of service checkbox
- [ ] Sign up button with loading state
- [ ] Link to sign-in screen
- [ ] Success redirects to home

---

# Phase 2: Gym & Member Management

## Task 9: Setup Main App Navigation

**Type:** structural
**Phase:** 2
**Depends on:** Task 6

### Description

Create main app navigation with tab bar and protected routes.

### Files to create/modify

- `app/(app)/_layout.tsx` (new)
- `app/(app)/(tabs)/_layout.tsx` (new)
- `app/(app)/(tabs)/index.tsx` (new - Home)
- `app/(app)/(tabs)/history.tsx` (new - placeholder)
- `app/(app)/(tabs)/wod.tsx` (new - placeholder)
- `app/(app)/(tabs)/profile.tsx` (new - placeholder)
- `components/auth/auth-guard.tsx` (new)

### Tests to write

- `__tests__/components/auth/auth-guard.test.tsx`

### Acceptance criteria

- [ ] Tab navigation with 4 tabs (Home, History, WOD, Profile)
- [ ] Icons for each tab
- [ ] Auth guard redirects unauthenticated users
- [ ] Placeholder content for each tab

---

## Task 10: Implement Gym API Service

**Type:** behavioral
**Phase:** 2
**Depends on:** Task 3

### Description

Create gym management API service.

### Files to create/modify

- `services/api/gyms.ts` (new)

### Tests to write

- `__tests__/services/api/gyms.test.ts`

### Acceptance criteria

- [ ] `getGyms()` → list user's gyms
- [ ] `createGym(data)` → new Gym
- [ ] `getGym(id)` → Gym details
- [ ] `updateGym(id, data)` → updated Gym
- [ ] `deleteGym(id)` → void

---

## Task 11: Create Gym Context

**Type:** behavioral
**Phase:** 2
**Depends on:** Task 10

### Description

Create context for current gym selection and gym list.

### Files to create/modify

- `contexts/gym-context.tsx` (new)
- `hooks/use-gym.ts` (new)

### Tests to write

- `__tests__/contexts/gym-context.test.tsx`

### Acceptance criteria

- [ ] GymProvider wraps app
- [ ] `useGym()` returns currentGym, gyms, setCurrentGym
- [ ] Persist selected gym to storage
- [ ] Auto-select first gym if none selected

---

## Task 12: Create Gym Selector Component

**Type:** behavioral
**Phase:** 2
**Depends on:** Task 11

### Description

Component to switch between gyms (for multi-gym users).

### Files to create/modify

- `components/gym/gym-selector.tsx` (new)
- `components/gym/gym-card.tsx` (new)

### Tests to write

- `__tests__/components/gym/gym-selector.test.tsx`

### Acceptance criteria

- [ ] Dropdown/modal to select gym
- [ ] Shows current gym name in header
- [ ] Lists all user's gyms
- [ ] Option to create new gym (for owners)
- [ ] Updates context when gym selected

---

## Task 13: Implement Member API Service

**Type:** behavioral
**Phase:** 2
**Depends on:** Task 3

### Description

Create member management API service.

### Files to create/modify

- `services/api/members.ts` (new)

### Tests to write

- `__tests__/services/api/members.test.ts`

### Acceptance criteria

- [ ] `getMembers(gymId)` → member list
- [ ] `registerMember(gymId, data)` → new membership
- [ ] `getMember(gymId, memberId)` → member details
- [ ] `updateMember(gymId, memberId, data)` → updated member
- [ ] `removeMember(gymId, memberId)` → void
- [ ] `setActivePeriod(gymId, memberId, from, until)` → updated member

---

## Task 14: Create Member List Screen

**Type:** behavioral
**Phase:** 2
**Depends on:** Task 13, Task 9

### Description

Screen for managers to view and manage members.

### Files to create/modify

- `app/(app)/gym/[id]/members.tsx` (new)
- `components/gym/member-list.tsx` (new)
- `components/gym/member-list-item.tsx` (new)

### Tests to write

- `__tests__/components/gym/member-list.test.tsx`

### Acceptance criteria

- [ ] List all gym members
- [ ] Search by name/email
- [ ] Filter by status (active/inactive/expired)
- [ ] Show member role, active period
- [ ] Pull to refresh
- [ ] FAB to add new member

---

## Task 15: Create Member Registration Screen

**Type:** behavioral
**Phase:** 2
**Depends on:** Task 14

### Description

Screen for managers to register new members.

### Files to create/modify

- `app/(app)/member/register.tsx` (new)
- `components/gym/member-form.tsx` (new)

### Tests to write

- `__tests__/components/gym/member-form.test.tsx`

### Acceptance criteria

- [ ] Search existing users by email
- [ ] Create new user option
- [ ] Set role (member/manager)
- [ ] Set active period with date pickers
- [ ] Unlimited membership toggle
- [ ] Submit button with validation
- [ ] Success shows confirmation

---

# Phase 3: Attendance System

## Task 16: Implement Attendance API Service

**Type:** behavioral
**Phase:** 3
**Depends on:** Task 3

### Description

Create attendance/check-in API service.

### Files to create/modify

- `services/api/attendance.ts` (new)

### Tests to write

- `__tests__/services/api/attendance.test.ts`

### Acceptance criteria

- [ ] `checkIn(gymId)` → Attendance record
- [ ] `getTodayStatus(gymId)` → today's check-in status
- [ ] `getMyAttendance(gymId, params)` → paginated history
- [ ] `getAllAttendance(gymId, params)` → all members (manager)
- [ ] `getStats(gymId)` → attendance statistics
- [ ] `manualCheckIn(gymId, userId)` → manual check-in (manager)

---

## Task 17: Create Check-In Button Component

**Type:** behavioral
**Phase:** 3
**Depends on:** Task 16

### Description

Main check-in button for home screen.

### Files to create/modify

- `components/attendance/check-in-button.tsx` (new)
- `hooks/use-check-in.ts` (new)

### Tests to write

- `__tests__/components/attendance/check-in-button.test.tsx`
- `__tests__/hooks/use-check-in.test.ts`

### Acceptance criteria

- [ ] Large, prominent button
- [ ] Shows "Check In" when available
- [ ] Shows "Checked In ✓" with time after check-in
- [ ] Disabled state when already checked in
- [ ] Disabled state when membership expired
- [ ] Loading state during API call
- [ ] Success animation/haptic feedback

---

## Task 18: Create Streak Badge Component

**Type:** behavioral
**Phase:** 3
**Depends on:** Task 16

### Description

Display current attendance streak.

### Files to create/modify

- `components/attendance/streak-badge.tsx` (new)
- `hooks/use-attendance-stats.ts` (new)

### Tests to write

- `__tests__/components/attendance/streak-badge.test.tsx`

### Acceptance criteria

- [ ] Shows current streak number
- [ ] Fire icon for streaks > 7 days
- [ ] Different colors for milestones (7, 30, 100 days)
- [ ] Tooltip with streak details

---

## Task 19: Update Home Screen with Check-In

**Type:** behavioral
**Phase:** 3
**Depends on:** Task 17, Task 18, Task 12

### Description

Integrate check-in functionality into home screen.

### Files to create/modify

- `app/(app)/(tabs)/index.tsx` (update)

### Tests to write

- Integration tests (manual)

### Acceptance criteria

- [ ] Gym selector at top
- [ ] Check-in button prominently displayed
- [ ] Streak badge visible
- [ ] Today's check-in status
- [ ] Today's WOD preview (placeholder for now)
- [ ] Quick stats (this week, this month)

---

## Task 20: Create Attendance Calendar Component

**Type:** behavioral
**Phase:** 3
**Depends on:** Task 16

### Description

Calendar view showing attendance history.

### Files to create/modify

- `components/attendance/attendance-calendar.tsx` (new)

### Tests to write

- `__tests__/components/attendance/attendance-calendar.test.tsx`

### Acceptance criteria

- [ ] Monthly calendar view
- [ ] Marked dates for check-ins
- [ ] Different colors for self vs manual check-in
- [ ] Swipe to change months
- [ ] Today highlighted
- [ ] Tap date shows details

---

## Task 21: Create Attendance History Screen

**Type:** behavioral
**Phase:** 3
**Depends on:** Task 20

### Description

Full attendance history screen with calendar and list views.

### Files to create/modify

- `app/(app)/(tabs)/history.tsx` (update)
- `components/attendance/attendance-list.tsx` (new)

### Tests to write

- `__tests__/components/attendance/attendance-list.test.tsx`

### Acceptance criteria

- [ ] Toggle between calendar and list view
- [ ] Calendar component integrated
- [ ] List shows date, time, method
- [ ] Pagination/infinite scroll
- [ ] Monthly statistics summary
- [ ] Export option (future)

---

## Task 22: Create Manager Attendance View

**Type:** behavioral
**Phase:** 3
**Depends on:** Task 16, Task 14

### Description

Manager view to see all member attendance.

### Files to create/modify

- `app/(app)/gym/[id]/attendance.tsx` (new)
- `components/attendance/member-attendance-list.tsx` (new)

### Tests to write

- `__tests__/components/attendance/member-attendance-list.test.tsx`

### Acceptance criteria

- [ ] List all check-ins for selected date
- [ ] Date picker to change date
- [ ] Filter by member
- [ ] Show check-in time and method
- [ ] Manual check-in button for each member
- [ ] Today's summary (X of Y members checked in)

---

# Phase 4: WOD System

## Task 23: Implement WOD API Service

**Type:** behavioral
**Phase:** 4
**Depends on:** Task 3

### Description

Create WOD management API service.

### Files to create/modify

- `services/api/wod.ts` (new)

### Tests to write

- `__tests__/services/api/wod.test.ts`

### Acceptance criteria

- [ ] `getWods(gymId, params)` → paginated WOD list
- [ ] `getTodayWod(gymId)` → today's WOD or null
- [ ] `createWod(gymId, data)` → new WOD
- [ ] `updateWod(gymId, wodId, data)` → updated WOD
- [ ] `deleteWod(gymId, wodId)` → void
- [ ] `vote(gymId, wodId, timeSlotId?)` → vote
- [ ] `removeVote(gymId, wodId)` → void
- [ ] `getVoters(gymId, wodId)` → voter list

---

## Task 24: Create WOD Card Component

**Type:** behavioral
**Phase:** 4
**Depends on:** Task 23

### Description

Card to display WOD information.

### Files to create/modify

- `components/wod/wod-card.tsx` (new)

### Tests to write

- `__tests__/components/wod/wod-card.test.tsx`

### Acceptance criteria

- [ ] Shows title, date, description preview
- [ ] Time slots if multiple
- [ ] Vote count
- [ ] Voted status indicator
- [ ] Tap to expand/navigate to details

---

## Task 25: Create Vote Button Component

**Type:** behavioral
**Phase:** 4
**Depends on:** Task 23

### Description

Button for members to vote on WOD attendance.

### Files to create/modify

- `components/wod/vote-button.tsx` (new)
- `hooks/use-wod-vote.ts` (new)

### Tests to write

- `__tests__/components/wod/vote-button.test.tsx`

### Acceptance criteria

- [ ] "I'm In" button when not voted
- [ ] "Attending ✓" button when voted
- [ ] Time slot selector if multiple slots
- [ ] Toggle vote on tap
- [ ] Loading state during API call
- [ ] Disabled after WOD time passed

---

## Task 26: Create Today's WOD Section

**Type:** behavioral
**Phase:** 4
**Depends on:** Task 24, Task 25

### Description

Today's WOD display for home screen.

### Files to create/modify

- `components/wod/today-wod.tsx` (new)
- `app/(app)/(tabs)/index.tsx` (update)

### Tests to write

- `__tests__/components/wod/today-wod.test.tsx`

### Acceptance criteria

- [ ] Shows today's WOD card
- [ ] "No WOD today" message if none
- [ ] Vote button integrated
- [ ] Voter count display
- [ ] Tap to see full details

---

## Task 27: Create WOD List Screen

**Type:** behavioral
**Phase:** 4
**Depends on:** Task 24

### Description

Full WOD list/history screen.

### Files to create/modify

- `app/(app)/(tabs)/wod.tsx` (update)

### Tests to write

- Integration tests (manual)

### Acceptance criteria

- [ ] List of upcoming WODs
- [ ] Past WODs section
- [ ] Filter by date range
- [ ] Pull to refresh
- [ ] FAB to create WOD (manager only)

---

## Task 28: Create WOD Form Component

**Type:** behavioral
**Phase:** 4
**Depends on:** Task 23

### Description

Form for creating/editing WODs.

### Files to create/modify

- `components/wod/wod-form.tsx` (new)
- `app/(app)/wod/create.tsx` (new)
- `app/(app)/wod/[id]/edit.tsx` (new)

### Tests to write

- `__tests__/components/wod/wod-form.test.tsx`

### Acceptance criteria

- [ ] Title input
- [ ] Description textarea (markdown support)
- [ ] Date picker
- [ ] Add/remove time slots
- [ ] Capacity per slot (optional)
- [ ] Preview mode
- [ ] Submit button with validation

---

## Task 29: Create Voter List Component

**Type:** behavioral
**Phase:** 4
**Depends on:** Task 23

### Description

Display list of members who voted for WOD.

### Files to create/modify

- `components/wod/voter-list.tsx` (new)
- `app/(app)/wod/[id].tsx` (new)

### Tests to write

- `__tests__/components/wod/voter-list.test.tsx`

### Acceptance criteria

- [ ] List of voters with names
- [ ] Grouped by time slot if applicable
- [ ] Count per slot
- [ ] Manager can see all voters
- [ ] Member sees who else is attending

---

# Phase 5: Notifications & Polish

## Task 30: Setup Push Notifications

**Type:** structural
**Phase:** 5
**Depends on:** Task 5

### Description

Configure Expo push notifications.

### Files to create/modify

- `services/notifications/push-service.ts` (update)
- `hooks/use-notifications.ts` (new)
- `app/_layout.tsx` (update)

### Tests to write

- `__tests__/services/notifications/push-service.test.ts`

### Acceptance criteria

- [ ] Request notification permission
- [ ] Get Expo push token
- [ ] Register token with backend
- [ ] Handle foreground notifications
- [ ] Handle background notifications
- [ ] Handle notification tap (deep link)

---

## Task 31: Implement Notification Preferences

**Type:** behavioral
**Phase:** 5
**Depends on:** Task 30

### Description

Settings screen for notification preferences.

### Files to create/modify

- `components/settings/notification-settings.tsx` (new)
- `services/api/notifications.ts` (update)

### Tests to write

- `__tests__/components/settings/notification-settings.test.tsx`

### Acceptance criteria

- [ ] Toggle all notifications
- [ ] Toggle WOD notifications
- [ ] Toggle check-in reminders
- [ ] Set reminder time (morning, evening)
- [ ] Toggle membership expiry warnings
- [ ] Save preferences to backend

---

## Task 32: Create Profile Screen

**Type:** behavioral
**Phase:** 5
**Depends on:** Task 9

### Description

User profile and settings screen.

### Files to create/modify

- `app/(app)/(tabs)/profile.tsx` (update)
- `components/profile/profile-header.tsx` (new)
- `components/profile/settings-list.tsx` (new)

### Tests to write

- `__tests__/components/profile/profile-header.test.tsx`

### Acceptance criteria

- [ ] Profile photo and name
- [ ] Edit profile button
- [ ] Settings sections (Account, Notifications, App)
- [ ] Logout button
- [ ] App version display

---

## Task 33: Create Edit Profile Screen

**Type:** behavioral
**Phase:** 5
**Depends on:** Task 32

### Description

Screen to edit user profile.

### Files to create/modify

- `app/(app)/profile/edit.tsx` (new)
- `components/profile/profile-form.tsx` (new)
- `services/api/auth.ts` (update)

### Tests to write

- `__tests__/components/profile/profile-form.test.tsx`

### Acceptance criteria

- [ ] Edit display name
- [ ] Upload/change profile photo
- [ ] Save button with validation
- [ ] Cancel button
- [ ] Success message

---

## Task 34: Create Change Password Screen

**Type:** behavioral
**Phase:** 5
**Depends on:** Task 32

### Description

Screen to change user password.

### Files to create/modify

- `app/(app)/profile/change-password.tsx` (new)
- `components/profile/change-password-form.tsx` (new)

### Tests to write

- `__tests__/components/profile/change-password-form.test.tsx`

### Acceptance criteria

- [ ] Current password input
- [ ] New password input with strength indicator
- [ ] Confirm new password
- [ ] Submit button with validation
- [ ] Success message and sign out option

---

# Phase 6: Analytics & Reports

## Task 35: Implement Stats API

**Type:** behavioral
**Phase:** 6
**Depends on:** Task 16

### Description

Create analytics/statistics API endpoints.

### Files to create/modify

- `services/api/stats.ts` (new)

### Tests to write

- `__tests__/services/api/stats.test.ts`

### Acceptance criteria

- [ ] `getGymStats(gymId)` → overall gym statistics
- [ ] `getMemberStats(gymId, memberId)` → individual stats
- [ ] `getAttendanceRate(gymId, period)` → rate over time
- [ ] `getActiveMembers(gymId, period)` → active count

---

## Task 36: Create Gym Dashboard

**Type:** behavioral
**Phase:** 6
**Depends on:** Task 35

### Description

Dashboard for gym owners/managers with statistics.

### Files to create/modify

- `app/(app)/gym/[id]/index.tsx` (new)
- `components/gym/stats-card.tsx` (new)
- `components/gym/stats-chart.tsx` (new)

### Tests to write

- `__tests__/components/gym/stats-card.test.tsx`

### Acceptance criteria

- [ ] Active members count
- [ ] Today's check-ins
- [ ] This week's attendance rate
- [ ] This month's trends
- [ ] Quick actions (add member, post WOD)

---

## Task 37: Create Member Stats View

**Type:** behavioral
**Phase:** 6
**Depends on:** Task 35, Task 14

### Description

Detailed statistics for individual member.

### Files to create/modify

- `app/(app)/member/[id].tsx` (new)
- `components/gym/member-stats.tsx` (new)

### Tests to write

- `__tests__/components/gym/member-stats.test.tsx`

### Acceptance criteria

- [ ] Member profile info
- [ ] Membership status and period
- [ ] Attendance rate
- [ ] Current streak
- [ ] Monthly attendance chart
- [ ] WOD participation rate

---

# Additional Tasks (Structural Improvements)

## Task 38: Add Error Boundary

**Type:** structural
**Phase:** Any
**Depends on:** None

### Files to create/modify

- `components/common/error-boundary.tsx` (new)
- `app/_layout.tsx` (update)

### Acceptance criteria

- [ ] Catches render errors
- [ ] Shows fallback UI
- [ ] Option to retry
- [ ] Reports errors (future: Sentry)

---

## Task 39: Add Loading States

**Type:** structural
**Phase:** Any
**Depends on:** None

### Files to create/modify

- `components/common/loading-spinner.tsx` (new)
- `components/common/skeleton.tsx` (new)

### Acceptance criteria

- [ ] Spinner component
- [ ] Skeleton loaders for lists
- [ ] Skeleton loaders for cards
- [ ] Consistent loading UX

---

## Task 40: Add Empty States

**Type:** structural
**Phase:** Any
**Depends on:** None

### Files to create/modify

- `components/common/empty-state.tsx` (new)

### Acceptance criteria

- [ ] Illustration/icon
- [ ] Title and description
- [ ] Optional action button
- [ ] Used for empty lists, no data, etc.

---

# Summary

## Tasks by Phase

| Phase                  | Tasks             | Type Distribution          |
| ---------------------- | ----------------- | -------------------------- |
| Phase 1: Foundation    | T1-T8 (8 tasks)   | 3 structural, 5 behavioral |
| Phase 2: Gym & Members | T9-T15 (7 tasks)  | 1 structural, 6 behavioral |
| Phase 3: Attendance    | T16-T22 (7 tasks) | 0 structural, 7 behavioral |
| Phase 4: WOD           | T23-T29 (7 tasks) | 0 structural, 7 behavioral |
| Phase 5: Notifications | T30-T34 (5 tasks) | 1 structural, 4 behavioral |
| Phase 6: Analytics     | T35-T37 (3 tasks) | 0 structural, 3 behavioral |
| Additional             | T38-T40 (3 tasks) | 3 structural, 0 behavioral |

**Total: 40 tasks** (8 structural, 32 behavioral)

## Suggested Implementation Order

1. **Week 1-2:** Tasks 1-8 (Foundation)
2. **Week 3-4:** Tasks 9-15 (Gym & Members)
3. **Week 5-6:** Tasks 16-22 (Attendance)
4. **Week 7-8:** Tasks 23-29 (WOD)
5. **Week 9:** Tasks 30-34 (Notifications)
6. **Week 10:** Tasks 35-40 (Analytics + Polish)

## TDD Reminder

For each behavioral task:

1. **RED:** Write failing test first
2. **GREEN:** Write minimum code to pass
3. **REFACTOR:** Improve code quality

Commit after each phase:

- `[structural] {description}` for structural changes
- `[behavioral] {description}` for feature implementations
