"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputMask from "react-input-mask"; // Para máscara de celular

const API_BASE_URL = "http://localhost:3000"; // Ajuste se necessário

export default function Signup() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [celular, setCelular] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    senha?: string;
    confirmarSenha?: string;
    celular?: string;
  }>({});
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Função para validar os campos do formulário
  const validarFormulario = () => {
    const novosErros: {
      email?: string;
      senha?: string;
      confirmarSenha?: string;
      celular?: string;
    } = {};

    // Validação do Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      novosErros.email = "O email é obrigatório.";
    } else if (!emailRegex.test(email)) {
      novosErros.email = "Insira um email válido.";
    }

    // Validação da Senha
    if (!senha) {
      novosErros.senha = "A senha é obrigatória.";
    } else if (senha.length < 6) {
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    // Validação da Confirmação da Senha
    if (!confirmarSenha) {
      novosErros.confirmarSenha = "A confirmação da senha é obrigatória.";
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não correspondem.";
    }

    // Validação do Celular
    const celularRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (!celular) {
      novosErros.celular = "O celular é obrigatório.";
    } else if (!celularRegex.test(celular)) {
      novosErros.celular = "Insira um celular válido.";
    }

    setErrors(novosErros);

    // Retorna true se não houver erros
    return Object.keys(novosErros).length === 0;
  };

  // Função para lidar com o envio do formulário (Signup)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    try {
      // Chama a rota de registro da sua API
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Erro ao realizar cadastro.");
      } else {
        toast.success("Cadastro realizado com sucesso!");
        // Limpar campos
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        setCelular("");

        // Redirecionar para a página de login
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    }
  };

  return (
    <>
      <Header isHome={false} />

      {/* Container que centraliza vertical/horizontal */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center w-full max-w-md p-6 rounded-lg bg-white shadow-md">
          <img src="../assets/Logo2.png" className="mb-6 w-80" alt="Logo" />
          <form onSubmit={handleSubmit} className="w-full">
            {/* Campo de Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder="Digite seu email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Campo de Senha */}
            <div className="mb-4 relative">
              <label htmlFor="senha" className="block text-gray-700 mb-2">
                Senha
              </label>
              <input
                type={mostrarSenha ? "text" : "password"}
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.senha ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder="Digite sua senha"
                required
              />
              <span
                className="absolute top-9 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? "🙈" : "👁️"}
              </span>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Campo de Confirmar Senha */}
            <div className="mb-4 relative">
              <label
                htmlFor="confirmarSenha"
                className="block text-gray-700 mb-2"
              >
                Confirmar Senha
              </label>
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.confirmarSenha ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder="Confirme sua senha"
                required
              />
              <span
                className="absolute top-9 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                aria-label={
                  mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"
                }
              >
                {mostrarConfirmarSenha ? "🙈" : "👁️"}
              </span>
              {errors.confirmarSenha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmarSenha}
                </p>
              )}
            </div>

            {/* Campo de Celular */}
            <div className="mb-6">
              <label htmlFor="celular" className="block text-gray-700 mb-2">
                Celular
              </label>
              <InputMask
                mask="(99) 99999-9999"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              >
                {(inputProps: any) => (
                  <input
                    type="tel"
                    id="celular"
                    {...inputProps}
                    className={`w-full px-3 py-2 border ${
                      errors.celular ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                    placeholder="(00) 00000-0000"
                    required
                  />
                )}
              </InputMask>
              {errors.celular && (
                <p className="text-red-500 text-sm mt-1">{errors.celular}</p>
              )}
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              className="w-full p-2 mb-4 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>

      <Footer isHome={false} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
