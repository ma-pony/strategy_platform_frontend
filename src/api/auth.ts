import { request, setTokens, clearTokens } from "./client";
import type { UserRead, TokenPair } from "./types";

type RegisterResult = UserRead;

export async function register(email: string, password: string): Promise<RegisterResult> {
  return request<RegisterResult>("/auth/register", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export async function login(email: string, password: string): Promise<TokenPair> {
  const data = await request<TokenPair>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export function logout() {
  clearTokens();
}
