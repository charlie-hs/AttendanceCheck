# Spec-Kit Tasks

Break down an implementation plan into actionable development tasks.

## Instructions

1. **Read the specification and plan**:
   - Find spec file: `specs/{argument}.specs.md`
   - Review implementation phases
   - Understand dependencies between tasks

2. **Create task breakdown**:
   - Each task should be completable in one session
   - Tasks should follow TDD: test first, then implement
   - Separate structural and behavioral tasks
   - Order tasks by dependency

3. **Task format**:

   ```
   ## Task {N}: {Title}

   **Type:** structural | behavioral
   **Phase:** {phase number}
   **Depends on:** Task {X}, Task {Y}

   ### Description
   {What needs to be done}

   ### Files to create/modify
   - `path/to/file.tsx`

   ### Tests to write
   - Test case 1
   - Test case 2

   ### Acceptance criteria
   - [ ] Criterion 1
   - [ ] Criterion 2
   ```

4. **Output**:
   - Numbered task list
   - Dependency graph
   - Suggested implementation order

## Arguments

- `$ARGUMENTS` - Spec file name without extension

## Usage

```
/speckit.tasks attendance-system
```

Generate tasks after plan is reviewed and approved.
