import React, {useRef} from "react";

export default function CartModal({ isOpen, onClose, cartItems = [] }) {
    const modalRef = useRef(null);
  
    const handleClose = () => {
      onClose();
    };
  
    // Calculando o subtotal
    const subTotal = cartItems.reduce((total, item) => total + item.price, 0);
    const shipping = 9.99; // Exemplo de taxa de envio
    const total = subTotal + shipping;
  
    return (
      <div
        ref={modalRef}
        className={`z-50 fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header do Carrinho */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Carrinho</h2>
            <button onClick={handleClose} className="text-xl">&times;</button>
          </div>
  
          {/* Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <img src="/assets/product-thumb1.jpg" alt="Produto" className="w-16 h-16 object-cover mr-4" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Tamanho: {item.size}</p>
                    </div>
                  </div>
                  <span className="font-semibold">R$ {item.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Seu carrinho está vazio.</p>
            )}
          </div>
  
          {/* Totais */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Sub Total</span>
              <span className="font-semibold">R$ {subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Envio</span>
              <span className="font-semibold">R$ {shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total (s/ taxa)</span>
              <span className="font-semibold text-red-500">R$ {total.toFixed(2)}</span>
            </div>
            {/* Botões de Ação */}
            <div className="flex">
              <button className="flex-1 bg-black text-white py-2 px-4 mr-2">Visualizar Carrinho</button>
              <button className="flex-1 bg-red-500 text-white py-2 px-4">Finalizar Compra</button>
            </div>
          </div>
        </div>
      </div>
    );
  }