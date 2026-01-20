# Spec-Kit Implement

Execute implementation tasks following TDD and Tidy First principles.

## Instructions

1. **Identify current task**:
   - Read spec file: `specs/{argument}.specs.md`
   - Determine which task to implement
   - If task number provided, implement that specific task

2. **Follow TDD cycle**:

   ```
   RED → GREEN → REFACTOR
   ```

   a. **RED**: Write a failing test first
   - Create test file if not exists
   - Write minimal test that defines expected behavior
   - Run test to confirm it fails

   b. **GREEN**: Write minimal code to pass
   - Implement just enough to make test pass
   - No extra features or optimizations
   - Run test to confirm it passes

   c. **REFACTOR**: Improve code quality
   - Remove duplication
   - Improve naming
   - Run tests to ensure still passing

3. **Follow Tidy First**:
   - Do structural changes in separate commits
   - Do behavioral changes in separate commits
   - Never mix both in same commit

4. **Commit discipline**:
   - Commit after each meaningful change
   - All tests must pass before commit
   - Run `npm run lint` before commit
   - Use format: `[structural|behavioral] Description`

5. **Output**:
   - Implementation code
   - Test code
   - Commit with proper message

## Arguments

- `$ARGUMENTS` - Spec name and optional task number (e.g., `attendance-system 1`)

## Usage

```
/speckit.implement attendance-system
/speckit.implement attendance-system 3
```

Implement one task at a time, following TDD strictly.
