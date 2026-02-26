
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmergencyFAB } from '../src/components/ui/emergency-fab';
import { AIChatPanel } from '../src/components/ui/ai-chat-panel';

// Mock the hooks and components that might cause issues
jest.mock('../src/hooks/use-gemini-live', () => ({
  useGeminiLive: () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    isConnected: false,
    isSpeaking: false,
  }),
}));

// Mock framer-motion to avoid animation issues in static render
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock other UI components if necessary, but shallow rendering might be better if possible.
// Since renderToStaticMarkup renders everything, we rely on the mocks.
// However, we are running this with `tsx`, not Jest. `jest` object won't exist.
// We need to mock by replacing imports or using a test runner.
// Since I can't easily mock imports in a standalone `tsx` script without a test runner like Vitest,
// I should use Vitest to run this verification.

// Let's create a new test file `tests/verify-a11y.test.tsx` and run it with `vitest`.
