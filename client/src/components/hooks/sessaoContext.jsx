import { create } from "zustand";

const useToken = create((set) => ({
  tokenUsuario: null,
  setTokenUsuario: (token) => set({ tokenUsuario: token }),
}));

export default useToken;
