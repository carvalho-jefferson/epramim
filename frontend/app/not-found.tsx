import Link from 'next/link'
import Navbar from '@/app/components/Navbar'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar backHref="/" backLabel="← Voltar" />
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <div className="text-8xl font-thin text-teal-400 mb-4">404</div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">
          Página não encontrada
        </h1>
        <p className="text-base text-gray-400 dark:text-gray-500 mb-8">
          O produto ou página que você procura não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="inline-block bg-teal-400 hover:bg-teal-500 text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  )
}