import api from "@/services/api";

export type UserTipo = "TURISTA" | "GUIA" | "ADMIN";

export interface AuthUser {
  id: string;
  nomeCompleto: string;
  email: string;
  fotoUrl: string | null;
  tipo: UserTipo;
  emailConfirmado: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface AuthResponse {
  token?: string;
  expiresIn?: number;
  user?: AuthUser;
  message?: string;
}

export interface CadastroInput {
  nomeCompleto: string;
  email: string;
  senha: string;
  tipo: UserTipo;
  foto?: File | null;
}

const publicRequest = { skipAuth: true };

export function saveSession(data: AuthResponse) {
  if (typeof window === "undefined") return;
  if (data.token) localStorage.setItem("token", data.token);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  if (data.expiresIn) {
    localStorage.setItem("tempoSessao", String(Date.now() + data.expiresIn * 1000));
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("tempoSessao");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const err = error as { message?: string; response?: { data?: { message?: string; errors?: Record<string, string> } } };
    const data = err.response?.data;
    if (data?.errors) {
      const details = Object.values(data.errors).filter(Boolean);
      if (details.length) return details.join(" ");
    }
    if (data?.message) return data.message;
    if (err.message && err.message !== "Request failed") return err.message;
  }
  return fallback;
}

export async function login(email: string, senha: string) {
  const data = await api.post<AuthResponse>("/auth/login", { email, senha }, publicRequest);
  if (data.token) saveSession(data);
  return data;
}

export async function cadastro(input: CadastroInput) {
  let data: AuthResponse;

  if (input.foto) {
    const formData = new FormData();
    formData.append("nomeCompleto", input.nomeCompleto);
    formData.append("email", input.email);
    formData.append("senha", input.senha);
    formData.append("tipo", input.tipo);
    formData.append("foto", input.foto);
    data = await api.postForm<AuthResponse>("/auth/cadastro", formData, publicRequest);
  } else {
    data = await api.post<AuthResponse>(
      "/auth/cadastro",
      {
        nomeCompleto: input.nomeCompleto,
        email: input.email,
        senha: input.senha,
        tipo: input.tipo,
      },
      publicRequest
    );
  }

  if (data.token) saveSession(data);
  return data;
}

export async function me() {
  const user = await api.get<AuthUser>("/auth/me");
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export async function logout() {
  try {
    await api.post<void>("/auth/logout");
  } finally {
    clearSession();
  }
}

export async function esqueciSenha(email: string) {
  return api.post<{ message: string }>("/auth/esqueci-senha", { email }, publicRequest);
}

export async function redefinirSenha(token: string, novaSenha: string) {
  return api.post<{ message?: string }>("/auth/redefinir-senha", { token, novaSenha }, publicRequest);
}

export async function confirmarEmail(token: string) {
  return api.post<{ message?: string }>("/auth/confirmar-email", { token }, publicRequest);
}
