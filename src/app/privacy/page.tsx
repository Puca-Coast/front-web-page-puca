"use client";
import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.js";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Privacy() {

  return (
    <>
    <div className="h-full w-full flex flex-col">
      <Header isHome={false} ></Header>
      <div style={{ padding: "20px", lineHeight: "1.6" , height: '100%'}}>
      <h1>Política de Privacidade</h1>
      <p>
        <strong>Última atualização: [Data]</strong>
      </p>
      <h2>Coleta de Dados Pessoais</h2>
      <p>
        No Puca Coast, coletamos informações primariamente fornecidas por você, como nome, e-mail,
        endereço e informações de pagamento, além de dados coletados automaticamente como informações
        de acesso, cookies e dados de uso do nosso serviço.
      </p>
      <h2>Uso dos Dados</h2>
      <p>
        Utilizamos os dados coletados para proporcionar, manter, proteger e melhorar os serviços
        oferecidos, bem como para desenvolver novos. Também usamos essas informações para oferecer
        conteúdo personalizado – como, por exemplo, dar-lhe mais relevância em nossas recomendações
        de produtos.
      </p>
      <h2>Compartilhamento de Dados</h2>
      <p>
        Comprometemo-nos a não compartilhar suas informações pessoais com terceiros, exceto em casos
        específicos e sob condições claras, como quando necessário para o nosso funcionamento legal
        ou em caso de exigência legal.
      </p>
      <h2>Segurança</h2>
      <p>
        Adotamos medidas de segurança adequadas para proteger seus dados contra acesso não autorizado,
        alteração, divulgação ou destruição. Suas informações pessoais são tratadas com o maior
        cuidado e confidencialidade.
      </p>
      <h2>Seus Direitos</h2>
      <p>
        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais em nossa
        posse a qualquer momento. Para isso, entre em contato conosco através de nossos canais de
        suporte.
      </p>
      <p>
        Esta política é efetiva a partir de [Data].
      </p>
    </div>
      <Footer isHome={false}></Footer>
      </div>
    </>
  );
}
