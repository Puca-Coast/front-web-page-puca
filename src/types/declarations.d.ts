// Declaração para permitir a importação de arquivos CSS
declare module 'react-toastify/dist/ReactToastify.css';

// Declarações globais para tipar o process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_API_BASE_URL: string;
      [key: string]: string | undefined;
    }
    
    interface Process {
      env: ProcessEnv;
    }
  }
  
  var process: NodeJS.Process;
}

// É necessário exportar algo para que o TypeScript trate este arquivo como um módulo
export {};