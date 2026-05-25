import '@testing-library/jest-dom/vitest';

// Important: @tanstack/react-query hooks need a QueryClientProvider context.
// If a test file doesn't provide its own mock, these defaults prevent
// "Cannot read properties of null (reading 'useContext')" errors.
// Test files that need specific mocking should use vi.mock('@tanstack/react-query')
// in their own scope, which overrides this global default.

