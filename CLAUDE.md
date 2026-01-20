# AttendanceCheck

This document provides guidelines for AI coding assistants working on this project.

**Supported AI Assistants:**

- Claude (Anthropic) - Claude Code CLI, Cursor, Windsurf
- Gemini (Google) - Gemini Code Assist, AI Studio
- Serena IDE
- GitHub Copilot
- Other LLM-based coding assistants

## Overview

AttendanceCheck is a mobile application built with **React Native** and **Expo SDK 54** for managing CrossFit class reservations. The app allows members to view class schedules, make reservations, and receive notifications. Coaches can manage classes and track attendance.

## Technology Stack

- **Framework**: React Native 0.81.5, Expo SDK 54
- **Language**: TypeScript 5.9
- **Routing**: Expo Router 6
- **State Management**: React Context / Hooks
- **UI**: React Native core components, Expo packages
- **Notifications**: Expo Notifications
- **Storage**: Expo Secure Store

## Project Structure

```
AttendanceCheck/
├── app/                    # Expo Router pages (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── services/              # API clients and external services
│   ├── api/              # REST API clients
│   └── notifications/    # Push notification service
├── types/                 # TypeScript type definitions
├── constants/             # App constants and theme
├── assets/               # Images, fonts, static files
├── specs/                # Specification files for SDD
└── docs/                 # Project documentation
```

---

## Engineering Principles

### Role and Expertise

You are a senior software engineer following **Kent Beck's Test-Driven Development (TDD)** and **Tidy First** principles. Guide development following these methodologies precisely.

### Core Development Principles

- Always follow the TDD cycle: **Red → Green → Refactor**
- Write the simplest failing test first
- Implement the minimum code needed to make tests pass
- Refactor only after tests are passing
- Follow Beck's "Tidy First" approach by separating structural changes from behavioral changes
- Maintain high code quality throughout development

### TDD Methodology

1. Start by writing a failing test that defines a small increment of functionality
2. Use meaningful test names that describe behavior (e.g., `shouldDisplayClassSchedule`)
3. Make test failures clear and informative
4. Write just enough code to make the test pass - no more
5. Once tests pass, consider if refactoring is needed
6. Repeat the cycle for new functionality
7. When fixing a defect, first write a failing test that replicates the problem, then fix it

### Tidy First Approach

Separate all changes into two distinct types:

1. **STRUCTURAL CHANGES**: Rearranging code without changing behavior (renaming, extracting components, moving files)
2. **BEHAVIORAL CHANGES**: Adding or modifying actual functionality

**Rules:**

- Never mix structural and behavioral changes in the same commit
- Always make structural changes first when both are needed
- Validate structural changes do not alter behavior by running tests before and after

### Commit Discipline

Only commit when:

1. ALL tests are passing
2. ALL linter warnings have been resolved (`npm run lint`)
3. The change represents a single logical unit of work
4. Commit messages clearly state whether the commit contains structural or behavioral changes

Use small, frequent commits rather than large, infrequent ones.

### Code Quality Standards

- Eliminate duplication ruthlessly
- Express intent clearly through naming and structure
- Make dependencies explicit
- Keep components small and focused on a single responsibility
- Minimize state and side effects
- Use the simplest solution that could possibly work

---

## Coding Conventions

### Linting & Formatting

This project uses **ESLint** with Expo config and **Prettier** for code formatting.

#### ESLint Configuration

```javascript
// eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
]);
```

#### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

#### Commands

```bash
# Lint code
npm run lint

# Format code with Prettier
npx prettier --write .

# Check formatting without writing
npx prettier --check .
```

### TypeScript Guidelines

- Use strict mode (`"strict": true`)
- Prefer interfaces over type aliases for object shapes
- Use `@/*` path alias for imports
- Avoid `any` - use `unknown` when type is truly unknown
- Export types from `types/` directory

### React Native / Expo Guidelines

