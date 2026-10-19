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

  private async handleResponse<T>(response: Response, skipAuth = false): Promise<T> {
    if (response.status === 401 && !skipAuth) {
      const tinhaSessao = Boolean(localStorage.getItem('token'));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tempoSessao');
      const voltar = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
      if (tinhaSessao) {
        localStorage.setItem('expiredSessionMessage', 'Sessão expirada. Faça login novamente.');
        window.location.href = `/login?redirect=${voltar}`;
      } else {
        const motivo = encodeURIComponent('Entre na sua conta para continuar.');
        window.location.href = `/login?redirect=${voltar}&motivo=${motivo}`;
      }
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        (errorData && typeof errorData === 'object' && 'message' in errorData && typeof errorData.message === 'string'
          ? errorData.message
          : null) || response.statusText || 'Request failed';
      throw {
        response: {
          status: response.status,
          data: errorData,
        },
        message,
      };
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
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


    return this.handleResponse<T>(response, skipAuth);
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

    return this.handleResponse<T>(response, skipAuth);
  }

  async postForm<T>(endpoint: string, formData: FormData, options: FetchOptions = {}): Promise<T> {
    const { skipAuth, ...fetchOptions } = options;
    const headers: HeadersInit = {};

    if (!skipAuth) {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
      ...fetchOptions,
    });

    return this.handleResponse<T>(response, skipAuth);
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

    return this.handleResponse<T>(response, skipAuth);
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

    return this.handleResponse<T>(response, skipAuth);
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

    return this.handleResponse<T>(response, skipAuth);
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

const api = new ApiService(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

export default api;



