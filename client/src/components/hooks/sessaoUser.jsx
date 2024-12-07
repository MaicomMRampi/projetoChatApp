"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../../lib/api";

const AuthCheck = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname(); // Obtém o caminho da URL atual
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Verifica se não está nas páginas de login ou registro

    const checkAuth = async () => {
      try {
        const response = await api.get("/verificaSessao", {
          withCredentials: true,
        });
        console.log("🚀 ~ checkAuth ~ response", response);
        if (response.status === 200) {
          setIsAuthenticated(true); // Usuário autenticado
        }
      } catch (error) {
        setIsAuthenticated(false); // Usuário não autenticado
        router.push("/pages/login"); // Redireciona para a página de login
      }
    };

    checkAuth();
  }, [router, pathname]); // Adicionando pathname e router como dependências

  if (isAuthenticated === null) {
    return null; // Exibe um carregamento enquanto verifica a autenticação
  }

  return isAuthenticated ? children : null; // Se autenticado, renderiza os filhos (páginas), caso contrário, nada
};

export default AuthCheck;
