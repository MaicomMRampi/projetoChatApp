// socket.js
"use client";
import { io } from "socket.io-client";

// Conectando ao servidor Socket.IO
const socket = io("http://localhost:3333", {
  withCredentials: true, // Permite o envio de cookies e autenticação
  transports: ["websocket"], // Especifica o transporte para o websocket
  // Opcional: Adicionar configurações para autenticação (se necessário)
  query: {
    userId: "usuario_exemplo", // Substitua isso com o ID real do usuário, se necessário
  },
});

socket.on("connect", () => {
  console.log("Conectado ao servidor Socket.IO com o ID:", socket.id);
});

// Retornar o socket para ser usado em outros lugares, se necessário
export default socket;
