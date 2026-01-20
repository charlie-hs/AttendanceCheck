# AttendanceCheck - Gym Management System Specification

## Overview

A comprehensive mobile application for CrossFit/gym management that handles member attendance tracking, user management with role-based access, and WOD (Workout of the Day) scheduling with attendance voting.

## Problem Statement

Gym owners and managers need a unified system to:

- Track member attendance efficiently
- Manage member registrations and active periods
- Post daily workouts and gauge member interest
- Provide members visibility into their attendance history

---

## User Roles & Permissions

| Role                    | Level | Permissions                              |
| ----------------------- | ----- | ---------------------------------------- |
| **Admin**               | 0     | System-wide access, manage all gyms      |
| **Gym Owner**           | 1     | Full control of owned gyms, manage staff |
| **Gym Manager (Staff)** | 2     | Manage members, post WODs, view reports  |
| **Gym Member**          | 3     | Check-in, view history, vote on WODs     |

### Permission Matrix

| Feature                  | Admin | Owner | Manager | Member |
| ------------------------ | ----- | ----- | ------- | ------ |
| Create Gym               | ✅    | ✅    | ❌      | ❌     |
| Manage Gym Settings      | ✅    | ✅    | ❌      | ❌     |
| Add/Remove Manager       | ✅    | ✅    | ❌      | ❌     |
| Register Member          | ✅    | ✅    | ✅      | ❌     |
| Set Member Active Period | ✅    | ✅    | ✅      | ❌     |
| Post WOD                 | ✅    | ✅    | ✅      | ❌     |
| View All Attendance      | ✅    | ✅    | ✅      | ❌     |
| Check-in                 | ❌    | ❌    | ❌      | ✅     |
| View Own History         | ✅    | ✅    | ✅      | ✅     |
| Vote on WOD              | ❌    | ❌    | ❌      | ✅     |

---

## Feature Modules

### Module 1: Authentication

#### Requirements

| ID     | Requirement                              | Priority    |
| ------ | ---------------------------------------- | ----------- |
| AUTH-1 | User can sign up with email and password | Must Have   |
| AUTH-2 | User can sign in with email and password | Must Have   |
| AUTH-3 | User can logout                          | Must Have   |
| AUTH-4 | User can reset password via email        | Should Have |
| AUTH-5 | Session persistence across app restarts  | Must Have   |
| AUTH-6 | Social login (Google, Apple)             | Could Have  |

#### User Stories

**US-AUTH-1: Sign Up**

- As a new user, I want to create an account so that I can use the app
- Acceptance Criteria:
  - [ ] Email validation (format + uniqueness)
  - [ ] Password strength requirements (min 8 chars, 1 uppercase, 1 number)
  - [ ] Display name required
  - [ ] Terms of service agreement checkbox
  - [ ] Success redirects to home screen

**US-AUTH-2: Sign In**

- As a registered user, I want to sign in so that I can access my account
- Acceptance Criteria:
  - [ ] Email + password authentication
  - [ ] "Remember me" option
  - [ ] Error messages for invalid credentials
  - [ ] Rate limiting after 5 failed attempts

**US-AUTH-3: Logout**

- As a signed-in user, I want to logout so that I can secure my account
- Acceptance Criteria:
  - [ ] Clear local session data
  - [ ] Clear secure storage tokens
  - [ ] Redirect to sign-in screen

---

### Module 2: Gym Management

#### Requirements

| ID    | Requirement                                        | Priority    |
| ----- | -------------------------------------------------- | ----------- |
| GYM-1 | Owner can create a new gym                         | Must Have   |
| GYM-2 | Owner can update gym details (name, address, logo) | Must Have   |
| GYM-3 | Owner can add managers to gym                      | Must Have   |
| GYM-4 | Owner can remove managers from gym                 | Must Have   |
| GYM-5 | Owner can view gym statistics                      | Should Have |
| GYM-6 | User can belong to multiple gyms                   | Should Have |

#### Data Model: Gym

