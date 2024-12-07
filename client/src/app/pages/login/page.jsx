"use client";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";
import sessaoUsuario from "../../../components/hooks/sessaoContext";
import socket from "../../utils/socket";
export default function Login() {
  const { tokenUsuario, setTokenUsuario } = sessaoUsuario();
  console.log("🚀 ~ Login ~ usuario", tokenUsuario);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [mensagem, setMensagem] = useState("");
  const [mensageTipo, setMensageTipo] = useState("");
  const router = useRouter();
  const handleSubmit = async (values) => {
    try {
      // Envia os dados para o endpoint da API de registro
      const response = await api.post(`/login`, values, {
        withCredentials: true, // Permite envio de cookies junto à requisição
      });

      setMensageTipo("success");
      setMensagem(response.data.message);
      if (response.status === 200) {
        socket.emit("userConnect", response.data.user._id);
        setTokenUsuario(response.data.user);
        setTimeout(() => {
          router.push("/pages/chat");
        }, 3000);
      }
      console.log("🚀 ~ handleSubmit ~ response", response);
    } catch (error) {
      setMensageTipo("error");
      setMensagem(error.response.data.message);
    }
    setTimeout(() => {
      setMensagem("");
    }, 3000);
  };
  return (
    <div className="w-full h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500  justify-center items-center flex flex-col">
      <div className="w-full max-w-lg h-auto bg-white p-6 rounded-lg shadow-xl ">
        <div className="flex flex-col items-center mx-4 mb-6">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="#2196F3" opacity="0.2" />
            <circle cx="60" cy="60" r="40" fill="#2196F3" opacity="0.4" />
            <circle cx="60" cy="60" r="30" fill="#2196F3" />
            <path
              d="M70 45L50 60L70 75"
              stroke="white"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          <h1 className="text-3xl font-semibold text-gray-800 py-4">
            MessageConnect
          </h1>
        </div>
        <Formik
          initialValues={{
            username: "",
            senha: "",
          }}
          validationSchema={yup.object({
            username: yup.string().required("Username é obrigatório"),
            senha: yup
              .string()
              .min(6, "Senha deve ter pelo menos 6 caracteres")
              .required("Senha é obrigatória"),
          })}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  isInvalid={!!errors.username}
                  name="username"
                  variant="bordered"
                  placeholder="Digite seu Username"
                  fullWidth
                  value={values.username}
                  onChange={handleChange}
                  errorMessage={errors.username}
                />

                <Input
                  isInvalid={!!errors.senha}
                  name="senha"
                  variant="bordered"
                  placeholder="Digite sua Senha"
                  fullWidth
                  value={values.senha}
                  onChange={handleChange}
                  type={isVisible ? "text" : "password"}
                  errorMessage={errors.senha}
                />
              </div>
              <div className="flex justify-between items-center">
                <Button auto onClick={toggleVisibility} color="gradient">
                  {isVisible ? "Esconder Senha" : "Mostrar Senha"}
                </Button>
                <Button
                  type="submit"
                  auto
                  color="primary"
                  className="w-full mt-4"
                >
                  Entrar
                </Button>
              </div>
            </form>
          )}
        </Formik>
        <h1 className="text-end pt-4">
          {mensagem ? <Alert color={mensageTipo}>{mensagem}</Alert> : null}
          <Link href={"/pages/register"}>Não tem uma conta? Clique aqui</Link>
        </h1>
      </div>
    </div>
  );
}
