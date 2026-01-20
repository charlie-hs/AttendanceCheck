# Spec-Kit Clarify

Address underspecified areas and resolve open questions in a specification.

## Instructions

1. **Read the specification**:
   - Find spec file: `specs/{argument}.specs.md`
   - Identify "Open Questions" section
   - Look for ambiguous requirements
   - Find missing details

2. **Analyze gaps**:
   - Requirements without clear acceptance criteria
   - Technical decisions not yet made
   - Edge cases not addressed
   - Dependencies not clarified

3. **Generate clarification questions**:
   - Format as specific, answerable questions
   - Provide options where applicable
   - Suggest defaults based on best practices

4. **Interactive clarification**:
   - Ask user for input on each question
   - Update spec file with answers
   - Mark questions as resolved

5. **Output**:
   - List of clarification questions
   - Updated spec file with resolved items
   - Remaining open questions (if any)

## Arguments

- `$ARGUMENTS` - Spec file name without extension

## Usage

```
/speckit.clarify attendance-system
```

Run clarify before planning if spec has open questions.