```typescript
interface Gym {
  id: string;
  name: string;
  description?: string;
  address?: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface GymMembership {
  id: string;
  gymId: string;
  userId: string;
  role: 'owner' | 'manager' | 'member';
  activeFrom: string;
  activeUntil: string | null; // null = unlimited
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

### Module 3: Member Management

#### Requirements

| ID    | Requirement                                           | Priority    |
| ----- | ----------------------------------------------------- | ----------- |
| MEM-1 | Manager can register new member to gym                | Must Have   |
| MEM-2 | Manager can set member active period (start/end date) | Must Have   |
| MEM-3 | Manager can deactivate member                         | Must Have   |
| MEM-4 | Manager can view member list                          | Must Have   |
| MEM-5 | Manager can search/filter members                     | Should Have |
| MEM-6 | Expired members auto-marked inactive                  | Should Have |
| MEM-7 | Member invitation via email/link                      | Could Have  |

#### User Stories

**US-MEM-1: Register Member**

- As a manager, I want to register a new member so they can check in
- Acceptance Criteria:
  - [ ] Search existing users by email
  - [ ] Create new user if not exists
  - [ ] Set active period (start date, end date or unlimited)
  - [ ] Send welcome notification to member

**US-MEM-2: Set Active Period**

- As a manager, I want to set/extend a member's active period
- Acceptance Criteria:
  - [ ] View current active period
  - [ ] Set new end date
  - [ ] Option for unlimited membership
  - [ ] History of period changes

---

### Module 4: Attendance (Check-in)

#### Requirements

| ID    | Requirement                                   | Priority    |
| ----- | --------------------------------------------- | ----------- |
| ATT-1 | Member can check in once per day              | Must Have   |
| ATT-2 | Member can view their attendance history      | Must Have   |
| ATT-3 | Check-in only allowed during active period    | Must Have   |
| ATT-4 | Manager can view all member attendance        | Must Have   |
| ATT-5 | Attendance statistics (streak, monthly count) | Should Have |
| ATT-6 | Manual check-in by manager (for member)       | Should Have |
| ATT-7 | Check-in requires location verification       | Could Have  |

#### User Stories

**US-ATT-1: Daily Check-in**

- As a member, I want to check in once per day to record my attendance
- Acceptance Criteria:
  - [ ] Big, prominent check-in button on home screen
  - [ ] Disabled if already checked in today
  - [ ] Disabled if membership expired
  - [ ] Shows confirmation with timestamp
  - [ ] Updates attendance streak

**US-ATT-2: View Attendance History**

- As a member, I want to see my attendance history
- Acceptance Criteria:
  - [ ] Calendar view with check-in marks
  - [ ] List view with dates and times
  - [ ] Current streak display
  - [ ] Monthly/yearly statistics

#### Data Model: Attendance

```typescript
interface Attendance {
  id: string;
  gymId: string;
  userId: string;
  checkInDate: string; // YYYY-MM-DD
  checkInTime: string; // ISO timestamp
  method: 'self' | 'manual'; // self check-in or manager manual
  createdBy: string; // userId who created the record
  location?: {
    latitude: number;
    longitude: number;
  };
}
```

---

### Module 5: WOD (Workout of the Day)

#### Requirements

| ID    | Requirement                              | Priority    |
| ----- | ---------------------------------------- | ----------- |
| WOD-1 | Manager can post WOD for a specific date | Must Have   |
| WOD-2 | Manager can edit/delete WOD              | Must Have   |
| WOD-3 | Member can view today's WOD              | Must Have   |
| WOD-4 | Member can vote to attend WOD            | Must Have   |
| WOD-5 | Manager can see vote count/list          | Must Have   |
| WOD-6 | WOD can have multiple time slots         | Should Have |
| WOD-7 | Push notification when WOD posted        | Should Have |
| WOD-8 | WOD templates for quick posting          | Could Have  |

#### User Stories

**US-WOD-1: Post WOD**

- As a manager, I want to post the daily workout
- Acceptance Criteria:
  - [ ] Title and description fields
  - [ ] Date selection (default today)
  - [ ] Optional time slots
  - [ ] Rich text or markdown support
  - [ ] Preview before posting

**US-WOD-2: Vote to Attend**

- As a member, I want to vote that I'll attend today's WOD
- Acceptance Criteria:
  - [ ] Simple "I'm in" button
  - [ ] Select time slot if multiple
  - [ ] Can change vote until WOD time
  - [ ] See other members who voted

#### Data Model: WOD

```typescript
interface WOD {
  id: string;
  gymId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  timeSlots?: TimeSlot[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TimeSlot {
  id: string;
  startTime: string; // HH:mm
  endTime: string;
  capacity?: number;
}

interface WODVote {
  id: string;
  wodId: string;
  timeSlotId?: string;
  userId: string;
  createdAt: string;
}
```

---

## Additional Features (AI Suggested)

### Module 6: Notifications

| ID    | Requirement                                   | Priority    |
| ----- | --------------------------------------------- | ----------- |
| NOT-1 | Push notification for new WOD                 | Should Have |
| NOT-2 | Reminder to check-in (configurable time)      | Should Have |
| NOT-3 | Membership expiration warning (7 days before) | Should Have |
| NOT-4 | Notification preferences in settings          | Should Have |

### Module 7: Analytics & Reports

| ID    | Requirement                         | Priority    |
| ----- | ----------------------------------- | ----------- |
| RPT-1 | Member attendance rate              | Should Have |
| RPT-2 | Daily/weekly/monthly active members | Should Have |
| RPT-3 | WOD participation trends            | Could Have  |
| RPT-4 | Export reports (CSV/PDF)            | Could Have  |

### Module 8: Profile & Settings

| ID    | Requirement                | Priority    |
| ----- | -------------------------- | ----------- |
| PRF-1 | Edit profile (name, photo) | Must Have   |
| PRF-2 | Change password            | Must Have   |
| PRF-3 | Notification preferences   | Should Have |
| PRF-4 | App theme (light/dark)     | Could Have  |

---

## Technical Architecture

### Screen Structure (Expo Router)

```
app/
├── (auth)/
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   └── forgot-password.tsx
├── (app)/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home (Check-in + Today's WOD)
│   │   ├── history.tsx        # Attendance history
│   │   ├── wod.tsx            # WOD list
│   │   └── profile.tsx        # Profile & settings
│   ├── gym/
│   │   ├── [id]/
│   │   │   ├── index.tsx      # Gym details
│   │   │   ├── members.tsx    # Member management
│   │   │   ├── settings.tsx   # Gym settings
│   │   │   └── reports.tsx    # Analytics
│   │   └── create.tsx         # Create gym
│   ├── member/
│   │   ├── [id].tsx           # Member details
│   │   └── register.tsx       # Register member
│   └── wod/
│       ├── [id].tsx           # WOD details
│       └── create.tsx         # Create WOD
└── _layout.tsx
```

### Component Architecture

```
components/
├── auth/
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   └── auth-guard.tsx
├── attendance/
│   ├── check-in-button.tsx
│   ├── attendance-calendar.tsx
│   ├── attendance-list.tsx
│   └── streak-badge.tsx
├── gym/
│   ├── gym-card.tsx
│   ├── gym-selector.tsx
│   └── member-list.tsx
├── wod/
│   ├── wod-card.tsx
│   ├── wod-form.tsx
│   ├── vote-button.tsx
│   └── voter-list.tsx
├── common/
│   ├── loading-spinner.tsx
│   ├── error-boundary.tsx
│   └── empty-state.tsx
└── ui/
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    └── modal.tsx
```

### Service Architecture

```
services/
├── api/
│   ├── client.ts          # API client with auth
│   ├── auth.ts            # Authentication endpoints
│   ├── gyms.ts            # Gym CRUD
│   ├── members.ts         # Member management
│   ├── attendance.ts      # Check-in endpoints
│   └── wod.ts             # WOD endpoints
├── auth/
│   └── auth-context.tsx   # Auth state management
├── storage/
│   └── secure-storage.ts  # Token storage
└── notifications/
    └── push-service.ts    # Push notifications
```

### State Management

```
contexts/
├── auth-context.tsx       # User authentication state
├── gym-context.tsx        # Current gym selection
└── notification-context.tsx
```

---

## Implementation Plan

### Phase 1: Foundation (MVP Core)

**Priority: Must Have | Estimated Tasks: 15-20**

1. **Authentication Module**
   - Sign up / Sign in / Logout screens
   - Session persistence with Expo Secure Store
   - Auth context and navigation guards
   - Form validation with error handling

2. **Basic Data Models**
   - User, Gym, GymMembership TypeScript interfaces
   - API client setup with interceptors
   - Mock API for development

3. **Navigation Structure**
   - Auth flow (sign-in, sign-up, forgot-password)
   - Main app tab navigation
   - Route protection based on auth state

### Phase 2: Gym & Member Management

**Priority: Must Have | Estimated Tasks: 12-15**

1. **Gym Management**
   - Create gym screen
   - Gym details & settings
   - Gym selector for multi-gym users

2. **Member Management**
   - Member registration flow
   - Set active period (date picker)
   - Member list with search/filter
   - Member detail view

### Phase 3: Attendance System

**Priority: Must Have | Estimated Tasks: 10-12**

1. **Check-in Feature**
   - Daily check-in button (home screen)
   - Check-in validation (active period, once per day)
   - Check-in confirmation with timestamp

2. **Attendance History**
   - Calendar view component
   - List view with pagination
   - Streak calculation and display

3. **Manager View**
   - All member attendance list
   - Filter by date range
   - Manual check-in for members

### Phase 4: WOD System

**Priority: Must Have | Estimated Tasks: 10-12**

1. **WOD Posting (Manager)**
   - Create/Edit WOD form
   - Date and time slot selection
   - WOD list management

2. **WOD Viewing & Voting (Member)**
   - Today's WOD display on home
   - Vote to attend button
   - Voter list display

3. **WOD History**
   - Past WODs archive
   - Attendance record per WOD

### Phase 5: Notifications & Polish

**Priority: Should Have | Estimated Tasks: 8-10**

1. **Push Notifications**
   - Notification permission flow
   - New WOD notification
   - Check-in reminder
   - Membership expiration warning

2. **Profile & Settings**
   - Edit profile screen
   - Change password
   - Notification preferences
   - Theme toggle (light/dark)

### Phase 6: Analytics & Reports

**Priority: Could Have | Estimated Tasks: 6-8**

1. **Basic Analytics**
   - Member attendance rate
   - Active members count
   - WOD participation stats

2. **Reports (Future)**
   - Export functionality
   - Advanced charts

---

## API Endpoints (Backend Contract)

### Authentication

```
POST   /api/auth/register        # Sign up
POST   /api/auth/login           # Sign in
POST   /api/auth/logout          # Logout
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/forgot-password # Request password reset
POST   /api/auth/reset-password  # Reset password
GET    /api/auth/me              # Get current user
```

### Gyms

```
GET    /api/gyms                 # List user's gyms
POST   /api/gyms                 # Create gym
GET    /api/gyms/:id             # Get gym details
PUT    /api/gyms/:id             # Update gym
DELETE /api/gyms/:id             # Delete gym
```

### Members

```
GET    /api/gyms/:gymId/members              # List members
POST   /api/gyms/:gymId/members              # Register member
GET    /api/gyms/:gymId/members/:id          # Get member details
PUT    /api/gyms/:gymId/members/:id          # Update member
DELETE /api/gyms/:gymId/members/:id          # Remove member
PUT    /api/gyms/:gymId/members/:id/period   # Set active period
```

### Attendance

```
GET    /api/gyms/:gymId/attendance           # List attendance
POST   /api/gyms/:gymId/attendance           # Check in (self or manual)
GET    /api/gyms/:gymId/attendance/me        # My attendance history
GET    /api/gyms/:gymId/attendance/stats     # Attendance statistics
GET    /api/gyms/:gymId/attendance/today     # Today's check-in status
```

### WOD

```
GET    /api/gyms/:gymId/wods                 # List WODs
POST   /api/gyms/:gymId/wods                 # Create WOD
GET    /api/gyms/:gymId/wods/:id             # Get WOD details
PUT    /api/gyms/:gymId/wods/:id             # Update WOD
DELETE /api/gyms/:gymId/wods/:id             # Delete WOD
GET    /api/gyms/:gymId/wods/today           # Get today's WOD
POST   /api/gyms/:gymId/wods/:id/vote        # Vote to attend
DELETE /api/gyms/:gymId/wods/:id/vote        # Remove vote
GET    /api/gyms/:gymId/wods/:id/voters      # List voters
```

---

## Dependencies to Install

| Package                | Purpose                 | Priority    |
| ---------------------- | ----------------------- | ----------- |
| react-hook-form        | Form handling           | Must Have   |
| zod                    | Schema validation       | Must Have   |
| @tanstack/react-query  | Data fetching & caching | Must Have   |
| date-fns               | Date utilities          | Must Have   |
| expo-location          | Location verification   | Should Have |
| react-native-calendars | Calendar component      | Should Have |

---

## Open Questions

1. **Backend**: Will there be a separate backend project, or use mock API/Firebase?
2. **Multi-gym**: Can a member belong to multiple gyms simultaneously?
3. **Offline support**: Should check-ins work offline and sync later?
4. **Time zones**: How to handle gyms in different time zones?
5. **WOD types**: Besides WOD, what other event types (seminars, competitions)?
6. **Payment integration**: Will there be subscription/payment features?

---

## Revision History

| Date       | Version | Author       | Changes                                |
| ---------- | ------- | ------------ | -------------------------------------- |
| 2024-01-19 | 1.0     | AI Assistant | Initial specification (check-in only)  |
| 2024-01-20 | 2.0     | AI Assistant | Complete rewrite with full feature set |
