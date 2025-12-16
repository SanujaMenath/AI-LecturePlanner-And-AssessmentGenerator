import type { UserDTO, CreateUserPayload } from "../types/user";
import api from "./api";

export const createUserService = async (payload: CreateUserPayload) => {
  const res = await api.post("/users/create", payload);
  return res.data;
};

export const getUsersService = async (): Promise<UserDTO[]> => {
  const res = await api.get("/users");
  return res.data;
};
