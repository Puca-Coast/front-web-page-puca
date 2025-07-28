"use client";

import React, { useState, useEffect } from "react";
import { PageLayout } from "@/layouts";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/services/api/authService";

export default function Signup() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    celular: "",
    senha: "",
    confirmarSenha: ""
  });
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.signup({
        name: formData.nome,
        email: formData.email,
        phone: formData.celular,
        password: formData.senha,
        confirmPassword: formData.confirmarSenha,
      });
      
      if (response.success) {
        toast.success("Cadastro realizado com sucesso!");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(response.message || "Erro ao realizar cadastro");
      }
    } catch (error) {
      toast.error("Erro ao realizar cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <img
            src="/assets/Logo2.png"
            alt="Logo PUCA"
            className="w-80 h-auto mx-auto mb-6"
          />
          
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Digite seu email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Celular (opcional)
              </label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2 font-semibold">
                Senha *
              </label>
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Mínimo 6 caracteres"
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

            <div className="mb-6 relative">
              <label className="block text-gray-700 mb-2 font-semibold">
                Confirmar Senha *
              </label>
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Confirme sua senha"
                required
              />
              <button
                type="button"
                className="absolute bottom-2.5 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                {mostrarConfirmarSenha ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>

            <p className="text-center mt-4">
              Já tem conta?{" "}
              <a href="/login" className="text-teal-600 hover:underline">
                Faça Login
              </a>
            </p>
          </form>
        </div>
      </div>
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </PageLayout>
  );
}