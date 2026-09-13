interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tempoSessao');
      localStorage.setItem('expiredSessionMessage', 'Sessão Expirada. Faça login novamente.');
      window.location.href = '/';
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData,
        },
        message: response.statusText || 'Request failed',
      };
    }

    return response.json();
  }

  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const headers = skipAuth ? { 'Content-Type': 'application/json' } : this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers,
      ...fetchOptions,
    });


    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, options: FetchOptions = {}, arquivo?: File): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    let body: BodyInit | undefined;
    let headers = skipAuth ? { 'Content-Type': 'application/json' } : this.getAuthHeaders();

    if (arquivo) {
      const formData = new FormData();
      formData.append('arquivo', arquivo);

      if (data) {
        formData.append('data', JSON.stringify(data));
      }

      body = formData;
      if (headers && 'Content-Type' in headers) {
        delete headers['Content-Type'];
      }
    } else if (data) {
      body = JSON.stringify(data);
      headers = {
        ...headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body,
      ...fetchOptions,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any, options: FetchOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const headers = skipAuth ? { 'Content-Type': 'application/json' } : this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const headers = skipAuth ? { 'Content-Type': 'application/json' } : this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers,
      ...fetchOptions,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any, options: FetchOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;

    const headers = skipAuth ? { 'Content-Type': 'application/json' } : this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      credentials: 'include',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    return this.handleResponse<T>(response);
  }

  async postText(endpoint: string, data?: any, options: FetchOptions = {}): Promise<string> {
    const { skipAuth, ...fetchOptions } = options;

    const headers = skipAuth ? { 'Content-Type': 'application/json' } : this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sigecat_auth');
      localStorage.setItem('expiredSessionMessage', 'Sessão Expirada. Faça login novamente.');
      window.location.href = '/';
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.text().catch(() => '');
      throw {
        response: {
          status: response.status,
          data: errorData,
        },
        message: response.statusText || 'Request failed',
      };
    }

    return response.text();
  }
}



