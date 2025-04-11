"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import anime from "animejs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:3000"; // Ajuste se necessário

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    anime({
      targets: formRef.current,
      opacity: [0, 1],
      translateY: [-50, 0],
      easing: "easeOutExpo",
      duration: 1000,
    });
  }, []);

  // Função para validar os campos do formulário
  const validarFormulario = () => {
    const novosErros: { email?: string; senha?: string } = {};

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

    setErrors(novosErros);

    // Retorna true se não houver erros
    return Object.keys(novosErros).length === 0;
  };

  // Função para lidar com o envio do formulário (Login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    setLoading(true);
    try {
      // Faz a requisição à rota de login da sua API
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (!data.success) {
        // Se o back-end retornar success=false
        toast.error(data.message || "Erro ao fazer login.");
      } else {
        // Login bem-sucedido
        toast.success("Login realizado com sucesso!");
        // Armazene o token e a role (se precisar) no localStorage ou cookies
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // Limpar campos
        setEmail("");
        setSenha("");

        // Redirecionar para a página inicial ou dashboard
        setTimeout(() => {
          router.push("/"); // Ajuste para a página que desejar
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      toast.error("Erro ao realizar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isHome={false} />

      {/* Container que centraliza vertical/horizontal */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          ref={formRef}
          className="flex flex-col items-center w-full max-w-md p-6 rounded-lg bg-white shadow-md"
        >
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
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 items-center justify-center`}
                placeholder="Digite sua senha"
                required
              />
              <span
                className="absolute top-10 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? "🙈" : "👁️"}
              </span>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full p-2 mb-4 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Link para Signup */}
          <p className="text-gray-700">
            Não possui uma conta?{" "}
            <span
              className="text-teal-500 cursor-pointer hover:underline"
              onClick={() => router.push("/signup")}
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </div>

      <Footer isHome={false} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}