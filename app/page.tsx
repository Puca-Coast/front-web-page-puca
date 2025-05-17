// app/page.tsx

import dynamic from 'next/dynamic';

// Importação dinâmica do componente real que será carregado apenas no cliente
const HomeClient = dynamic(() => import('@/components/Home/HomeClient'), { 
  ssr: false,
  loading: () => <div className="w-screen h-screen flex items-center justify-center bg-black text-white">Carregando...</div>
});

// Componente de página simples que será pré-renderizado
export default function Home() {
  return <HomeClient />;
}
