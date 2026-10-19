export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';

const resolveUrl = (path: string) => new URL(`${API_BASE_URL}${path}`, window.location.origin);

interface RequestOptions<T> {
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
  /** Runtime validation of the response body. */
  validate: (data: unknown) => data is T;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String(data.message);
    }
  } catch {
    // Body was not JSON — fall through to a generic message.
  }
  return `Request failed with status ${response.status}`;
}

export async function request<T>(path: string, options: RequestOptions<T>): Promise<T> {
  const { method = 'GET', body, signal, validate } = options;

  let response: Response;
  try {
    response = await fetch(resolveUrl(path), {
      method,
      signal,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('Unable to reach the server. Please check your connection.');
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  const data: unknown = await response.json();
  if (!validate(data)) {
    throw new ApiError('Received an unexpected response from the server.', response.status);
  }
  return data;
}

export const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';
