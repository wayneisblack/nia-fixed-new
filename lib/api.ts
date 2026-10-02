"use client";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function apiUrl(path: string) {
  return `${apiBase}${path}`;
}

export function apiFetch(path: string, init: RequestInit = {}) {
  const token = window.localStorage.getItem("nia-api-token");
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(apiUrl(path), { ...init, headers });
}

export function setApiToken(token: string) {
  window.localStorage.setItem("nia-api-token", token);
}

export function clearApiToken() {
  window.localStorage.removeItem("nia-api-token");
}