- Use functional components with hooks
- Prefer Expo packages over bare React Native alternatives
- Use `expo-image` instead of `Image` for better performance
- Handle platform differences with `Platform.OS` or `.ios.tsx` / `.android.tsx` files
- Use `ThemedText` and `ThemedView` for consistent theming

### File Naming Conventions

- Components: `kebab-case.tsx` (e.g., `class-card.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-theme-color.ts`)
- Types: `kebab-case.ts` (e.g., `models.ts`)
- Constants: `kebab-case.ts` (e.g., `colors.ts`)

### Import Order

```typescript
// 1. React/React Native
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. External packages
import { useRouter } from 'expo-router';

// 3. Internal imports (using @/ alias)
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { CrossFitClass } from '@/types/models';

// 4. Relative imports
import { formatTime } from './utils';
```

---

## Spec-Driven Development (SDD)

This project uses **Spec-Driven Development** with spec-kit methodology.

### Spec File Location

All specification files are stored in the `specs/` directory:

```
specs/
├── archive/              # Completed specs (after merge)
├── templates/            # Spec templates
└── {identifier}.specs.md # Active specifications
```

### Naming Convention

- **Pattern**: `{identifier}.specs.md`
- **Examples**:
  - `reservation-flow.specs.md` (feature-based)
  - `push-notifications.specs.md` (component-based)
  - `TICKET-123.specs.md` (ticket-based)

### SDD Workflow

The development workflow follows 5 phases:

1. **Constitution**: Establish project principles
2. **Specify**: Create spec file with requirements
3. **Plan**: Generate implementation plan
4. **Tasks**: Break down into actionable tasks
5. **Implement**: Execute implementation with TDD

---

## Claude Code Slash Commands

### Spec-Kit Commands

| Command                 | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `/speckit.constitution` | Establish project principles and standards       |
| `/speckit.specify`      | Create product specification                     |
| `/speckit.plan`         | Generate technical implementation plan           |
| `/speckit.tasks`        | Break down plan into actionable tasks            |
| `/speckit.implement`    | Execute implementation tasks                     |
| `/speckit.clarify`      | Address underspecified areas (optional)          |
| `/speckit.analyze`      | Cross-artifact consistency check (optional)      |
| `/speckit.checklist`    | Generate quality validation checklist (optional) |

### Development Commands

| Command   | Purpose                     |
| --------- | --------------------------- |
| `/lint`   | Run ESLint on the codebase  |
| `/format` | Run Prettier to format code |
| `/test`   | Run test suite              |
| `/build`  | Build the application       |

### Git Commands

| Command                | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `/commit`              | Create a commit with proper message format |
| `/commit --structural` | Create a structural change commit          |
| `/commit --behavioral` | Create a behavioral change commit          |

---

## Specification Files Guide

### When to Look for Spec Files

- User mentions "spec", "specification", or "requirements"
- User references a feature name (e.g., "reservation flow")
- User asks about implementation details or design decisions
- User requests to "follow the spec" or "check requirements"

### How to Reference

1. Search for files matching `*.specs.md` pattern in `specs/` directory
2. Check for feature-specific specs first
3. Reference relevant sections when implementing features

### Spec Template

