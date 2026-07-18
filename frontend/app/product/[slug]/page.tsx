import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import { SpecTooltip } from '@/app/components/SpecTooltip'
import type { Metadata } from 'next'
import ScrollToTop from '@/app/components/ScrollToTop'
import { formatBRL } from '@/utils/utils'
import { Icons } from '@/app/components/Icons'
import type { ReactNode } from 'react'


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(`${API_URL}/products/slug/${slug}`, { cache: 'no-store' })
    if (!res.ok) return { title: 'Produto' }
    const product: Product = await res.json()
    const title = `${product.name} — Especificações completas`
    const description = `Confira as especificações completas do ${product.name}: tela, câmera, bateria, processador e preço.`
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/product/${slug}`,
        images: product.image_url ? [{ url: product.image_url }] : [],
      },
    }
  } catch {
    return { title: 'Produto' }
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

type DisplaySpecs = {
  screen_size_in: number | null
  screen_type: string | null
  resolution_width: number | null
  resolution_height: number | null
  refresh_rate_hz: number | null
  protection: string | null
  brightness_nits: number | null
  ppi: number | null
  hdr: string | null
  aspect_ratio: string | null
}

type HardwareSpecs = {
  chipset: string | null
  cpu: string | null
  gpu: string | null
  ram_gb: number | null
  storage_gb: number | null
  storage_type: string | null
  battery_mah: number | null
  charging_w: number | null
  charging_wireless_w: number | null
  charging_reverse: boolean | null
}

type PhoneSpecs = {
  sim_slots: number | null
  has_esim: boolean | null
  sim_type: string | null
  network_2g: boolean | null
  network_3g: boolean | null
  network_4g: boolean | null
  network_5g: boolean | null
  wifi: string | null
  bluetooth: string | null
  nfc: boolean | null
  usb_type: string | null
  usb_version: string | null
  ip_rating: string | null
  has_memory_card: boolean | null
  speakers: string | null
  has_headphone_jack: boolean | null
  has_fingerprint: boolean | null
}

type CameraSpecs = {
  main_camera_mp: number | null
  main_camera_aperture: string | null
  main_camera_ois: boolean | null
  ultrawide_mp: number | null
  ultrawide_aperture: string | null
  telephoto_mp: number | null
  telephoto_aperture: string | null
  telephoto_zoom: string | null
  video_resolution: string | null
  front_camera_mp: number | null
  front_camera_aperture: string | null
  front_video_resolution: string | null
  camera_features: string | null
}

type PriceHistory = {
  store_name: string | null
  price: number
  product_url: string | null
}

type Product = {
  id: number
  name: string
  brand: string
  model: string | null
  launch_year: number | null
  os: string | null
  current_price: number
  weight_g: number | null
  height_mm: number | null
  width_mm: number | null
  thickness_mm: number | null
  overall_score: number | null
  image_url: string | null
  display_specs: DisplaySpecs | null
  hardware_specs: HardwareSpecs | null
  phone_specs: PhoneSpecs | null
  camera_specs: CameraSpecs | null
  price_history: PriceHistory[]
}

type PageProps = {
  params: Promise<{ slug: string }>
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0 && value !== false) return null

  return (
    <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
      <span className="text-base text-gray-600 dark:text-gray-100 flex items-center gap-1">
        {label}
        <SpecTooltip label={label} />
      </span>

      <span className="text-base text-gray-900 dark:text-gray-300 text-right max-w-[60%]">
        {value}
      </span>
    </div>
  )
}

function BoolRow({ label, value }: { label: string; value: boolean | null }) {
  if (value === null) return null

  return (
    <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
      <span className="text-base text-gray-500 dark:text-gray-400 flex items-center gap-1">
        {label}
        <SpecTooltip label={label} />
      </span>

      <span
        className={`text-base font-medium ${
          value
            ? 'text-teal-500'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {value ? 'Sim' : 'Não'}
      </span>
    </div>
  )
}

