function DisplayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* retângulo genérico para tela */}
      <rect x="4" y="5" width="16" height="12" rx="2" />
      {/* linha inferior base */}
      <line x1="8" y1="19" x2="16" y2="19" />
    </svg>
  )
}


function HardwareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* quadrado central (chip) */}
      <rect x="9" y="9" width="6" height="6" />
      {/* pinos do chip */}
      <line x1="3" y1="9" x2="7" y2="9" />
      <line x1="3" y1="15" x2="7" y2="15" />
      <line x1="17" y1="9" x2="21" y2="9" />
      <line x1="17" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="7" />
      <line x1="15" y1="3" x2="15" y2="7" />
      <line x1="9" y1="17" x2="9" y2="21" />
      <line x1="15" y1="17" x2="15" y2="21" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* corpo da câmera */}
      <rect x="4" y="7" width="16" height="12" rx="2" />
      {/* lente */}
      <circle cx="12" cy="13" r="3" />
      <path d="M9 7l2-2h2l2 2" />
    </svg>
  )
}

function ConnectivityIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ondas de sinal Wi-Fi */}
      <path d="M5 9a10 10 0 0 1 14 0" />
      <path d="M8.5 12.5a6 6 0 0 1 7 0" />
      <path d="M11 16a2 2 0 0 1 2 0" />
      {/* ponto central */}
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FeaturesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  )
}

function GeneralIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* círculo externo */}
      <circle cx="12" cy="12" r="9" />
      {/* linha do "i" */}
      <line x1="12" y1="10" x2="12" y2="16" />
      {/* ponto do "i" */}
      <circle cx="12" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export const Icons = {
  Display: DisplayIcon,
  Hardware: HardwareIcon,
  Camera: CameraIcon,
  Connectivity: ConnectivityIcon,
  General: GeneralIcon,
  Features: FeaturesIcon,
}