# Copilot Agent Context: Code Generation Best Practices

This document provides concise, actionable guidance for GitHub Copilot Agents to consistently generate high-quality, production-ready code. Agents must treat these best practices as the primary reference for all code generation tasks.

---

## Code Generation Best Practices

### 1. Clarity & Readability
- Use descriptive, consistent names for variables, functions, classes, and files.
- Write self-explanatory code; add comments when intent may be unclear.
- Maintain consistent indentation and code formatting.

### 2. Modularity & Structure
- Decompose logic into small, reusable, single-purpose functions or classes.
- Avoid code duplication; use shared utilities where appropriate.

### 3. Error Handling
- Proactively anticipate, detect, and gracefully handle errors.
- Use exceptions or error return types as appropriate for the language.
- Provide clear, actionable, user-friendly error messages.

### 4. Security
- Validate and sanitize all external input.
- Never hard-code secrets or sensitive data.
- Use secure, current libraries and APIs; avoid deprecated or unsafe ones.

### 5. Testing
- Provide unit tests for critical logic and edge cases.
- Use clear, descriptive test names.
- Follow the Arrange-Act-Assert pattern in tests.

### 6. Documentation
- Add docstrings/comments to all public interfaces (functions, classes, modules).
- Clearly document input types, output types, side effects, and exceptions.
- Provide concise usage examples when helpful.

### 7. Performance
- Write efficient, scalable code, but prioritize correctness and clarity.
- Avoid premature optimization.

### 8. Idiomatic Style
- Follow official or community style guides for the language/framework.
- Use appropriate linters and formatters (e.g., ESLint, Black, Prettier).

---

## Instructions for Copilot Agents

- **Always** use this file as the primary context for all code generation.
- Prioritize modular, readable, and maintainable code.
- Use explicit, semantic naming for variables and functions.
- Ensure every requirement above is addressed in implementations.
- Prefer clear, explicit solutions over clever or cryptic ones.
- Add clarifying comments where code intent could be ambiguous.
- Scaffold new files/modules/templates following recommended structure and with appropriate comments.
- For new repositories, suggest essential configuration files (e.g., `.gitignore`, `README.md`, linter configs).
- Implement optional features only if explicitly requested.

---