'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      title="Alternar tema"
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

type NavbarProps = {
  backHref?: string
  backLabel?: string
  title?: string
  showCategories?: boolean
}

export default function Navbar({ backHref, backLabel, title = 'É pra mim?', showCategories = false }: NavbarProps) {
  return (
    <nav className="border-b border-teal-50 dark:border-gray-800 px-6 h-12 flex items-center relative">
      {/* Voltar ou Título */}
      <div className="flex-1">
        {backHref ? (
          <Link href={backHref} className="text-base text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            {backLabel ?? '← Voltar'}
          </Link>
        ) : (
          <Link href="/" className="text-2xl font-semibold text-teal-400 tracking-tight hover:text-teal-500 transition-colors">
            {title}
          </Link>
        )}
      </div>

      {/* Celulares */}
      <div className="flex-1 flex justify-center">
        {showCategories && (
          <div className="flex gap-6">
            <Link href="/celulares" className="text-base text-teal-500 font-medium border-b-2 border-teal-400 pb-0.5">
              Celulares
            </Link>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <div className="flex-1 flex justify-end items-center gap-4">
        {!showCategories && backHref && (
          <Link href="/" className="text-lg font-medium text-teal-400 tracking-tight hover:text-teal-500 transition-colors">
            {title}
          </Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  )
}