const TOKEN_STORAGE_KEY = "token";
const NAME_STORAGE_KEY = "name";
const TOKEN_EXPIRY_SKEW_MS = 30_000;

type JwtPayload = {
  exp?: number;
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(window.atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(NAME_STORAGE_KEY);
};

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const isTokenExpired = (
  token: string,
  now = Date.now(),
  skewMs = TOKEN_EXPIRY_SKEW_MS
) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  return payload.exp * 1000 <= now + skewMs;
};

export const getValidStoredToken = () => {
  const token = getStoredToken();
  if (!token) return null;

  if (isTokenExpired(token)) {
    clearStoredAuth();
    return null;
  }

  return token;
};

export const hasValidStoredToken = () => Boolean(getValidStoredToken());

export const storeAuth = ({
  token,
  name,
}: {
  token: string;
  name?: string;
}) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  if (name) localStorage.setItem(NAME_STORAGE_KEY, name);
};
