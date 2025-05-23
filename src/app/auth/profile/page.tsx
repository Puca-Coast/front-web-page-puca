"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AdminPanel from "./AdminPanel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://puca-api.vercel.app";

interface UserData {
  email: string;
  role: string;
  location?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // "info" ou "extra"
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
        }
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          toast.error(data.message || "Erro ao carregar perfil.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Erro ao carregar perfil.");
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Header isHome={false} />
      
      {/* Ajuste aqui o pt-24 ou outro valor que empurre o conteúdo para baixo */}
      <div className="min-h-screen pt-24 px-4 pb-10 flex flex-col items-center">
        {/* Título da página ou algo adicional, se quiser */}
        
        {/* Caixa de conteúdo */}
        <div className="w-full max-w-7xl bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Perfil</h1>

          {/* Navegação entre abas */}
          <div className="flex border-b mb-4">
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === "info"
                  ? "border-b-2 border-teal-500 font-bold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Informações
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === "extra"
                  ? "border-b-2 border-teal-500 font-bold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("extra")}
            >
              {user && user.role === "admin"
                ? "Painel Admin"
                : "Pedidos Comprados"}
            </button>
          </div>

          {/* Conteúdo das abas */}
          {activeTab === "info" && (
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Localização:</strong>{" "}
                {user?.location ? user.location : "Não definida"}
              </p>
              <p>
                <strong>Papel:</strong> {user?.role}
              </p>
            </div>
          )}

          {activeTab === "extra" && (
            <div>
              {user && user.role === "admin" ? (
                <AdminPanel />
              ) : (
                <div>
                  <h2 className="text-xl font-bold mb-2">Pedidos Comprados</h2>
                  <p>
                    Aqui você pode visualizar o histórico de pedidos e acompanhar
                    o status das suas compras.
                  </p>
                  {/* Implementação futura de pedidos */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer isHome={false} />
    </>
  );
}
