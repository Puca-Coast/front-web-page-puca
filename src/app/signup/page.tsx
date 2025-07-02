"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";
import { REGEX, ERROR_MESSAGES } from "@/config/constants";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    senha?: string;
    confirmarSenha?: string;
    celular?: string;
  }>({});
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const { register, user } = useAuth();

  // Redirecionar se já está logado
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Função para validar os campos do formulário
  const validarFormulario = () => {
    const novosErros: {
      email?: string;
      senha?: string;
      confirmarSenha?: string;
      celular?: string;
    } = {};

    // Validação do Email
    if (!email) {
      novosErros.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!REGEX.EMAIL.test(email)) {
      novosErros.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    // Validação da Senha
    if (!senha) {
      novosErros.senha = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (senha.length < 6) {
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
    } else if (!REGEX.PASSWORD_STRENGTH.MEDIUM.test(senha)) {
      novosErros.senha = "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número.";
    }

    // Validação da Confirmação da Senha
    if (!confirmarSenha) {
      novosErros.confirmarSenha = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
    }

    // Validação do Celular (opcional, mas se preenchido deve ser válido)
    if (celular && !REGEX.PHONE.test(celular)) {
      novosErros.celular = ERROR_MESSAGES.INVALID_PHONE;
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para lidar com o envio do formulário (Signup)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    setLoading(true);
    try {
      const success = await register(email, senha);
      
      if (success) {
        toast.success("Cadastro realizado com sucesso!");
        
        // Limpar campos
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        setCelular("");

        // Redirecionar para a página de login com delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Background Pattern Elegante */}
      <div className="absolute inset-0 elegant-grid-bg opacity-30"></div>
      <div className="absolute inset-0 subtle-dots-bg opacity-20"></div>
      
      <Header isHome={false} />

      {/* CORRIGIDO: Container com scroll permitido */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16 relative z-10">
        <div className="flex flex-col items-center w-full max-w-md p-8 rounded-lg elegant-blur-bg shadow-xl h-11/12">
          <Image
            src="/assets/Logo2.png"
            alt="Logo PUCA"
            width={320}
            height={120}
            className="mb-6"
            priority
          />
          
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Criar Conta
            </h2>

            {/* Campo de Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors`}
                placeholder="Digite seu email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Campo de Celular */}
            <div className="mb-4">
              <label htmlFor="celular" className="block text-gray-700 mb-2 font-semibold">
                Celular (opcional)
              </label>
              <input
                type="tel"
                id="celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.celular ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors`}
                placeholder="(11) 99999-9999"
              />
              {errors.celular && (
                <p className="text-red-500 text-sm mt-1">{errors.celular}</p>
              )}
            </div>

            {/* Campo de Senha */}
            <div className="mb-4 relative">
              <label htmlFor="senha" className="block text-gray-700 mb-2 font-semibold">
                Senha *
              </label>
              <input
                type={mostrarSenha ? "text" : "password"}
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={`w-full px-3 py-2 pr-10 border ${
                  errors.senha ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors`}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? "🙈" : "👁️"}
              </button>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres com letras maiúsculas, minúsculas e números
              </p>
            </div>

            {/* Campo de Confirmar Senha */}
            <div className="mb-6 relative">
              <label
                htmlFor="confirmarSenha"
                className="block text-gray-700 mb-2 font-semibold"
              >
                Confirmar Senha *
              </label>
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={`w-full px-3 py-2 pr-10 border ${
                  errors.confirmarSenha ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors`}
                placeholder="Confirme sua senha"
                required
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                aria-label={
                  mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"
                }
              >
                {mostrarConfirmarSenha ? "🙈" : "👁️"}
              </button>
              {errors.confirmarSenha && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>
              )}
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              className="w-full p-3 mb-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>

          {/* Link para Login */}
          <p className="text-gray-700 text-center mt-4">
            Já possui uma conta?{" "}
            <button
              type="button"
              className="text-teal-500 hover:text-teal-600 font-semibold focus:outline-none"
              onClick={() => router.push("/login")}
            >
              Faça Login
            </button>
          </p>
        </div>
      </div>

      <Footer isHome={false} />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
