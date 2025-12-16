import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { User, AuthResponse } from "../types/auth";
import { loginService } from "../services/authService";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

interface DecodedToken extends JwtPayload {
  sub: string;
  email: string;
  full_name: string;
  role: "admin" | "lecturer" | "student";
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      full_name: decoded.full_name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const user = useMemo(() => {
    if (!token) return null;
    return decodeToken(token);
  }, [token]);

  console.log("AuthProvider user:", user);

  const login = async (email: string, password: string) => {
    const res: AuthResponse = await loginService({ email, password });
    localStorage.setItem("token", res.access_token);
    setToken(res.access_token);
    return{ id: res.user_id,
    email: res.email,
    full_name: res.full_name,
    role: res.role,};
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
