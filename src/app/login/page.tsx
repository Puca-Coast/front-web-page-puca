"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";
import { REGEX, ERROR_MESSAGES } from "@/config/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, user, authLoading } = useAuth();

  // Redirecionar se já está logado
  useEffect(() => {
    console.log('🔍 Login page - Estado atual:', { user, authLoading });
    
    // Só fazer redirecionamento quando a autenticação terminar de carregar
    if (!authLoading && user) {
      console.log('🔄 Usuário já logado, redirecionando...', user);
      
      // Verificar se há um parâmetro de redirecionamento na URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirectTo');
      
      if (redirectTo) {
        console.log('🔄 Redirecionando para:', redirectTo);
        router.push(redirectTo);
      } else {
        // Redirecionamento padrão para home
        console.log('🔄 Redirecionando para home (padrão)');
        router.push("/?skipIntro=true");
      }
    } else if (!authLoading && !user) {
      console.log('🔍 Usuário não logado, permanecendo na página de login');
    } else {
      console.log('⏳ Login page - Aguardando verificação de autenticação...');
    }
  }, [user, authLoading]); // Removido router das dependências

  // Função para validar os campos do formulário
  const validarFormulario = () => {
    const novosErros: { email?: string; senha?: string } = {};

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
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para lidar com o envio do formulário (Login)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, senha);
      
      if (success) {
        // Limpar formulário
        setEmail("");
        setSenha("");
        // O redirecionamento agora é feito no AuthContext
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      toast.error("Erro ao realizar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com esqueci senha
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      toast.error("Por favor, insira seu email.");
      return;
    }

    if (!REGEX.EMAIL.test(forgotPasswordEmail)) {
      toast.error(ERROR_MESSAGES.INVALID_EMAIL);
      return;
    }

    setForgotPasswordLoading(true);
    try {
      // TODO: Implementar endpoint de esqueci senha na API
      // const response = await authService.forgotPassword(forgotPasswordEmail);
      
      // Por enquanto, simular sucesso
      toast.success("Instruções enviadas para seu email!");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error);
      toast.error("Erro ao enviar email de recuperação. Tente novamente.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Background Pattern Elegante */}
      <div className="absolute inset-0 elegant-grid-bg opacity-30"></div>
      <div className="absolute inset-0 subtle-dots-bg opacity-20"></div>
      
      <Header isHome={false} />

      {/* CORRIGIDO: Container com scroll permitido */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16 relative z-10">
        <motion.div
          className="flex flex-col items-center w-full max-w-md p-8 rounded-lg elegant-blur-bg shadow-xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
        >
          <Image
            src="/assets/Logo2.png"
            alt="Logo PUCA"
            width={320}
            height={120}
            className="mb-6"
            priority
          />

          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="w-full">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Entrar
              </h2>

              {/* Campo de Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
                  Email
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

              {/* Campo de Senha */}
              <div className="mb-4 relative">
                <label htmlFor="senha" className="block text-gray-700 mb-2 font-semibold">
                  Senha
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
              </div>

              {/* Link Esqueci Senha */}
              <div className="mb-4 text-right">
                <button
                  type="button"
                  className="text-teal-500 hover:text-teal-600 text-sm font-semibold focus:outline-none"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                className="w-full p-3 mb-4 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="w-full">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Recuperar Senha
              </h2>
              
              <p className="text-gray-600 text-center mb-6">
                Digite seu email para receber instruções de recuperação de senha.
              </p>

              <div className="mb-4">
                <label htmlFor="forgotEmail" className="block text-gray-700 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  placeholder="Digite seu email"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full p-3 mb-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={forgotPasswordLoading}
              >
                {forgotPasswordLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  "Enviar Email"
                )}
              </button>

              <button
                type="button"
                className="w-full p-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 font-semibold"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail("");
                }}
              >
                Voltar ao Login
              </button>
            </form>
          )}

          {/* Link para Signup */}
          {!showForgotPassword && (
            <p className="text-gray-700 text-center mt-4">
              Não possui uma conta?{" "}
              <button
                type="button"
                className="text-teal-500 hover:text-teal-600 font-semibold focus:outline-none"
                onClick={() => router.push("/signup")}
              >
                Cadastre-se
              </button>
            </p>
          )}
        </motion.div>
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