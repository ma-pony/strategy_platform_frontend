const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

/** Backend business error codes */
export const API_CODE = {
  SUCCESS: 0,
  AUTH_FAILED: 1001,
  FORBIDDEN: 1002,
  MEMBERSHIP_INSUFFICIENT: 1003,
  LOGIN_FAILED: 1004,
  ACCOUNT_DISABLED: 1005,
  VALIDATION_ERROR: 2001,
  NOT_FOUND: 3001,
  CONFLICT: 3002,
  UNSUPPORTED_STRATEGY_TYPE: 3003,
  EMAIL_TAKEN: 3010,
  SERVER_ERROR: 5000,
  ENGINE_ERROR: 5001,
} as const;

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

type TokenStore = {
  accessToken: string | null;
  refreshToken: string | null;
};

const tokenStore: TokenStore = {
  accessToken: null,
  refreshToken: null,
};

export function setTokens(access: string | null, refresh: string | null) {
  tokenStore.accessToken = access;
  tokenStore.refreshToken = refresh;
  if (access) {
    localStorage.setItem("sp_access_token", access);
  } else {
    localStorage.removeItem("sp_access_token");
  }
  if (refresh) {
    localStorage.setItem("sp_refresh_token", refresh);
  } else {
    localStorage.removeItem("sp_refresh_token");
  }
}

export function getTokens(): TokenStore {
  if (!tokenStore.accessToken) {
    tokenStore.accessToken = localStorage.getItem("sp_access_token");
    tokenStore.refreshToken = localStorage.getItem("sp_refresh_token");
  }
  return tokenStore;
}

export function clearTokens() {
  setTokens(null, null);
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const json = (await res.json()) as ApiResponse<{ access_token: string }>;
    if (json.code !== 0) {
      clearTokens();
      return null;
    }
    const newAccess = json.data.access_token;
    setTokens(newAccess, refreshToken);
    return newAccess;
  } catch {
    clearTokens();
    return null;
  }
}

export class ApiError extends Error {
  code: number;
  status: number;

  constructor(message: string, code: number, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  params?: Record<string, string | number | undefined>;
};

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, params } = opts;

  let url = `${API_BASE}${path}`;
  if (params) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") sp.set(k, String(v));
    }
    const qs = sp.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const { accessToken } = getTokens();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError(
      err instanceof TypeError ? "网络连接失败，请检查网络后重试" : "请求失败",
      -1,
      0,
    );
  }

  // Auto-refresh on 401
  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      try {
        res = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
      } catch (err) {
        throw new ApiError(
          err instanceof TypeError ? "网络连接失败，请检查网络后重试" : "请求失败",
          -1,
          0,
        );
      }
    }
  }

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("服务器返回格式异常", -1, res.status);
  }

  if (!res.ok || json.code !== 0) {
    throw new ApiError(json.message || "请求失败", json.code, res.status);
  }

  return json.data;
}
