"use client";

import React from 'react';

export interface SkipLinksProps {
  links?: Array<{
    href: string;
    text: string;
  }>;
}

const defaultLinks = [
  { href: '#main-content', text: 'Pular para conteúdo principal' },
  { href: '#main-navigation', text: 'Pular para navegação principal' },
  { href: '#footer', text: 'Pular para rodapé' }
];

export default function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  return (
    <div className="sr-only focus-within:not-sr-only">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="absolute top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200"
          onFocus={(e) => {
            // Ensure the link is visible when focused
            (e.target as HTMLElement).style.position = 'fixed';
          }}
          onBlur={(e) => {
            // Hide the link when not focused
            (e.target as HTMLElement).style.position = 'absolute';
          }}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}