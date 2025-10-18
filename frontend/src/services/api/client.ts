export interface ApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/v1';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(this.composeUrl(path), {
      method: 'GET',
      headers: this.defaultHeaders
    });
    return this.parseResponse<T>(response);
  }

  async post<T, B = unknown>(path: string, body?: B): Promise<T> {
    const response = await fetch(this.composeUrl(path), {
      method: 'POST',
      headers: this.defaultHeaders,
      body: body ? JSON.stringify(body) : undefined
    });
    return this.parseResponse<T>(response);
  }

  async patch<T, B = unknown>(path: string, body?: B): Promise<T> {
    const response = await fetch(this.composeUrl(path), {
      method: 'PATCH',
      headers: this.defaultHeaders,
      body: body ? JSON.stringify(body) : undefined
    });
    return this.parseResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(this.composeUrl(path), {
      method: 'DELETE',
      headers: this.defaultHeaders
    });
    return this.parseResponse<T>(response);
  }

  private composeUrl(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await this.safeParseJson(response);
      throw new ApiError(response.status, errorBody);
    }
    return this.safeParseJson<T>(response);
  }

  private async safeParseJson<T>(response: Response): Promise<T> {
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
  }
}

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly body: unknown) {
    super(`Request failed with status ${status}`);
  }
}

export const apiClient = new ApiClient();
