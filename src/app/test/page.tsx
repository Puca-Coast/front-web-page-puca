"use client";

import { SimpleLookbookImage } from '@/components/ui/OptimizedImage/SimpleOptimizedImage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TestPage() {
  // URL de teste do Cloudinary que estava falhando
  const testCloudinaryUrl = "https://res.cloudinary.com/dgsigv8cf/image/upload/v1729657211/lookbook/ona1zof0arevqunwrfpq.jpg";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isHome={false} />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Teste de Imagens PUCA
          </h1>
          <p className="text-lg text-gray-600">
            Testando as correções para imagens do Cloudinary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teste 1: Imagem do Cloudinary com novo componente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ✅ Teste 1: Imagem do Cloudinary (Novo Componente)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Usando SimpleLookbookImage com tag img nativa
            </p>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <SimpleLookbookImage
                src={testCloudinaryUrl}
                alt="Teste Cloudinary - Lookbook PUCA"
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Deve carregar sem erro 500
            </p>
          </div>

          {/* Teste 2: Imagem local */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ✅ Teste 2: Imagem Local
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Usando SimpleLookbookImage com imagem local
            </p>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <SimpleLookbookImage
                src="/assets/logo-mini.png"
                alt="Logo PUCA - Teste Local"
                width={400}
                height={400}
                className="w-full h-full object-contain p-8"
                priority={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Deve carregar normalmente
            </p>
          </div>

          {/* Teste 3: Imagem inexistente (fallback) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ✅ Teste 3: Fallback
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Teste de fallback para URL inexistente
            </p>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <SimpleLookbookImage
                src="https://res.cloudinary.com/dgsigv8cf/image/upload/v1729657211/lookbook/url-inexistente.jpg"
                alt="Teste Fallback - URL Inexistente"
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Deve mostrar placeholder quando falhar
            </p>
          </div>

          {/* Teste 4: Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 Teste 4: Performance
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Múltiplas imagens para testar carregamento
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <SimpleLookbookImage
                    src={testCloudinaryUrl}
                    alt={`Teste Performance ${i}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    priority={i <= 2}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Deve carregar rapidamente sem erros
            </p>
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            🔧 Informações Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Correções Implementadas:</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Tag img nativa para Cloudinary</li>
                <li>• Fallback automático para erros</li>
                <li>• Loading states otimizados</li>
                <li>• Bypass do Next.js Image</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Validações:</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Sem erros 500 esperados</li>
                <li>• Carregamento mais rápido</li>
                <li>• Compatibilidade com Netlify</li>
                <li>• Performance otimizada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botão para testar lookbook */}
        <div className="mt-8 text-center">
          <a
            href="/lookbook"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            🖼️ Testar Lookbook Completo
          </a>
        </div>
      </main>

      <Footer isHome={false} />
    </div>
  );
} 