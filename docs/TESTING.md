# StudyZoom Testing Documentation

This document outlines the testing strategy and procedures for the StudyZoom application.

## Testing Infrastructure

StudyZoom uses a comprehensive testing approach with multiple layers:

1. **Unit Tests** - Using Jest and React Testing Library
2. **End-to-End Tests** - Using Playwright
3. **Error Monitoring** - Using Sentry

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode during development
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Run all E2E tests headlessly
npm run test:e2e

# Run E2E tests with UI for debugging
npm run test:e2e:ui
```

## Test Organization

### Unit Tests

Unit tests are organized in the `__tests__` directory, mirroring the structure of the source code:

- `__tests__/schemas/` - Tests for schema validators
- `__tests__/actions/` - Tests for server actions
- `__tests__/components/` - Tests for React components

### E2E Tests

E2E tests are located in the `e2e` directory and focus on critical user flows:

- `e2e/upload-generate-flashcards.spec.ts` - Tests document upload and flashcard generation
- `e2e/quiz-generation-and-taking.spec.ts` - Tests quiz generation and taking

## Testing Best Practices

1. **Test Coverage** - Aim for at least 80% coverage for critical paths
2. **Isolated Tests** - Unit tests should be isolated with proper mocking
3. **Realistic E2E Tests** - E2E tests should simulate real user behavior
4. **Test Data** - Use fixtures for consistent test data
5. **Error Cases** - Test both success and error paths

## Error Handling

StudyZoom uses a multi-layered approach to error handling:

1. **React Error Boundaries** - Catch and display UI errors gracefully
2. **Server-Side Error Handling** - Structured error responses from server actions
3. **Sentry Integration** - Real-time error monitoring and reporting

## Security Testing

Security testing focuses on:

1. **Authentication** - Ensuring proper user authentication
2. **Authorization** - Verifying resource ownership and access control
3. **Input Validation** - Preventing injection attacks
4. **File Upload Security** - Restricting file types and sizes

## Performance Testing

Performance optimization focuses on:

1. **Database Query Optimization** - Using composite indexes
2. **Asset Loading** - Implementing lazy loading for images and PDFs
3. **Bundle Size** - Monitoring and optimizing JavaScript bundle size

## Continuous Integration

Tests are automatically run on:

1. **Pull Requests** - All tests must pass before merging
2. **Main Branch** - Tests run after each merge to main

## Domain-Aligned Testing

As part of our domain alignment refactoring:

1. All tests use the new domain-aligned terminology (StudyGroup instead of Organization)
2. Tests verify both new functions and backward compatibility aliases
3. Tests ensure that the refactoring doesn't break existing functionality
