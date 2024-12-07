"use client";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import axios from "axios";
import { api } from "../../../lib/api";
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState("");
  const [mensageTipo, setMensageTipo] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (values) => {
    try {
      // Envia os dados para o endpoint da API de registro
      const response = await api.post(`/register`, values);
      setMensageTipo("success");
      setMensagem(response.data.message);
      if (response.status === 200) {
        setTimeout(() => {
          router.push("/pages/login");
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
    <div className="w-full h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex justify-center items-center">
      <div className="w-full max-w-lg h-auto bg-white p-6 rounded-lg shadow-xl">
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
            nome: "",
            username: "",
            senha: "",
            senhaConfirm: "",
          }}
          validationSchema={yup.object({
            nome: yup.string().required("Nome é obrigatório"),
            username: yup.string().required("Username é obrigatório"),
            senha: yup
              .string()
              .min(6, "Senha deve ter pelo menos 6 caracteres")
              .required("Senha é obrigatória"),
            senhaConfirm: yup
              .string()
              .oneOf([yup.ref("senha"), null], "Senhas não coincidem")
              .required("Confirmação de senha é obrigatória"),
          })}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            setFieldValue,
            touched,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  isInvalid={!!errors.nome}
                  name="nome"
                  variant="bordered"
                  placeholder="Digite seu Nome Completo"
                  fullWidth
                  value={values.nome}
                  onChange={handleChange}
                  errorMessage={errors.nome}
                />
                <Input
                  isInvalid={!!errors.sobrenome}
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
                <Input
                  isInvalid={!!errors.senhaConfirm}
                  name="senhaConfirm"
                  variant="bordered"
                  placeholder="Confirme sua Senha"
                  fullWidth
                  value={values.senhaConfirm}
                  onChange={handleChange}
                  type={isVisible ? "text" : "password"}
                  errorMessage={errors.senhaConfirm}
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
                  Criar conta
                </Button>
              </div>
            </form>
          )}
        </Formik>
        <h1 className="text-end pt-4">
          {mensagem ? <Alert color={mensageTipo}>{mensagem}</Alert> : null}
          <Link href={"/pages/login"}>Já possui uma conta? Clique aqui</Link>
        </h1>
      </div>
    </div>
  );
}