function SectionHeader({ title }: { title: ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_120px_1fr] -mx-6 px-6 py-2 bg-teal-50 dark:bg-teal-950/30 border-y border-teal-100 dark:border-teal-900 mt-2">
      <div className="col-start-2 flex items-center justify-center gap-2 uppercase tracking-widest text-teal-500 dark:text-teal-400 font-medium text-base">
        {title}
      </div>
    </div>
  )
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const res = await fetch(`${API_URL}/products/slug/${slug}`, { cache: 'no-store' })

  if (!res.ok) notFound()

  const product: Product = await res.json()
  const d = product.display_specs
  const h = product.hardware_specs
  const p = product.phone_specs
  const c = product.camera_specs

  const networks = [
    p?.network_2g && '2G',
    p?.network_3g && '3G',
    p?.network_4g && '4G',
    p?.network_5g && '5G',
  ].filter(Boolean).join(', ')

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar backHref="/" backLabel="← Voltar" />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          {/* Foto do produto */}
          <div className="w-24 h-24 bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700 rounded-xl mx-auto mb-3 flex items-center justify-center text-4xl">
            📱
          </div>

          {/* Nome do produto */}
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {product.name}
          </h1>

          {/* Marca e ano */}
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {product.brand} · {product.launch_year}
          </p>
        </div>


        <div className="grid grid-cols-1 gap-4">

          <SectionHeader
            title={
              <>
                <span className="text-base">
                  <Icons.General />
                </span>
                Geral
              </>
            }
          />
          <Row
            label="Preço"
            value={
              <span className="font-medium text-teal-500">
                R$ {formatBRL(product.current_price)}
              </span>
            }
          />
            <Row label="Sistema" value={product.os} />
            <Row label="Modelo" value={product.model} />
            <Row label="Peso" value={product.weight_g ? `${product.weight_g}g` : null} />
            <Row label="Dimensões" value={
              product.height_mm && product.width_mm && product.thickness_mm
                ? `${product.height_mm} × ${product.width_mm} × ${product.thickness_mm} mm`
                : null
            } />
            <Row label="Score geral" value={
              product.overall_score
                ? <span className="text-teal-500 font-medium">{product.overall_score}</span>
                : null
            } />

          {d && (
            <>
              <SectionHeader
                title={
                  <>
                    <span className="text-base">
                      <Icons.Display />
                    </span>
                    Tela
                  </>
                }
              />
              <Row label="Tamanho" value={d.screen_size_in ? `${d.screen_size_in}"` : null} />
              <Row label="Tipo" value={d.screen_type} />
              <Row label="Taxa de atualização" value={d.refresh_rate_hz ? `${d.refresh_rate_hz}Hz` : null} />
              <Row label="Brilho" value={d.brightness_nits ? `${d.brightness_nits} nits` : null} />
              <Row label="PPI" value={d.ppi} />
              <Row label="Proteção" value={d.protection} />
              <Row label="HDR" value={d.hdr} />
              <Row label="Proporção" value={d.aspect_ratio} />
            </>
          )}

          {h && (
            <>
              <SectionHeader
                title={
                  <>
                    <span className="text-base">
                      <Icons.Hardware />
                    </span>
                    Hardware
                  </>
                }
              />
              <Row label="Chipset" value={h.chipset} />
              <Row label="CPU" value={h.cpu} />
              <Row label="GPU" value={h.gpu} />
              <Row label="RAM" value={h.ram_gb ? `${h.ram_gb}GB` : null} />
              <Row label="Armazenamento" value={h.storage_gb ? `${h.storage_gb}GB${h.storage_type ? ` ${h.storage_type}` : ''}` : null} />
              <Row label="Bateria" value={h.battery_mah ? `${h.battery_mah}mAh` : null} />
              <Row label="Carregamento" value={h.charging_w ? `${h.charging_w}W` : null} />
              <Row label="Wireless" value={h.charging_wireless_w ? `${h.charging_wireless_w}W` : null} />
              <BoolRow label="Carregamento reverso" value={h.charging_reverse} />
            </>
          )}

          {c && (
            <>
              <SectionHeader
                title={
                  <>
                    <span className="text-base">
                      <Icons.Camera/>
                    </span>
                    Câmera
                  </>
                }
              />
              <Row label="Principal" value={c.main_camera_mp ? `${c.main_camera_mp}MP${c.main_camera_aperture ? ` ${c.main_camera_aperture}` : ''}` : null} />
              <BoolRow label="OIS" value={c.main_camera_ois} />
              <Row label="Ultra-wide" value={c.ultrawide_mp ? `${c.ultrawide_mp}MP${c.ultrawide_aperture ? ` ${c.ultrawide_aperture}` : ''}` : null} />
              <Row label="Telephoto" value={c.telephoto_mp ? `${c.telephoto_mp}MP${c.telephoto_aperture ? ` ${c.telephoto_aperture}` : ''}` : null} />
              <Row label="Zoom" value={c.telephoto_zoom} />
              <Row label="Frontal" value={c.front_camera_mp ? `${c.front_camera_mp}MP${c.front_camera_aperture ? ` ${c.front_camera_aperture}` : ''}` : null} />
              <Row label="Vídeo frontal" value={c.front_video_resolution} />
              <Row label="Recursos da câmera" value={c.camera_features} />
            </> 
          )}

          {p && (
            <>
              <SectionHeader
                title={
                  <>
                    <span className="text-base">
                      <Icons.Connectivity />
                    </span>
                    Conectividade
                  </>
                }
              />
              <Row label="SIM" value={p.sim_slots ? `${p.sim_slots}x ${p.sim_type || ''}` : null} />
              <BoolRow label="eSIM" value={p.has_esim} />
              <Row label="Redes" value={networks || null} />
              <Row label="Wi-Fi" value={p.wifi} />
              <Row label="Bluetooth" value={p.bluetooth} />
              <BoolRow label="NFC" value={p.nfc} />
              <Row label="USB" value={p.usb_type ? `${p.usb_type}${p.usb_version ? ` ${p.usb_version}` : ''}` : null} />
           </>  
          )}

          {p && (
            <>
              <SectionHeader
                title={
                  <>
                    <span className="text-base">
                      <Icons.Features />
                    </span>
                    Recursos
                  </>
                }
              />
              <Row label="Proteção IP" value={p.ip_rating} />
              <BoolRow label="Cartão de memória" value={p.has_memory_card} />
              <Row label="Alto-falantes" value={p.speakers} />
              <BoolRow label="P2 (fone)" value={p.has_headphone_jack} />
              <BoolRow label="Sensor de impressão digital" value={p.has_fingerprint} />
            </>  
          )}

          {product.price_history && product.price_history.length > 0 && (
            <>
              <SectionHeader
                title={
                  <>
                    <span className="text-base">
                      <Icons.General />
                    </span>
                    Ver preços
                  </>
                }
              />
              {product.price_history.map((ph, i) => (
                <div key={i} className="flex justify-between items-center border-t border-gray-50 dark:border-gray-800 pt-3">
                  <span className="text-base text-gray-400 dark:text-gray-500">{ph.store_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                      R$ {formatBRL(ph.price)}
                    </span>
                    {ph.product_url && (
                      <a
                        href={ph.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-teal-400 hover:bg-teal-500 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        Ver
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </>  
          )}
        </div>
      </div>
      <ScrollToTop />
    </main>
  )
}