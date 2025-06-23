// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  useParams() {
    return {};
  }
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  auth: jest.fn(() => Promise.resolve({ user: null }))
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }),
  headers: () => ({
    get: jest.fn()
  })
}));

// Mock server-only
jest.mock('server-only', () => ({}));

// Mock client-only
jest.mock('client-only', () => ({}));

// Suppress React 19 console warnings in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React does not recognize the') ||
      args[0].includes('Warning: Invalid prop') ||
      args[0].includes('Warning: React has detected a change in the order of Hooks'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
