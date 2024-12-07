import { NextUIProvider } from "@nextui-org/react";
import SessaoUsuario from "../components/hooks/sessaoUser";
export function Providers({ children }) {
  return (
    <NextUIProvider>
      <SessaoUsuario />
      {children}
    </NextUIProvider>
  );
}
