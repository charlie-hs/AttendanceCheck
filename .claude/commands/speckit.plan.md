# Spec-Kit Plan

Generate a technical implementation plan from an existing specification.

## Instructions

1. **Read the specification**:
   - Find spec file in `specs/` directory
   - If `$ARGUMENTS` provided, look for `specs/{argument}.specs.md`
   - Otherwise, ask user which spec to use

2. **Analyze requirements**:
   - Review functional and non-functional requirements
   - Identify technical constraints
   - Map user stories to implementation tasks

3. **Generate implementation plan**:
   - Break down into phases (MVP first)
   - Identify component architecture
   - Define API contracts
   - Plan data model changes
   - List dependencies to install

4. **Follow TDD approach**:
   - Plan tests before implementation
   - Identify unit, integration, and E2E tests needed

5. **Follow Tidy First**:
   - Separate structural changes (refactoring, file moves)
   - Separate behavioral changes (new features)
   - Plan commit sequence

6. **Output**:
   - Technical implementation plan
   - Ordered list of tasks
   - Risk assessment
   - Estimated complexity per phase

## Arguments

- `$ARGUMENTS` - Spec file name without extension (e.g., `attendance-system`)

## Usage

```
/speckit.plan attendance-system
/speckit.plan reservation-flow
```

Generate plan after spec is complete and approved.
