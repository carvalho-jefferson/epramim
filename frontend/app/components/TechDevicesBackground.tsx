'use client'

export default function TechDevicesBackground() {
  return (
    <div className="pointer-events-none select-none flex items-center justify-center gap-8 opacity-30 dark:opacity-70 my-6 text-black dark:text-white">
      
      {/* Notebook */}
      <svg width="120" height="70" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Brilho no contorno principal */}
        <rect x="10" y="6" width="100" height="62" rx="8" stroke="currentColor" strokeWidth="3"
          className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <rect x="18" y="14" width="84" height="46" rx="3" fill="currentColor" fillOpacity="0.15"
         className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        
        {/* Pés do notebook */}
        <rect x="2" y="70" width="116" height="8" rx="4" stroke="currentColor" strokeWidth="2.5"
          className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <rect x="42" y="70" width="36" height="4" rx="2" fill="currentColor" fillOpacity="0.3"
          className="dark:fill-teal-400" />
      </svg>

      {/* Celular */}
      <svg width="52" height="70" viewBox="0 0 52 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="46" height="84" rx="10" stroke="currentColor" strokeWidth="3"
          className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <rect x="10" y="12" width="32" height="56" rx="3" fill="currentColor" fillOpacity="0.15"
         className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <circle cx="26" cy="78" r="4" stroke="currentColor" strokeWidth="2.5"
         className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <rect x="18" y="7" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity="0.4"
         className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
      </svg>

      {/* TV */}
      <svg width="140" height="70" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="132" height="78" rx="8" stroke="currentColor" strokeWidth="3"
          className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <rect x="12" y="12" width="116" height="62" rx="3" fill="currentColor" fillOpacity="0.15"
         className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />

        {/* Pés da TV */}
        <path d="M50 86 L44 96" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <path d="M90 86 L96 96" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
        <rect x="40" y="96" width="60" height="4" rx="2" stroke="currentColor" strokeWidth="2"
          className="dark:stroke-teal-400 dark:filter dark:drop-shadow-[0_0_2px_#4fd1c5]" />
      </svg>

    </div>
  )
}