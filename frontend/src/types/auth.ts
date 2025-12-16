export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "lecturer" | "student"
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user_id: string;
  role: "admin" | "lecturer" | "student";
  email: string;
  full_name: string;
}

export interface AuthError {
  detail: string
}
