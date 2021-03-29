import { User } from "@/models/Usuario";

export const state = {
  user: {} as User | null,
};

export type State = typeof state;
