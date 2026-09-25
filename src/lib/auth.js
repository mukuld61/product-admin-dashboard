// Token lives in a cookie so the server-side proxy can also read it.
const TOKEN_KEY = "token";
const MAX_AGE_SECONDS = 60 * 60; // same as the 60 min token lifetime we request at login

export function getToken() {
  if (typeof document === "undefined") return null; // no cookies on the server
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${TOKEN_KEY}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function setToken(token) {
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearToken() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
