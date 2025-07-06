"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import { productService } from "@/lib/services/api/productService";

interface StockItem {
  size: string;
  stock: number;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stockBySize: StockItem[];
  imageFile?: File | null;
  hoverImageFile?: File | null;
  otherImageFiles?: File[];
}

interface AdminProductModalProps {
  open: boolean;
  product?: any | null; // Produto em edição
  onClose: () => void;
  onSaved: () => void;  // Disparado após salvar para recarregar lista
}

const AdminProductModal: React.FC<AdminProductModalProps> = ({ open, product, onClose, onSaved }) => {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    stockBySize: [],
    imageFile: null,
    hoverImageFile: null,
    otherImageFiles: [],
  });

  // Estado para controlar o valor do input de preço já formatado (R$)
  const [priceInput, setPriceInput] = useState<string>("");

  // Carregar dados ao abrir modal
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        stockBySize: product.stockBySize || [],
        imageFile: null,
        hoverImageFile: null,
        otherImageFiles: [],
      });

      // Ajustar campo de preço formatado
      if (product?.price) {
        setPriceInput(product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
      } else {
        setPriceInput("");
      }
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        stockBySize: [],
        imageFile: null,
        hoverImageFile: null,
        otherImageFiles: [],
      });
      setPriceInput("");
    }
  }, [product, open]);

  if (!open) return null;

  // Handler genérico para campos textuais (nome/descrição)
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Máscara e conversão do preço
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Extrai apenas dígitos
    const digitsOnly = raw.replace(/\D/g, "");
    const numeric = digitsOnly ? parseFloat(digitsOnly) / 100 : 0;
    // Formata para padrão brasileiro (ex: 1.234,56)
    const formatted = digitsOnly ? numeric.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "";
    setPriceInput(formatted);
    setForm((prev) => ({ ...prev, price: numeric }));
  };

  const handleStockChange = (index: number, field: keyof StockItem, value: string | number) => {
    setForm((prev) => {
      const updated = [...prev.stockBySize];
      updated[index] = { ...updated[index], [field]: field === "stock" ? Number(value) : value } as StockItem;
      return { ...prev, stockBySize: updated };
    });
  };

  const addStockRow = () => {
    setForm((prev) => ({ ...prev, stockBySize: [...prev.stockBySize, { size: "", stock: 0 }] }));
  };

  const removeStockRow = (idx: number) => {
    setForm((prev) => ({ ...prev, stockBySize: prev.stockBySize.filter((_, i) => i !== idx) }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: "imageFile" | "hoverImageFile" | "otherImages") => {
    if (field === 'otherImages') {
      const files = e.target.files ? Array.from(e.target.files) : [];
      setForm((prev) => ({ ...prev, otherImageFiles: files }));
    } else {
      const file = e.target.files?.[0] || null;
      setForm((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("stockBySize", JSON.stringify(form.stockBySize));

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }
      if (form.hoverImageFile) {
        formData.append("hoverImage", form.hoverImageFile);
      }

      // Append outras imagens
      if (form.otherImageFiles && form.otherImageFiles.length > 0) {
        form.otherImageFiles.forEach((file) => {
          formData.append('otherImages', file, file.name);
        });
      }

      if (product?._id) {
        await productService.updateProduct(product._id, formData);
        toast.success("Produto atualizado com sucesso");
      } else {
        await productService.createProduct(formData);
        toast.success("Produto criado com sucesso");
      }

      onSaved();
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      toast.error(error.message || "Erro ao salvar produto");
    }
  };

  // ===== Render =====
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {product ? "Editar Produto" : "Novo Produto"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleTextChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleTextChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                <input
                  type="text"
                  name="price"
                  value={priceInput}
                  onChange={handlePriceChange}
                  inputMode="decimal"
                  placeholder="0,00"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/25"
                />
              </div>

              {/* Estoque por tamanho */}
              <div>
                <label className="block text-sm font-medium mb-2">Estoque por tamanho</label>
                <div className="space-y-2">
                  {form.stockBySize.map((s, idx) => (
                    <div key={idx} className="flex space-x-2 items-center">
                      <input
                        type="text"
                        placeholder="Tamanho (ex: P)"
                        value={s.size}
                        onChange={(e) => handleStockChange(idx, "size", e.target.value)}
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Qtde"
                        value={s.stock}
                        min={0}
                        onChange={(e) => handleStockChange(idx, "stock", e.target.value)}
                        className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeStockRow(idx)}
                        className="text-red-600 text-xs"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStockRow}
                    className="mt-2 text-sm text-blue-600"
                  >
                    + Adicionar tamanho
                  </button>
                </div>
              </div>

              {/* Upload Imagens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Imagem principal</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "imageFile")}/>
                  {(form.imageFile || product?.imageUrl) && (
                    <div className="mt-2 w-20 h-20 relative">
                      <Image
                        src={form.imageFile ? URL.createObjectURL(form.imageFile) : product!.imageUrl}
                        alt="Preview principal"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Imagem hover</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "hoverImageFile")}/>
                  {(form.hoverImageFile || product?.hoverImageUrl) && (
                    <div className="mt-2 w-20 h-20 relative">
                      <Image
                        src={form.hoverImageFile ? URL.createObjectURL(form.hoverImageFile) : product!.hoverImageUrl}
                        alt="Preview hover"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Outras imagens (máx. 8)</label>
                  <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'otherImages')}/>

                  {form.otherImageFiles && form.otherImageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.otherImageFiles.map((file, idx) => (
                        <div key={`${file.name}-${idx}`} className="w-16 h-16 relative group">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            fill
                            className="object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                otherImageFiles: prev.otherImageFiles?.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="absolute top-0 right-0 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminProductModal; 