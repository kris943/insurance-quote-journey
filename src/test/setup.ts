import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { server } from '@/mocks/server';

/**
 * jsdom swaps in its own AbortController/AbortSignal, but `fetch` is still Node's
 * (undici), which rejects any signal that isn't a native AbortSignal. Newer Node
 * versions enforce this, so every request made with a signal fails in tests.
 * Wrap fetch so the signal is honoured here instead of being handed to Node.
 * Installed after `server.listen()` so it sits in front of MSW's interceptor.
 */
function withJsdomAbortSupport(fetchImpl: typeof fetch): typeof fetch {
  return (input, init) => {
    const signal = init?.signal;
    if (!signal) return fetchImpl(input, init);

    const abortError = () =>
      signal.reason ?? new DOMException('The operation was aborted.', 'AbortError');
    if (signal.aborted) return Promise.reject(abortError());

    return new Promise<Response>((resolve, reject) => {
      const onAbort = () => reject(abortError());
      signal.addEventListener('abort', onAbort, { once: true });
      fetchImpl(input, { ...init, signal: undefined })
        .then(resolve, reject)
        .finally(() => signal.removeEventListener('abort', onAbort));
    });
  };
}

let mswFetch: typeof fetch;

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  mswFetch = globalThis.fetch;
  globalThis.fetch = withJsdomAbortSupport(mswFetch);
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  globalThis.fetch = mswFetch;
  server.close();
});
