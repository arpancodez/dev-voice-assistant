import { handleApiError, getRetryDelay } from './errorHandler';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface ApiRequestConfig {
  maxRetries?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

class APIClient {
  private baseUrl: string;
  private defaultConfig: Required<ApiRequestConfig>;
  private requestQueue: Promise<any> = Promise.resolve();

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseUrl = baseUrl;
    this.defaultConfig = {
      maxRetries: 3,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  private async executeWithRetry<T>(
    fn: () => Promise<Response>,
    attemptCount: number = 0,
    config: Required<ApiRequestConfig> = this.defaultConfig
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fn();
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500 && attemptCount < config.maxRetries) {
          const delay = getRetryDelay(attemptCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.executeWithRetry(fn, attemptCount + 1, config);
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      if (attemptCount < config.maxRetries) {
        const delay = getRetryDelay(attemptCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(fn, attemptCount + 1, config);
      }

      const err = error instanceof Error ? error : new Error(String(error));
      handleApiError(err);
      return {
        success: false,
        error: err.message,
        code: 'API_ERROR',
      };
    }
  }

  async get<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    return this.executeWithRetry<T>(
      () =>
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'GET',
          headers: finalConfig.headers,
        }),
      0,
      finalConfig
    );
  }

  async post<T>(
    endpoint: string,
    payload: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    return this.executeWithRetry<T>(
      () =>
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: finalConfig.headers,
          body: JSON.stringify(payload),
        }),
      0,
      finalConfig
    );
  }

  async put<T>(
    endpoint: string,
    payload: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    return this.executeWithRetry<T>(
      () =>
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers: finalConfig.headers,
          body: JSON.stringify(payload),
        }),
      0,
      finalConfig
    );
  }

  async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    return this.executeWithRetry<T>(
      () =>
        fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers: finalConfig.headers,
        }),
      0,
      finalConfig
    );
  }
}

export const apiClient = new APIClient();
export default APIClient;
