"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import TechDevicesBackground from "@/app/components/TechDevicesBackground";
import { formatBRL } from "@/utils/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  id: number;
  name: string;
  brand: string;
  current_price: number;
  image_url: string | null;
  slug: string;
};

const recentProducts = [
  {
    id: 1,
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    price: 6999,
    specs: "256GB | 12GB RAM",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    brand: "Apple",
    price: 7999,
    specs: "256GB | 8GB RAM",
  },
  {
    id: 3,
    name: "Pixel 9 Pro",
    brand: "Google",
    price: 6499,
    specs: "128GB | 12GB RAM",
  },
  {
    id: 4,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 5999,
    specs: "512GB | 16GB RAM",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [selectedA, setSelectedA] = useState<Product | null>(null);
  const [selectedB, setSelectedB] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const activeSearch = selectedA ? searchB : searchA;

    if (!activeSearch.trim()) {
      const clearTimeout_ = setTimeout(() => {
        setProducts([]);
        setActiveIndex(-1);
      }, 0);
      return () => clearTimeout(clearTimeout_);
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/products?search=${encodeURIComponent(activeSearch)}&limit=10`,
        );
        const data = await res.json();
        setProducts(data);
        setActiveIndex(data.length > 0 ? 0 : -1);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchA, searchB, selectedA]);

  const handleCompare = () => {
    if (selectedA && selectedB) {
      router.push(`/compare/${selectedA.slug}/vs/${selectedB.slug}`);
    }
  };

  const clearAll = () => {
    setSelectedA(null);
    setSelectedB(null);
    setSearchA("");
    setSearchB("");
    setProducts([]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    target: "A" | "B",
  ) => {
    if (!products.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = products[activeIndex];

      if (target === "A") {
        setSelectedA(selected);
        setSearchA(selected.name);
      } else {
        setSelectedB(selected);
        setSearchB(selected.name);
      }

      setProducts([]);
      setActiveIndex(-1);
    }
  };

  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-950">
      {/* Hero com gradiente adaptável */}
      <section
        className="
          relative
          bg-[radial-gradient(circle_at_bottom,#0d6b75_0%,#ffffff_64%)]
          dark:bg-[radial-gradient(circle_at_bottom,#08343f_0%,#1f2937_100%)]
        "
      >
        {/* Elipse decorativa central*/}
        <div className="absolute left-1/2 top-48 -translate-x-1/2 -translate-y-1/2 w-120 h-20 rounded-full border border-teal-500" />

        <Navbar showCategories />

        <div className="px-6 pt-6 pb-8 md:pt-1 md:pb-12 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extralight text-gray-800 dark:text-white leading-tight tracking-tight mb-2">
            Descubra o melhor
            <br />
            <span className="font-medium text-teal-500">para você</span>
          </h1>

          <TechDevicesBackground />

          {/* Busca */}
          <div className="max-w-xl mx-auto mb-6">
            {/* Campo A — antes de selecionar */}
            {!selectedA && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    value={searchA}
                    onChange={(e) => setSearchA(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "A")}
                    placeholder="Pesquise um produto..."
                    className="w-full px-6 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-sm"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-teal-500 font-medium pointer-events-none">
                    Comparar
                  </span>
                </div>

                {/* Dropdown A */}
                {products.length > 0 && (
                  <div className="mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden text-left">
                    {loading && (
                      <div className="px-4 py-3 text-sm text-gray-400">
                        Buscando...
                      </div>
                    )}
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setSelectedA(product);
                          setProducts([]);
                        }}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 ${
                          activeIndex === index
                            ? "bg-teal-50 dark:bg-gray-800"
                            : "hover:bg-teal-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {product.brand}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Após selecionar A */}
            {selectedA && (
              <div className="space-y-3">
                {/* Card produto A */}
                <div className="bg-teal-50/50 dark:bg-gray-900 border border-teal-100 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-xl border border-teal-100 dark:border-gray-700">
                      📱
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedA.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {selectedA.brand} · R${" "}
                        {formatBRL(selectedA.current_price)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/product/${selectedA.slug}`}
                      className="text-xs text-teal-400 underline underline-offset-2 whitespace-nowrap"
                    >
                      Ver especificações →
                    </Link>
                    <button
                      onClick={clearAll}
                      className="text-gray-300 hover:text-gray-500 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Campo B */}
                <input
                  type="text"
                  value={searchB}
                  onChange={(e) => {
                    setSearchB(e.target.value);
                    setSelectedB(null);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "B")}
                  placeholder="Compare com outro produto..."
                  className="w-full px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-all"
                />

                {/* Dropdown B */}
                {!selectedB && products.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden text-left">
                    {loading && (
                      <div className="px-4 py-3 text-sm text-gray-400">
                        Buscando...
                      </div>
                    )}
                    {products
                      .filter((product) => product.id !== selectedA?.id)
                      .map((product, index) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSelectedB(product);
                            setProducts([]);
                            setSearchB(product.name);
                          }}
                          className={`px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 ${
                            activeIndex === index
                              ? "bg-teal-50 dark:bg-gray-800"
                              : "hover:bg-teal-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {product.brand}
                          </span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Botão comparar */}
                <button
                  onClick={handleCompare}
                  disabled={!selectedA || !selectedB}
                  className={`
                    w-full py-3 rounded-xl text-sm font-medium transition-all
                    ${
                      selectedA && selectedB
                        ? "bg-teal-400 hover:bg-teal-500 text-white cursor-pointer"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Comparar agora
                </button>
              </div>
            )}
          </div>
          <p className="text-lg text-gray-900 dark:text-gray-400 mb-6 max-w-2xl mx-auto font-light leading-relaxed">
            Compare especificações, preços e recursos lado a lado antes de
            comprar.
          </p>
        </div>
      </section>

      {/* Lançamentos recentes */}
      <section className="px-6 py-12 max-w-6xl mx-auto dark:bg-gray-950">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">
            Lançamentos recentes
          </h2>
          <div className="w-12 h-px bg-teal-400 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group block bg-white dark:bg-gray-900 hover:shadow-lg hover:border-teal-200 transition-all duration-300 rounded-2xl border border-gray-100 dark:border-gray-800 hover:-translate-y-1 p-6"
            >
              <div className="w-full h-32 mb-4 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <span className="text-4xl opacity-40">📱</span>
              </div>

              <h3 className="font-medium text-gray-900 dark:text-white text-center mb-1 text-sm">
                {product.name}
              </h3>

              <p className="text-xs text-gray-400 text-center mb-3">
                {product.brand}
              </p>

              <div className="text-center mb-4">
                <span className="text-lg font-light text-gray-900 dark:text-white">
                  R$ {product.price.toLocaleString()}
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  {product.specs}
                </div>
              </div>

              <div className="w-full py-2 border border-gray-200 dark:border-gray-700 text-xs text-center text-gray-600 dark:text-gray-400 group-hover:border-teal-400 group-hover:text-teal-500 transition-all rounded-lg">
                Ver detalhes
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 mt-16 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-2 text-center">
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Compare com inteligência e escolha o melhor custo-benefício para
            você.
          </p>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-teal-500 hover:text-teal-600 transition-colors"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            Siga-nos no Instagram
          </a>

          <p className="mt-6 text-xs text-gray-400 tracking-wide">
            © 2026 É pra mim?
          </p>
        </div>
      </footer>
    </main>
  );
}
