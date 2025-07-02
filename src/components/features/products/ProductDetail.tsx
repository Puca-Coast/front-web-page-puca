"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WavyLoader from "@/components/ui/WavyLoader";
import { API_BASE_URL } from "@/config/environment";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import "@/styles/productStyles.css";
import { productService } from "@/lib/services/api/productService";

interface ProductDetailProps {
  productId: string;
}

interface ProductType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  hoverImageUrl: string;
  stockBySize: { size: string; stock: number; _id?: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<string>("");
  const { addToCart } = useCart() as any;
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // Abort controller for fetch cleanup
    const controller = new AbortController();
    
    const fetchProduct = async () => {
      if (!productId) {
        setError("ID do produto não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
          signal: controller.signal
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            setError("Produto não encontrado");
          } else {
            setError(`Erro ${res.status} ao buscar produto`);
          }
          return;
        }
        
        const data = await res.json();
        
        if (data.success && data.data) {
          // Converte IDs de imagem em URLs completas
          const prod: ProductType = data.data;
          const mainUrl = productService.getProductImageUrl(prod.imageUrl);
          const hoverUrl = productService.getProductImageUrl(prod.hoverImageUrl);

          setProduct({ ...prod, imageUrl: mainUrl, hoverImageUrl: hoverUrl });
          setCurrentImage(mainUrl);
        } else {
          setError(data.message || "Erro ao carregar produto");
          toast.error(data.message || "Erro ao carregar produto");
        }
      } catch (error: any) {
        // Check if it's an abort error (user navigated away)
        if (error.name !== 'AbortError') {
          console.error("Erro ao buscar produto:", error);
          setError("Erro ao carregar produto");
          toast.error("Erro ao carregar produto");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast.warning("Por favor, selecione um tamanho");
      return;
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size: selectedSize,
    });
    
    toast.success(`${product.name} adicionado ao carrinho!`);
  };
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };
  
  const isSizeAvailable = (size: string) => {
    if (!product) return false;
    const sizeInfo = product.stockBySize.find(item => item.size === size);
    return sizeInfo && sizeInfo.stock > 0;
  };
  
  const handleImageHover = () => {
    if (!product) return;
    setCurrentImage(isHovered ? product.imageUrl : product.hoverImageUrl);
    setIsHovered(!isHovered);
  };

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setCurrentImage(imageUrl);
    setActiveImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <WavyLoader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <p className="text-red-500">{error || "Produto não encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16 product-container">
        {/* Product Images Section */}
        <div className="w-full lg:w-3/5 mb-10 lg:mb-0 product-gallery">
          <motion.div 
            className="product-image-container h-[60vh] md:h-[70vh] lg:h-[80vh] relative mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white text-xs px-3 py-1 rounded-full">
              Novo
            </div>
          </motion.div>
          
          <div className="flex gap-3 mt-4 product-thumbnails">
            <motion.div 
              className={`product-thumbnail w-24 h-24 relative cursor-pointer rounded-md overflow-hidden border-2 ${activeImageIndex === 0 ? 'border-black' : 'border-gray-200'}`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleThumbnailClick(product.imageUrl, 0)}
            >
              <Image 
                src={product.imageUrl} 
                alt={`${product.name} - Imagem principal`} 
                fill 
                className="object-cover" 
              />
            </motion.div>
            <motion.div 
              className={`product-thumbnail w-24 h-24 relative cursor-pointer rounded-md overflow-hidden border-2 ${activeImageIndex === 1 ? 'border-black' : 'border-gray-200'}`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleThumbnailClick(product.hoverImageUrl, 1)}
            >
              <Image 
                src={product.hoverImageUrl} 
                alt={`${product.name} - Imagem secundária`} 
                fill 
                className="object-cover" 
              />
            </motion.div>
          </div>
        </div>
        
        {/* Product Details Section */}
        <div className="w-full lg:w-2/5 product-details">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {product.name}
          </motion.h1>
          
          <motion.div 
            className="flex items-center text-sm text-gray-500 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span>SKU: {product._id.slice(-6).toUpperCase()}</span>
          </motion.div>
          
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-2xl font-semibold">R$ {Number(product.price).toFixed(2)}</p>
            <div className="flex items-center mt-1">
              <span className="text-green-600 text-sm">Em estoque</span>
            </div>
          </motion.div>
          
          {product.description && (
            <motion.div 
              className="mb-6 prose prose-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-2">Descrição</h3>
              <p className="text-gray-700">{product.description}</p>
            </motion.div>
          )}
          
          {/* Size Selection */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-medium mb-2">Tamanho</h3>
            <div className="flex flex-wrap gap-2 size-buttons">
              {product.stockBySize.map((sizeItem) => (
                <button
                  key={sizeItem._id}
                  onClick={() => handleSizeSelect(sizeItem.size)}
                  disabled={sizeItem.stock <= 0}
                  className={`size-button w-12 h-12 flex items-center justify-center rounded 
                    ${selectedSize === sizeItem.size 
                      ? 'selected' 
                      : sizeItem.stock <= 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    } transition-colors`}
                >
                  {sizeItem.size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-sm text-gray-600 mt-2">
                {product.stockBySize.find(s => s.size === selectedSize)?.stock} itens em estoque
              </p>
            )}
          </motion.div>
          
          {/* Quantity Selection */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-medium mb-2">Quantidade</h3>
            <div className="flex border border-gray-300 rounded w-36">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)} 
                className="flex-1 flex items-center justify-center py-2"
                disabled={quantity <= 1}
                aria-label="Diminuir quantidade"
              >
                -
              </button>
              <input 
                type="number" 
                min="1"
                value={quantity} 
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-12 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                aria-label="Quantidade"
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)} 
                className="flex-1 flex items-center justify-center py-2"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
          </motion.div>
          
          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className="add-to-cart-button w-full bg-black text-white font-semibold py-4 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors"
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Adicionar ao Carrinho
          </motion.button>
          
          {/* Additional Product Info */}
          <motion.div 
            className="mt-8 border-t pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1M3 4h4l1 4h4l1-4h4a1 1 0 011 1v10a1 1 0 01-1 1h-1.05a2.5 2.5 0 00-4.9 0H10a1 1 0 01-1-1v-1" />
                </svg>
                <span className="text-sm">Frete grátis para compras acima de R$ 300</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Devolução em até 30 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Produto original com garantia</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
} 