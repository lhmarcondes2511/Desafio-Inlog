import '@testing-library/jest-dom';

// Mock geolocation
Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn()
  },
  configurable: true
});

// Mock global functions
global.alert = jest.fn();
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Mock CSS imports
jest.mock('*.css', () => ({}), { virtual: true });

// Mock MirageJS to prevent it from running during tests
jest.mock('./services/mirage', () => ({
  makeServer: jest.fn(() => ({
    shutdown: jest.fn()
  }))
}));

// Ensure NODE_ENV is set to test (usually handled by Jest automatically)
