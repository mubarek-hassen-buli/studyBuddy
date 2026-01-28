import { authClient } from "../auth-client";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const session = await authClient.getSession();
  
  const headers = new Headers(options.headers);
  if (session?.data?.session?.token) {
    headers.set("Authorization", `Bearer ${session.data.session.token}`);
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_URL}${cleanEndpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error [${response.status}]:`, errorText);
    
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || "An error occurred" };
    }
    
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetcher(endpoint),
  post: (endpoint: string, body: any) => fetcher(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),
  put: (endpoint: string, body: any) => fetcher(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }),
  delete: (endpoint: string) => fetcher(endpoint, { method: "DELETE" }),
  upload: (endpoint: string, formData: FormData) => fetcher(endpoint, {
    method: "POST",
    body: formData,
    // Note: We don't set Content-Type header here so the browser 
    // sets it automatically with the correct boundary for FormData
  }),
};
