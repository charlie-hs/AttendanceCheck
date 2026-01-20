# Spec-Kit Analyze

Perform cross-artifact consistency check between spec, plan, and implementation.

## Instructions

1. **Gather artifacts**:
   - Specification: `specs/{argument}.specs.md`
   - Implementation: related source files
   - Tests: related test files

2. **Check consistency**:
   - All requirements have corresponding implementation
   - All user stories have acceptance tests
   - API design matches actual implementation
   - Data models match TypeScript interfaces
   - UI components match design specs

3. **Identify gaps**:
   - Missing implementations
   - Untested requirements
   - Divergence from spec
   - Undocumented changes

4. **Generate report**:

   ```
   ## Consistency Report: {spec-name}

   ### Requirements Coverage
   | Requirement | Implemented | Tested |
   | --- | --- | --- |
   | FR-1 | ✅ | ✅ |
   | FR-2 | ✅ | ❌ |

   ### Gaps Found
   - {gap description}

   ### Recommendations
   - {recommendation}
   ```

5. **Output**:
   - Consistency report
   - List of action items
   - Updated spec if changes documented

## Arguments

- `$ARGUMENTS` - Spec file name without extension

## Usage

```
/speckit.analyze attendance-system
```

Run analyze after implementation to verify completeness.
