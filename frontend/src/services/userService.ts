import type { CreateUserPayload } from "../types/user"

const API = import.meta.env.VITE_BASE_URL

export const createUserService = async (
  payload: CreateUserPayload,
  token: string
) => {
  const res = await fetch(`${API}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) throw await res.json()
  return res.json()
}
