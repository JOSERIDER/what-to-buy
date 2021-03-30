import { User } from "@/models/Users";

export const state = {
  user: {} as User | null,
};

export type State = typeof state;
