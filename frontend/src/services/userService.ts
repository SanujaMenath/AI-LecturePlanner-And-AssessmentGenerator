import type { UserDTO, CreateUserPayload, UpdateProfilePayload } from "../types/user";
import api from "./api";

export const createUserService = async (payload: CreateUserPayload) => {
  const res = await api.post("/users/create", payload);
  return res.data;
};

export const getUsersService = async (): Promise<UserDTO[]> => {
  const res = await api.get("/users");
  return res.data;
};

export const updateProfile = async (payload: UpdateProfilePayload) =>{
  const res = await api.put("/users/me", payload);
  return res.data;   
};

export const changePassword = async (payload: { current_password: string; new_password: string }) => {
  const res = await api.put("/users/me/change-password", payload);
  return res.data;
}