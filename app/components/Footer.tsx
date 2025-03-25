"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Produto
            </h3>
            <ul className="mt-4 space-y-4">
              <li>Funcionalidades</li>
              <li>Preços</li>
              <li>Integrações</li>
              <li>API</li>
            </ul>
          </div>
          <div>
            <h3>Empresa</h3>
            <ul>
              <li>Sobre</li>
              <li>Blog</li>
              <li>Carreiras</li>
              <li>Imprensa</li>
            </ul>
          </div>
          <div>
            <h3>Legal</h3>
            <ul>
              <li>Privacidade</li>
              <li>Termos</li>
              <li>Política de Cookies</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-8 text-base text-muted-foreground md:mt-0 md:order-1">
            &copy; 2023 StreamLine, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
