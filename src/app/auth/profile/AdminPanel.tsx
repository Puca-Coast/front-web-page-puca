"use client";

import React from 'react';

// Um painel de administração básico para evitar erros de build
const AdminPanel: React.FC = () => {
  return (
    <div className="admin-panel">
      <h2 className="text-xl font-bold mb-4">Painel de Administração</h2>
      <p className="text-gray-600 mb-4">
        Bem-vindo ao painel de administração. Aqui você pode gerenciar os produtos, pedidos e usuários da loja.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Produtos</h3>
          <p className="text-sm text-gray-600">Gerenciar produtos da loja</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Pedidos</h3>
          <p className="text-sm text-gray-600">Visualizar e processar pedidos</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Usuários</h3>
          <p className="text-sm text-gray-600">Gerenciar contas de usuário</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 