"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000";
const AVAILABLE_SIZES = ["PP", "P", "M", "G", "GG", "XG"];

interface StockBySize {
  size: string;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  hoverImageUrl: string;
  stockBySize: StockBySize[];
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Campos do formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewHoverImage, setPreviewHoverImage] = useState("");
  const [stockBySize, setStockBySize] = useState<StockBySize[]>([]);
  const [tempSize, setTempSize] = useState("");
  const [tempStock, setTempStock] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error("Erro ao carregar produtos.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar produtos.");
    }
    setLoadingProducts(false);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stockBySize", JSON.stringify(stockBySize));

    if (imageFile) formData.append("image", imageFile);
    if (hoverImageFile) formData.append("hoverImage", hoverImageFile);

    const method = editProductId ? "PUT" : "POST";
    const url = editProductId
      ? `${API_BASE_URL}/api/products/${editProductId}`
      : `${API_BASE_URL}/api/products`;

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editProductId ? "Produto atualizado!" : "Produto criado!");
        resetForm();
        fetchProducts();
      } else {
        toast.error(data.message || "Erro no cadastro.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar produto.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Deseja excluir este produto?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Produto deletado.");
          fetchProducts();
        } else {
          toast.error(data.message || "Erro ao deletar.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar produto.");
      }
    }
  }

  function handleEdit(product: Product) {
    setEditProductId(product._id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price);
    setStockBySize(product.stockBySize || []);
    setPreviewImage(`${API_BASE_URL}/api/products/image/${product.imageUrl}`);
    setPreviewHoverImage(`${API_BASE_URL}/api/products/image/${product.hoverImageUrl}`);
    setImageFile(null);
    setHoverImageFile(null);
  }

  function resetForm() {
    setEditProductId(null);
    setName("");
    setDescription("");
    setPrice(0);
    setImageFile(null);
    setHoverImageFile(null);
    setPreviewImage("");
    setPreviewHoverImage("");
    setStockBySize([]);
    setTempSize("");
    setTempStock(0);
  }

  function handleAddSizeStock() {
    if (!tempSize) {
      toast.error("Selecione um tamanho.");
      return;
    }
    if (!tempStock || tempStock < 0) {
      toast.error("Digite um estoque válido.");
      return;
    }
    const existing = stockBySize.find((item) => item.size === tempSize);
    if (existing) {
      const updated = stockBySize.map((item) =>
        item.size === tempSize
          ? { ...item, stock: item.stock + tempStock }
          : item
      );
      setStockBySize(updated);
    } else {
      setStockBySize([...stockBySize, { size: tempSize, stock: tempStock }]);
    }
    setTempSize("");
    setTempStock(0);
  }

  function handleRemoveSize(size: string) {
    setStockBySize(stockBySize.filter((item) => item.size !== size));
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6 flex-col md:flex-row">
      {/* FORMULÁRIO (Coluna Esquerda) */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          {editProductId ? "Editar Produto" : "Adicionar Produto"}
        </h2>
        <form
          onSubmit={handleFormSubmit}
          className="bg-white p-4 rounded shadow space-y-4"
        >
          <div>
            <label className="block font-semibold">Nome:</label>
            <input
              type="text"
              className="border rounded p-2 w-full mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Descrição:</label>
            <textarea
              className="border rounded p-2 w-full mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Preço (R$):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border rounded p-2 w-full mt-1"
              placeholder="Ex: 99.90"
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          {/* Imagem Principal */}
          <div>
            <label className="block font-semibold">Imagem Principal:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
              className="mt-1"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover border rounded"
              />
            )}
          </div>

          {/* Imagem Hover */}
          <div>
            <label className="block font-semibold">Imagem Hover:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setHoverImageFile(file);
                  setPreviewHoverImage(URL.createObjectURL(file));
                }
              }}
              className="mt-1"
            />
            {previewHoverImage && (
              <img
                src={previewHoverImage}
                alt="Hover Preview"
                className="mt-2 w-32 h-32 object-cover border rounded"
              />
            )}
          </div>

          {/* Estoque por Tamanho */}
          <div>
            <p className="font-semibold mb-1">Estoque por Tamanho:</p>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium">Tamanho</label>
                <select
                  value={tempSize}
                  onChange={(e) => setTempSize(e.target.value)}
                  className="border p-2 rounded w-24"
                >
                  <option value="">Selecione</option>
                  {AVAILABLE_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Estoque</label>
                <input
                  type="number"
                  min="0"
                  className="border p-2 rounded w-24"
                  value={tempStock || ""}
                  onChange={(e) => setTempStock(Number(e.target.value))}
                />
              </div>
              <button
                type="button"
                onClick={handleAddSizeStock}
                className="bg-teal-600 text-white py-1 px-3 rounded hover:bg-teal-700"
              >
                Adicionar
              </button>
            </div>
            {stockBySize.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {stockBySize.map((item) => (
                  <li key={item.size} className="flex justify-between">
                    {item.size}: {item.stock}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(item.size)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editProductId ? "Salvar Alterações" : "Adicionar Produto"}
            </button>
            {editProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white py-2 px-4 rounded ml-2 hover:bg-gray-500"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTAGEM (Coluna Direita) */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Produtos Cadastrados</h2>
        {loadingProducts ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow-sm flex gap-4"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={`${API_BASE_URL}/api/products/image/${product.imageUrl}`}
                    alt={product.name}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.description || "Sem descrição"}
                  </p>
                  <p className="mt-1">
                    <strong>Preço:</strong> R$ {product.price.toFixed(2)}
                  </p>
                  {product.stockBySize && product.stockBySize.length > 0 ? (
                    <ul className="text-sm mt-1">
                      {product.stockBySize.map((item) => (
                        <li key={item.size}>
                          {item.size}: {item.stock}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-red-500">Sem estoque</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
