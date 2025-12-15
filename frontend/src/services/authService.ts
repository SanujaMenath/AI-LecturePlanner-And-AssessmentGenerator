import type { LoginCredentials, AuthResponse } from "../types/auth"

const API = import.meta.env.VITE_BASE_URL

export const loginService = async (
  data: LoginCredentials
): Promise<AuthResponse> => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw await res.json()
  return res.json()
}
