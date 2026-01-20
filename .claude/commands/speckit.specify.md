# Spec-Kit Specify

Create a product specification for a new feature or enhancement.

## Instructions

1. **Gather requirements**:
   - Ask user for feature name and description
   - Identify target users and use cases
   - Clarify scope and constraints

2. **Create spec file**:
   - Location: `specs/{feature-name}.specs.md`
   - Use template from `specs/templates/feature.specs.md`

3. **Spec sections to include**:
   - Overview and problem statement
   - Functional requirements (FR-1, FR-2, etc.)
   - Non-functional requirements (NFR-1, etc.)
   - User stories with acceptance criteria
   - Technical design (components, API, data models)
   - UI/UX design
   - Test scenarios
   - Implementation plan
   - Dependencies and open questions

4. **Output**:
   - Create the spec file
   - Summarize key requirements
   - List open questions for clarification

## Arguments

- `$ARGUMENTS` - Feature name or description (optional)

## Usage

```
/speckit.specify attendance-check-in
/speckit.specify "member notification preferences"
```

Create specification before implementation to ensure clear requirements.
