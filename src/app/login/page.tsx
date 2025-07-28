// Login.tsx - Simplified structure
"use client";

import React, { useState, useEffect } from "react";
import { AuthLayout } from "@/layouts";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const router = useRouter();
  const { login, user, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/?skipIntro=true");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, senha);
      if (success) {
        setEmail("");
        setSenha("");
      }
    } catch (error) {
      toast.error("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <img
          src="/assets/Logo2.png"
          alt="Logo PUCA"
          className="w-80 h-auto mx-auto mb-6"
        />

        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Entrar</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2 font-semibold">
              Senha
            </label>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
            <button
              type="button"
              className="absolute bottom-2.5 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center mt-4">
            Não tem conta?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthLayout>
  );
}