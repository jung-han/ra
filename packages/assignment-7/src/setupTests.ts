import { setupServer } from "msw/node";
import "@testing-library/jest-dom";

import { handlers } from "./__mocks__/handlers";

/* msw */
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
  vi.useFakeTimers();
});

beforeEach(() => {
  vi.setSystemTime(new Date("2024-10-01"));
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
  server.close();
});
