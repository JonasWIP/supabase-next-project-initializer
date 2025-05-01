/**
 * API utility functions for making consistent external API calls
 */

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Add API base URLs here for commonly used services
const API_URLS = {
  JSONPLACEHOLDER: 'https://jsonplaceholder.typicode.com',
  // Add more API base URLs as needed:
  // GITHUB: 'https://api.github.com',
  // WEATHER: 'https://api.openweathermap.org/data/2.5',
};

// Options for fetchExternal with good defaults
interface FetchExternalOptions extends RequestInit {
  baseUrl?: string;
  path?: string;
  queryParams?: Record<string, string>;
  useAuth?: boolean;
  token?: string;
  timeout?: number;
  retry?: {
    attempts: number;
    delayMs: number;
  };
}

/**
 * Generic error handler for API responses
 */
async function handleApiResponse(response: Response) {
  // Check if the request was successful
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    let errorData = null;
    
    // Try to parse error details from response body if available
    try {
      errorData = await response.json();
      if (errorData?.message || errorData?.error) {
        errorMessage = errorData?.message || errorData?.error;
      }
    } catch {
      // If we can't parse JSON, use text instead
      try {
        const errorText = await response.text();
        if (errorText) errorMessage += ` - ${errorText}`;
      } catch {
        // If both fail, just use the status
      }
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  // For successful responses, try to parse as JSON first, then as text if that fails
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}

/**
 * Enhanced fetch wrapper for external API calls with timeouts, retries and error handling
 */
export async function fetchExternal<T = unknown>(
  url: string,
  options: FetchExternalOptions = {}
): Promise<T> {
  const {
    baseUrl,
    path,
    queryParams,
    useAuth,
    token,
    timeout = 10000,
    retry = { attempts: 1, delayMs: 1000 },
    ...fetchOptions
  } = options;

  // Build the full URL
  let fullUrl = url;
  if (baseUrl || path) {
    fullUrl = `${baseUrl || ''}${path || ''}`;
  }

  // Add query parameters if provided
  if (queryParams && Object.keys(queryParams).length) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      searchParams.append(key, value);
    }
    fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${searchParams.toString()}`;
  }

  // Prepare headers with defaults
  const headers = new Headers(fetchOptions.headers);
  
  // Add content type if not already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add authorization header if token provided
  if (useAuth && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Clone the fetch options and add our constructed headers and signal
  const requestInit: RequestInit = {
    ...fetchOptions,
    headers,
    signal: controller.signal,
  };

  // Helper function for retry logic
  async function makeRequestWithRetry(attemptsLeft: number): Promise<T> {
    try {
      const response = await fetch(fullUrl, requestInit);
      const result = await handleApiResponse(response);
      return result as T;
    } catch (error) {
      // Don't retry if we aborted or are out of attempts
      if (
        error instanceof DOMException && error.name === 'AbortError' ||
        attemptsLeft <= 1
      ) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retry.delayMs));
      
      // Try again with one less attempt
      return makeRequestWithRetry(attemptsLeft - 1);
    }
  }

  try {
    // Start the request with retries
    return await makeRequestWithRetry(retry.attempts);
  } catch (error) {
    // Convert timeout errors to something more readable
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, `Request timeout after ${timeout}ms`, { timeout });
    }
    
    // Re-throw API errors
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Convert other errors to ApiError
    throw new ApiError(
      500,
      error instanceof Error ? error.message : 'Unknown API error',
      { error }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// Convenience methods for common HTTP methods
export const api = {
  get<T = unknown>(url: string, options?: Omit<FetchExternalOptions, 'method' | 'body'>) {
    return fetchExternal<T>(url, { ...options, method: 'GET' });
  },
  
  post<T = unknown>(url: string, data?: unknown, options?: Omit<FetchExternalOptions, 'method'>) {
    return fetchExternal<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  put<T = unknown>(url: string, data?: unknown, options?: Omit<FetchExternalOptions, 'method'>) {
    return fetchExternal<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  patch<T = unknown>(url: string, data?: unknown, options?: Omit<FetchExternalOptions, 'method'>) {
    return fetchExternal<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  delete<T = unknown>(url: string, options?: Omit<FetchExternalOptions, 'method'>) {
    return fetchExternal<T>(url, { ...options, method: 'DELETE' });
  },
  
  // Shorthand for common API endpoints
  jsonPlaceholder: {
    get<T = unknown>(path: string, options?: Omit<FetchExternalOptions, 'method' | 'baseUrl'>) {
      return fetchExternal<T>('', {
        ...options,
        method: 'GET',
        baseUrl: API_URLS.JSONPLACEHOLDER,
        path,
      });
    },
    
    post<T = unknown>(path: string, data?: unknown, options?: Omit<FetchExternalOptions, 'method' | 'baseUrl'>) {
      return fetchExternal<T>('', {
        ...options,
        method: 'POST',
        baseUrl: API_URLS.JSONPLACEHOLDER,
        path,
        body: data ? JSON.stringify(data) : undefined,
      });
    },
  },
};

/**
 * Server-only API function that can safely use environment variables
 * This should ONLY be used in server components or server actions
 */
export function createServerApiClient() {
  return {
    async fetch<T = unknown>(url: string, options: FetchExternalOptions = {}) {
      // Here you can safely add server-only API keys from environment variables
      const apiKey = process.env.API_KEY;
      const headers = new Headers(options.headers);
      
      if (apiKey) {
        headers.set('X-API-Key', apiKey);
      }
      
      return fetchExternal<T>(url, {
        ...options,
        headers,
      });
    },
    
    // Add more server-only API methods as needed
  };
}