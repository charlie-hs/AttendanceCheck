# Spec-Kit Checklist

Generate a quality validation checklist for pre-release verification.

## Instructions

1. **Read the specification**:
   - Find spec file: `specs/{argument}.specs.md`
   - Extract all acceptance criteria
   - Identify test scenarios

2. **Generate checklist categories**:

   ### Functional Verification
   - [ ] All functional requirements implemented
   - [ ] All user stories acceptance criteria met
   - [ ] Edge cases handled

   ### Code Quality
   - [ ] All tests passing (`npm test`)
   - [ ] No linter warnings (`npm run lint`)
   - [ ] Code formatted (`npm run format:check`)
   - [ ] No TypeScript errors
   - [ ] No console.log statements (except warn/error)

   ### Testing Coverage
   - [ ] Unit tests for all components
   - [ ] Unit tests for all hooks
   - [ ] Integration tests for API calls
   - [ ] E2E tests for critical flows

   ### Documentation
   - [ ] Code comments for complex logic
   - [ ] README updated if needed
   - [ ] API documentation updated

   ### Performance
   - [ ] No unnecessary re-renders
   - [ ] Images optimized
   - [ ] Bundle size acceptable

   ### Accessibility
   - [ ] Screen reader labels added
   - [ ] Touch targets adequate size
   - [ ] Color contrast sufficient

3. **Output**:
   - Markdown checklist
   - Can be added to PR description
   - Tracks verification status

## Arguments

- `$ARGUMENTS` - Spec file name without extension

## Usage

```
/speckit.checklist attendance-system
```

Run checklist before creating PR or merging feature.
