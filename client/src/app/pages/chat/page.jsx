"use client";
import { Avatar, Input, Button } from "@nextui-org/react";
import React, { useState } from "react";
import { RiTelegramLine } from "react-icons/ri";
import sessaoUsuario from "../../../components/hooks/sessaoContext";
import socket from "../../utils/socket";

const formatDateTime = (date) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleTimeString("pt-BR", options);
};

export default function Chat() {
  const { tokenUsuario } = sessaoUsuario();
  const [users, setUsers] = useState([]); // Lista de usuários
  const [onlineUsers, setOnlineUsers] = useState({}); // Status online/offline dos usuários
  const [userSelected, setUserSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [formattedMessages, setFormattedMessages] = useState([]);

  // Conectar ao socket e configurar eventos
  const initSocket = () => {
    if (!socket.connected) {
      console.log("Conectando ao socket...");
      socket.connect();
      socket.emit("userConnect", tokenUsuario._id); // Envia o ID do usuário para conectar
      console.log("Conectado ao socket com ID:", tokenUsuario._id);

      // Ouvir eventos do servidor
      socket.on("userStatus", handleUserStatus); // Evento para status de usuário (online/offline)
      socket.on("receiveMessage", handleReceiveMessage); // Evento para receber mensagem
      socket.on("usersList", handleUsersList); // Evento para lista de usuários conectados
      socket.on("connect_error", (err) => {
        console.error("Erro de conexão com o servidor:", err);
      });
    }
  };

  // Desconectar e limpar eventos do socket
  const disconnectSocket = () => {
    socket.off("userStatus", handleUserStatus);
    socket.off("receiveMessage", handleReceiveMessage);
    socket.off("usersList", handleUsersList); // Limpa o evento da lista de usuários
    socket.disconnect();
    console.log("Desconectado do socket");
  };

  // Manipular status dos usuários (online/offline)
  const handleUserStatus = (data) => {
    console.log("🚀 Status do usuário:", data); // Loga o status do usuário
    setOnlineUsers((prev) => {
      const updatedOnlineUsers = { ...prev };
      updatedOnlineUsers[data.userId] = data.status === "online";
      console.log("🚀 Atualizando status do usuário:", updatedOnlineUsers); // Exibe o status atualizado
      return updatedOnlineUsers;
    });
  };

  // Manipular lista de usuários conectados
  const handleUsersList = (connectedUsers) => {
    console.log("📜 Usuários conectados:", connectedUsers); // Exibe no console os usuários conectados
    setUsers(connectedUsers); // Atualiza a lista de usuários com os conectados
  };

  // Manipular mensagens recebidas
  const handleReceiveMessage = (message) => {
    console.log("📥 Mensagem recebida:", message); // Loga a mensagem recebida
    if (userSelected && message.sender === userSelected._id) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message.content, fromMe: false, timestamp: new Date() },
      ]);
    }
  };

  // Buscar mensagens ao selecionar um usuário
  const fetchMessages = async (selectedUser) => {
    console.log("🔄 Buscando mensagens de", selectedUser.nome);
    socket.emit("fetchMessages", {
      sender: tokenUsuario._id,
      recipientId: selectedUser._id,
    });
  };

  // Função para enviar mensagem
  const handleSendMessage = async () => {
    if (message.trim() && userSelected) {
      console.log("📤 Enviando mensagem para", userSelected.nome);
      socket.emit("sendMessage", {
        sender: tokenUsuario._id,
        content: message,
        recipientId: userSelected._id,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, fromMe: true, timestamp: new Date() },
      ]);
      setMessage(""); // Limpa a mensagem após enviar
      console.log("Mensagem enviada:", message);
    } else {
      console.log("Mensagem vazia ou usuário não selecionado!");
    }
  };

  // Selecionar usuário e carregar mensagens
  const handleSelectUser = (user) => {
    console.log("🔍 Usuário selecionado:", user.nome);
    setUserSelected(user);
    fetchMessages(user);
  };

  // Atualiza mensagens formatadas sempre que mensagens mudarem
  const formatMessages = () => {
    console.log("📜 Formatando mensagens");
    const formatted = messages.map((msg) => ({
      ...msg,
      text: msg.content,
    }));
    setFormattedMessages(formatted);
    console.log("Mensagens formatadas:", formatted);
  };

  // Formatar mensagens após carregar ou enviar
  React.useEffect(() => formatMessages(), [messages]);

  // Inicializa o socket e carrega a lista de usuários ao montar o componente
  React.useEffect(() => {
    console.log("👨‍💻 Inicializando o socket...");
    initSocket();
    return () => {
      console.log("👋 Desconectando o socket...");
      disconnectSocket(); // Desconectar ao sair da página
    };
  }, [tokenUsuario]);

  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="w-full h-[500px] bg-green-400 p-4">
        <div className="grid grid-cols-12 gap-3">
          {/* Lado esquerdo - Lista de usuários */}
          <div className="col-span-3 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="lg"
              />
              <span className="font-semibold text-lg">
                {tokenUsuario && tokenUsuario.nome}
              </span>
            </div>
            <div className="mb-4">
              <Button onClick={() => socket.emit("getUsers")}>
                Carregar usuários
              </Button>
            </div>
            <div className="space-y-3">
              {users.map(
                (user) =>
                  user._id !== tokenUsuario._id && (
                    <div
                      onClick={() => handleSelectUser(user)}
                      key={user._id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Avatar
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        size="sm"
                      />
                      <span>{user.nome}</span>
                      <span
                        className={`text-xs ml-2 ${
                          onlineUsers[user._id]
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {onlineUsers[user._id] ? "Online" : "Offline"}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Lado direito - Conversa com o usuário selecionado */}
          <div className="col-span-9 bg-white rounded-lg shadow-lg p-4">
            {userSelected ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      size="sm"
                    />
                    <span className="font-semibold text-lg">
                      {userSelected.nome}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      onlineUsers[userSelected._id]
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {onlineUsers[userSelected._id] ? "Online" : "Offline"}
                  </span>
                </div>
                <div
                  className="h-[400px] overflow-y-auto"
                  id="message-container"
                >
                  <div className="space-y-3">
                    {formattedMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.fromMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.fromMe
                              ? "bg-green-400 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          <div>{msg.text}</div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {formatDateTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    clearable
                    placeholder="Digite sua mensagem..."
                  />
                  <Button onClick={handleSendMessage}>
                    <RiTelegramLine size={24} />
                  </Button>
                </div>
              </>
            ) : (
              <div>Selecione um usuário para conversar</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