```markdown
# Feature Name Specification

## Overview

Brief description of the feature.

## Requirements

### Functional Requirements

- FR-1: Description
- FR-2: Description

### Non-Functional Requirements

- NFR-1: Description

## User Stories

- As a [user], I want [goal] so that [benefit]

## API Design

Endpoint specifications if applicable.

## UI/UX Design

Component and screen specifications.

## Test Scenarios

- Scenario 1: Description
- Scenario 2: Description

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

---

## Testing

### Test Framework

- **Jest**: Test runner (via Expo)
- **React Native Testing Library**: Component testing

### Test Structure

```
__tests__/
├── components/           # Component tests
├── hooks/               # Hook tests
├── services/            # Service tests
└── utils/               # Utility tests
```

### Test Naming Convention

```typescript
describe('ClassCard', () => {
  it('should display class name and time', () => {
    // test implementation
  });

  it('should call onReserve when reserve button is pressed', () => {
    // test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- ClassCard.test.tsx
```

---

## AI Assistant Integration

This project is configured for use with AI coding assistants (Claude, Gemini, Serena, Copilot, etc.).

### File References

When referencing code, use the format: `file_path:line_number`

```
components/class-card.tsx:42
services/api/reservations.ts:15-30
```

### Context Awareness

- AI assistants can read all project files via this CLAUDE.md
- Use `@/` path alias for imports
- Keep related code in logical directories
- Use descriptive file and function names

### Best Practices for AI Assistance

1. **Be Specific**: Provide clear context when asking for help
2. **Reference Specs**: Point to relevant `.specs.md` files in `specs/` directory
3. **Incremental Changes**: Request small, focused changes
4. **Test First**: Ask for tests before implementation (TDD)
5. **Follow Conventions**: Ensure generated code follows project conventions

### LLM-Specific Notes

| Assistant       | Context File                  | Notes                          |
| --------------- | ----------------------------- | ------------------------------ |
| Claude Code     | `CLAUDE.md`                   | Auto-loaded in Claude Code CLI |
| Gemini          | `CLAUDE.md`                   | Reference this file in prompts |
| Cursor/Windsurf | `.cursorrules` or `CLAUDE.md` | Can use either format          |
| GitHub Copilot  | `CLAUDE.md`                   | Include in context as needed   |

---

## Development Workflow

### Starting Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Start on specific platform
npm run ios
npm run android
npm run web
```

### Before Committing

1. Run linter: `npm run lint`
2. Run formatter: `npx prettier --write .`
3. Run tests: `npm test`
4. Verify all checks pass
5. Create focused commit with clear message

### Commit Message Format

```
[structural|behavioral] Short description

- Detail 1
- Detail 2
```

**Examples:**

```
[structural] Extract ClassCard component from schedule screen

- Move class display logic to separate component
- No behavioral changes

[behavioral] Add reservation confirmation dialog

- Show confirmation before making reservation
- Include class details in dialog
```

**Optional AI Attribution:**

When AI assisted with the commit, you may add:

```
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Gemini <noreply@google.com>
```

---

## Environment Setup

### Required Tools

- Node.js 18+
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator

### Environment Variables

Create `.env` file for local development:

```env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_PUSH_NOTIFICATION_URL=https://push.example.com
```

---

## Common Patterns

### API Service Pattern

```typescript
// services/api/example.ts
import { apiClient } from './client';
import type { Example } from '@/types/models';

export const exampleApi = {
  getAll: () => apiClient.get<Example[]>('/examples'),
  getById: (id: string) => apiClient.get<Example>(`/examples/${id}`),
  create: (data: Partial<Example>) => apiClient.post<Example>('/examples', data),
  update: (id: string, data: Partial<Example>) => apiClient.put<Example>(`/examples/${id}`, data),
  delete: (id: string) => apiClient.delete(`/examples/${id}`),
};
```

### Component Pattern

```typescript
// components/example-component.tsx
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ExampleComponentProps {
  title: string;
  onPress?: () => void;
}

export function ExampleComponent({ title, onPress }: ExampleComponentProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>{title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### Custom Hook Pattern

```typescript
// hooks/use-example.ts
import { useState, useEffect } from 'react';
import { exampleApi } from '@/services/api/example';
import type { Example } from '@/types/models';

export function useExample(id: string) {
  const [data, setData] = useState<Example | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    exampleApi
      .getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}
```

---

## Troubleshooting

### Common Issues

1. **Metro bundler cache**: `npx expo start --clear`
2. **Node modules issues**: `rm -rf node_modules && npm install`
3. **iOS build issues**: `cd ios && pod install && cd ..`
4. **Type errors after package update**: Restart TypeScript server in IDE

### Useful Commands

```bash
# Clear all caches
npx expo start --clear

# Check Expo doctor
npx expo-doctor

# Upgrade Expo SDK
npx expo install --fix
```
