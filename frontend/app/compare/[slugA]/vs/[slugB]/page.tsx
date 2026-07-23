import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import { SpecTooltip } from "@/app/components/SpecTooltip";
import ScrollToTop from "@/app/components/ScrollToTop";
import { atLeastOne, formatBRL } from "@/utils/utils";
import type { ReactNode } from "react";
import { Icons } from "@/app/components/Icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type DisplaySpecs = {
  screen_size_in: number | null;
  screen_type: string | null;
  resolution_width: number | null;
  resolution_height: number | null;
  refresh_rate_hz: number | null;
  protection: string | null;
  brightness_nits: number | null;
  ppi: number | null;
  hdr: string | null;
  aspect_ratio: string | null;
};

type HardwareSpecs = {
  chipset: string | null;
  cpu: string | null;
  gpu: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  battery_mah: number | null;
  charging_w: number | null;
  charging_wireless_w: number | null;
  charging_reverse: boolean | null;
};

type PhoneSpecs = {
  sim_slots: number | null;
  has_esim: boolean | null;
  sim_type: string | null;
  network_2g: boolean | null;
  network_3g: boolean | null;
  network_4g: boolean | null;
  network_5g: boolean | null;
  wifi: string | null;
  bluetooth: string | null;
  nfc: boolean | null;
  usb_type: string | null;
  usb_version: string | null;
  ip_rating: string | null;
  has_memory_card: boolean | null;
  speakers: string | null;
  has_headphone_jack: boolean | null;
  has_fingerprint: boolean | null;
};

type CameraSpecs = {
  main_camera_mp: number | null;
  main_camera_aperture: string | null;
  main_camera_ois: boolean | null;
  ultrawide_mp: number | null;
  ultrawide_aperture: string | null;
  telephoto_mp: number | null;
  telephoto_aperture: string | null;
  telephoto_zoom: string | null;
  video_resolution: string | null;
  front_camera_mp: number | null;
  front_camera_aperture: string | null;
  front_video_resolution: string | null;
  camera_features: string | null;
};

type Product = {
  id: number;
  name: string;
  brand: string;
  model: string | null;
  slug: string;
  launch_year: number | null;
  os: string | null;
  current_price: number;
  weight_g: number | null;
  height_mm: number | null;
  width_mm: number | null;
  thickness_mm: number | null;
  overall_score: number | null;
  image_url: string | null;
  variant_group_id: string | null;
  variant_label: number | null;
  display_specs: DisplaySpecs | null;
  hardware_specs: HardwareSpecs | null;
  phone_specs: PhoneSpecs | null;
  camera_specs: CameraSpecs | null;
};

type CompareResponse = {
  product_a: Product;
  product_b: Product;
};

type PageProps = {
  params: Promise<{ slugA: string; slugB: string }>;
};

// Meta tags SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slugA, slugB } = await params;
  try {
    const res = await fetch(`${API_URL}/compare/${slugA}/vs/${slugB}`, {
      cache: "no-store",
    });
    if (!res.ok) return { title: "Comparação" };
    const { product_a: a, product_b: b }: CompareResponse = await res.json();
    const title = `${a.name} vs ${b.name} — Comparação completa`;
    const description = `Compare ${a.name} e ${b.name} lado a lado: tela, câmera, bateria, processador e muito mais.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/compare/${slugA}/vs/${slugB}`,
      },
    };
  } catch {
    return { title: "Comparação" };
  }
}

// Componentes
type SpecRowProps = {
  label: string;
  valueA: number | string | null;
  valueB: number | string | null;
  unit?: string;
  higherIsBetter?: boolean;
  lowerIsBetter?: boolean;
};

function SpecRow({
  label,
  valueA,
  valueB,
  unit = "",
  higherIsBetter = false,
  lowerIsBetter = false,
}: SpecRowProps) {
  const numA = typeof valueA === "number" ? valueA : null;
  const numB = typeof valueB === "number" ? valueB : null;

  const aWins =
    numA !== null &&
    numB !== null &&
    ((higherIsBetter && numA > numB) || (lowerIsBetter && numA < numB));
  const bWins =
    numA !== null &&
    numB !== null &&
    ((higherIsBetter && numB > numA) || (lowerIsBetter && numB < numA));

  const valA = valueA != null ? `${valueA}${unit}` : "—";
  const valB = valueB != null ? `${valueB}${unit}` : "—";

  return (
    <div className="grid grid-cols-[1fr_120px_1fr] py-3 border-b border-gray-100 dark:border-gray-800 items-center gap-2">
      <div
        className={`text-center text-base px-2 ${aWins ? "text-teal-500 font-medium" : bWins ? "text-gray-300 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}
      >
        {valA}
        {aWins && <span className="ml-1">✓</span>}
      </div>
      <div className="text-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-0.5">
          {label}
          <SpecTooltip label={label} />
        </span>
      </div>
      <div
        className={`text-center text-base px-2 ${bWins ? "text-teal-500 font-medium" : aWins ? "text-gray-300 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}
      >
        {valB}
        {bWins && <span className="ml-1">✓</span>}
      </div>
    </div>
  );
}

function BoolRow({
  label,
  valueA,
  valueB,
}: {
  label: string;
  valueA: boolean | null;
  valueB: boolean | null;
}) {
  const valA = valueA === null ? "—" : valueA ? "Sim" : "Não";
  const valB = valueB === null ? "—" : valueB ? "Sim" : "Não";
  return (
    <div className="grid grid-cols-[1fr_120px_1fr] py-3 border-b border-gray-100 dark:border-gray-800 items-center gap-2">
      <div
        className={`text-center text-base px-2 ${valueA ? "text-teal-500" : "text-gray-300 dark:text-gray-600"}`}
      >
        {valA}
      </div>
      <div className="text-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-0.5">
          {label}
          <SpecTooltip label={label} />
        </span>
      </div>
      <div
        className={`text-center text-base px-2 ${valueB ? "text-teal-500" : "text-gray-300 dark:text-gray-600"}`}
      >
        {valB}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_120px_1fr] -mx-6 px-6 py-2 bg-teal-50 dark:bg-teal-950/30 border-y border-teal-100 dark:border-teal-900 mt-2">
      <div className="col-start-2 flex items-center justify-center gap-2 uppercase tracking-widest text-teal-500 dark:text-teal-400 font-medium text-base">
        {title}
      </div>
    </div>
  );
}

export default async function ComparePage({ params }: PageProps) {
  const { slugA, slugB } = await params;

  const res = await fetch(`${API_URL}/compare/${slugA}/vs/${slugB}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const { product_a: a, product_b: b }: CompareResponse = await res.json();

  const networksA = [
    a.phone_specs?.network_2g && "2G",
    a.phone_specs?.network_3g && "3G",
    a.phone_specs?.network_4g && "4G",
    a.phone_specs?.network_5g && "5G",
  ]
    .filter(Boolean)
    .join(", ");
  const networksB = [
    b.phone_specs?.network_2g && "2G",
    b.phone_specs?.network_3g && "3G",
    b.phone_specs?.network_4g && "4G",
    b.phone_specs?.network_5g && "5G",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar backHref="/" backLabel="← Nova comparação" />

      {/* Cards com foto */}
      <div className="grid grid-cols-2 bg-teal-50/40 dark:bg-gray-900 border-b border-teal-100 dark:border-gray-800 px-6 py-5 items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700 rounded-xl mx-auto mb-2 flex items-center justify-center overflow-hidden">
            {a.image_url ? (
              <img
                src={a.image_url}
                alt={a.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-3xl">📱</span>
            )}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {a.brand}
          </div>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700 rounded-xl mx-auto mb-2 flex items-center justify-center overflow-hidden">
            {b.image_url ? (
              <img
                src={b.image_url}
                alt={b.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-3xl">📱</span>
            )}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {b.brand}
          </div>
        </div>
      </div>

      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b-2 border-teal-400 grid grid-cols-[1fr_100px_1fr] px-6 py-2.5 items-center shadow-sm">
        <div className="text-center">
          <Link
            href={`/product/${a.slug}`}
            className="text-base font-medium text-gray-800 dark:text-gray-100 hover:text-teal-500 transition-colors truncate block"
          >
            {a.name}
          </Link>
          <div className="text-sm text-teal-500">
            {formatBRL(a.current_price)}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <span className="bg-teal-400 text-white text-[15px] font-medium px-5 py-2 rounded-full">
            vs
          </span>
        </div>
        <div className="text-center">
          <Link
            href={`/product/${b.slug}`}
            className="text-base font-medium text-gray-800 dark:text-gray-100 hover:text-teal-500 transition-colors truncate block"
          >
            {b.name}
          </Link>
          <div className="text-sm text-teal-500">
            {formatBRL(b.current_price)}
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <SectionHeader
          title={
            <>
              <Icons.Display />
              Tela
            </>
          }
        />
        <SpecRow
          label="Tamanho"
          valueA={a.display_specs?.screen_size_in ?? null}
          valueB={b.display_specs?.screen_size_in ?? null}
          unit='"'
          higherIsBetter
        />
        <SpecRow
          label="Tipo"
          valueA={a.display_specs?.screen_type ?? null}
          valueB={b.display_specs?.screen_type ?? null}
        />
        <SpecRow
          label="Resolução"
          valueA={
            a.display_specs?.resolution_width &&
            a.display_specs?.resolution_height
              ? `${a.display_specs.resolution_width}×${a.display_specs.resolution_height}`
              : null
          }
          valueB={
            b.display_specs?.resolution_width &&
            b.display_specs?.resolution_height
              ? `${b.display_specs.resolution_width}×${b.display_specs.resolution_height}`
              : null
          }
        />
        <SpecRow
          label="Refresh"
          valueA={a.display_specs?.refresh_rate_hz ?? null}
          valueB={b.display_specs?.refresh_rate_hz ?? null}
          unit="Hz"
          higherIsBetter
        />
        <SpecRow
          label="Brilho"
          valueA={a.display_specs?.brightness_nits ?? null}
          valueB={b.display_specs?.brightness_nits ?? null}
          unit=" nits"
          higherIsBetter
        />
        <SpecRow
          label="PPI"
          valueA={a.display_specs?.ppi ?? null}
          valueB={b.display_specs?.ppi ?? null}
          higherIsBetter
        />
        <SpecRow
          label="Proteção"
          valueA={a.display_specs?.protection ?? null}
          valueB={b.display_specs?.protection ?? null}
        />
        {atLeastOne(a.display_specs?.hdr, b.display_specs?.hdr) && (
          <SpecRow
            label="HDR"
            valueA={a.display_specs?.hdr ?? null}
            valueB={b.display_specs?.hdr ?? null}
          />
        )}
        <SpecRow
          label="Proporção"
          valueA={a.display_specs?.aspect_ratio ?? null}
          valueB={b.display_specs?.aspect_ratio ?? null}
        />

        <SectionHeader
          title={
            <>
              <Icons.Hardware />
              Hardware
            </>
          }
        />
        <SpecRow
          label="Chipset"
          valueA={a.hardware_specs?.chipset ?? null}
          valueB={b.hardware_specs?.chipset ?? null}
        />
        <SpecRow
          label="CPU"
          valueA={a.hardware_specs?.cpu ?? null}
          valueB={b.hardware_specs?.cpu ?? null}
        />
        <SpecRow
          label="GPU"
          valueA={a.hardware_specs?.gpu ?? null}
          valueB={b.hardware_specs?.gpu ?? null}
        />
        <SpecRow
          label="RAM"
          valueA={a.hardware_specs?.ram_gb ?? null}
          valueB={b.hardware_specs?.ram_gb ?? null}
          unit=" GB"
          higherIsBetter
        />
        <SpecRow
          label="Armazenamento"
          valueA={a.hardware_specs?.storage_gb ?? null}
          valueB={b.hardware_specs?.storage_gb ?? null}
          unit=" GB"
          higherIsBetter
        />
        <SpecRow
          label="Tipo armazen."
          valueA={a.hardware_specs?.storage_type ?? null}
          valueB={b.hardware_specs?.storage_type ?? null}
        />
        <SpecRow
          label="Bateria"
          valueA={a.hardware_specs?.battery_mah ?? null}
          valueB={b.hardware_specs?.battery_mah ?? null}
          unit=" mAh"
          higherIsBetter
        />
        <SpecRow
          label="Carregamento"
          valueA={a.hardware_specs?.charging_w ?? null}
          valueB={b.hardware_specs?.charging_w ?? null}
          unit="W"
          higherIsBetter
        />
        {atLeastOne(
          a.hardware_specs?.charging_wireless_w,
          b.hardware_specs?.charging_wireless_w,
        ) && (
          <SpecRow
            label="Wireless"
            valueA={a.hardware_specs?.charging_wireless_w ?? null}
            valueB={b.hardware_specs?.charging_wireless_w ?? null}
            unit="W"
            higherIsBetter
          />
        )}
        <BoolRow
          label="Carreg. reverso"
          valueA={a.hardware_specs?.charging_reverse ?? null}
          valueB={b.hardware_specs?.charging_reverse ?? null}
        />

        <SectionHeader
          title={
            <>
              <Icons.Camera />
              Câmera
            </>
          }
        />
        <SpecRow
          label="Principal"
          valueA={a.camera_specs?.main_camera_mp ?? null}
          valueB={b.camera_specs?.main_camera_mp ?? null}
          unit=" MP"
          higherIsBetter
        />
        <SpecRow
          label="Abertura"
          valueA={a.camera_specs?.main_camera_aperture ?? null}
          valueB={b.camera_specs?.main_camera_aperture ?? null}
        />
        <BoolRow
          label="OIS"
          valueA={a.camera_specs?.main_camera_ois ?? null}
          valueB={b.camera_specs?.main_camera_ois ?? null}
        />
        {atLeastOne(
          a.camera_specs?.ultrawide_mp,
          b.camera_specs?.ultrawide_mp,
        ) && (
          <SpecRow
            label="Ultra-wide"
            valueA={a.camera_specs?.ultrawide_mp ?? null}
            valueB={b.camera_specs?.ultrawide_mp ?? null}
            unit=" MP"
            higherIsBetter
          />
        )}
        {atLeastOne(
          a.camera_specs?.ultrawide_aperture,
          b.camera_specs?.ultrawide_aperture,
        ) && (
          <SpecRow
            label="Abertura UW"
            valueA={a.camera_specs?.ultrawide_aperture ?? null}
            valueB={b.camera_specs?.ultrawide_aperture ?? null}
          />
        )}
        {atLeastOne(
          a.camera_specs?.telephoto_mp,
          b.camera_specs?.telephoto_mp,
        ) && (
          <SpecRow
            label="Telefoto"
            valueA={a.camera_specs?.telephoto_mp ?? null}
            valueB={b.camera_specs?.telephoto_mp ?? null}
            unit=" MP"
            higherIsBetter
          />
        )}
        {atLeastOne(
          a.camera_specs?.telephoto_aperture,
          b.camera_specs?.telephoto_aperture,
        ) && (
          <SpecRow
            label="Abertura Tele"
            valueA={a.camera_specs?.telephoto_aperture ?? null}
            valueB={b.camera_specs?.telephoto_aperture ?? null}
          />
        )}
        {atLeastOne(
          a.camera_specs?.telephoto_zoom,
          b.camera_specs?.telephoto_zoom,
        ) && (
          <SpecRow
            label="Zoom"
            valueA={a.camera_specs?.telephoto_zoom ?? null}
            valueB={b.camera_specs?.telephoto_zoom ?? null}
          />
        )}
        <SpecRow
          label="Vídeo"
          valueA={a.camera_specs?.video_resolution ?? null}
          valueB={b.camera_specs?.video_resolution ?? null}
        />
        <SpecRow
          label="Frontal"
          valueA={a.camera_specs?.front_camera_mp ?? null}
          valueB={b.camera_specs?.front_camera_mp ?? null}
          unit=" MP"
          higherIsBetter
        />
        {atLeastOne(
          a.camera_specs?.front_camera_aperture,
          b.camera_specs?.front_camera_aperture,
        ) && (
          <SpecRow
            label="Abertura frontal"
            valueA={a.camera_specs?.front_camera_aperture ?? null}
            valueB={b.camera_specs?.front_camera_aperture ?? null}
          />
        )}
        {atLeastOne(
          a.camera_specs?.front_video_resolution,
          b.camera_specs?.front_video_resolution,
        ) && (
          <SpecRow
            label="Vídeo frontal"
            valueA={a.camera_specs?.front_video_resolution ?? null}
            valueB={b.camera_specs?.front_video_resolution ?? null}
          />
        )}

        {atLeastOne(
          a.camera_specs?.camera_features,
          b.camera_specs?.camera_features,
        ) && (
          <SpecRow
            label="Recursos da câmera"
            valueA={a.camera_specs?.camera_features ?? null}
            valueB={b.camera_specs?.camera_features ?? null}
          />
        )}
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
        <SpecRow
          label="SIM"
          valueA={a.phone_specs?.sim_slots ?? null}
          valueB={b.phone_specs?.sim_slots ?? null}
        />
        <BoolRow
          label="eSIM"
          valueA={a.phone_specs?.has_esim ?? null}
          valueB={b.phone_specs?.has_esim ?? null}
        />
        {atLeastOne(a.phone_specs?.sim_type, b.phone_specs?.sim_type) && (
          <SpecRow
            label="Tipo SIM"
            valueA={a.phone_specs?.sim_type ?? null}
            valueB={b.phone_specs?.sim_type ?? null}
          />
        )}
        <SpecRow
          label="Redes"
          valueA={networksA || null}
          valueB={networksB || null}
        />
        <SpecRow
          label="Wi-Fi"
          valueA={a.phone_specs?.wifi ?? null}
          valueB={b.phone_specs?.wifi ?? null}
        />
        <SpecRow
          label="Bluetooth"
          valueA={a.phone_specs?.bluetooth ?? null}
          valueB={b.phone_specs?.bluetooth ?? null}
        />
        <BoolRow
          label="NFC"
          valueA={a.phone_specs?.nfc ?? null}
          valueB={b.phone_specs?.nfc ?? null}
        />
        <SpecRow
          label="USB"
          valueA={a.phone_specs?.usb_type ?? null}
          valueB={b.phone_specs?.usb_type ?? null}
        />
        {atLeastOne(a.phone_specs?.usb_version, b.phone_specs?.usb_version) && (
          <SpecRow
            label="USB versão"
            valueA={a.phone_specs?.usb_version ?? null}
            valueB={b.phone_specs?.usb_version ?? null}
          />
        )}

        <SectionHeader
          title={
            <>
              <Icons.Features />
              Recursos
            </>
          }
        />
        {atLeastOne(a.phone_specs?.ip_rating, b.phone_specs?.ip_rating) && (
          <SpecRow
            label="Proteção IP"
            valueA={a.phone_specs?.ip_rating ?? null}
            valueB={b.phone_specs?.ip_rating ?? null}
          />
        )}
        <BoolRow
          label="Cartão memória"
          valueA={a.phone_specs?.has_memory_card ?? null}
          valueB={b.phone_specs?.has_memory_card ?? null}
        />
        <SpecRow
          label="Alto-falantes"
          valueA={a.phone_specs?.speakers ?? null}
          valueB={b.phone_specs?.speakers ?? null}
        />
        <BoolRow
          label="P2 (fone)"
          valueA={a.phone_specs?.has_headphone_jack ?? null}
          valueB={b.phone_specs?.has_headphone_jack ?? null}
        />
        <BoolRow
          label="Sensor de impressão digital"
          valueA={a.phone_specs?.has_fingerprint ?? null}
          valueB={b.phone_specs?.has_fingerprint ?? null}
        />

        <SectionHeader
          title={
            <>
              <Icons.General />
              Geral
            </>
          }
        />
        {atLeastOne(a.model, b.model) && (
          <SpecRow label="Modelo" valueA={a.model} valueB={b.model} />
        )}
        {atLeastOne(a.variant_label, b.variant_label) && (
          <SpecRow
            label="Variante"
            valueA={a.variant_label}
            valueB={b.variant_label}
          />
        )}
        <SpecRow
          label="Lançamento"
          valueA={a.launch_year}
          valueB={b.launch_year}
          higherIsBetter
        />
        <SpecRow label="Sistema" valueA={a.os} valueB={b.os} />
        <SpecRow
          label="Peso"
          valueA={a.weight_g}
          valueB={b.weight_g}
          unit="g"
          lowerIsBetter
        />
        {atLeastOne(a.height_mm, b.height_mm) && (
          <SpecRow
            label="Altura"
            valueA={a.height_mm}
            valueB={b.height_mm}
            unit="mm"
            lowerIsBetter
          />
        )}
        {atLeastOne(a.width_mm, b.width_mm) && (
          <SpecRow
            label="Largura"
            valueA={a.width_mm}
            valueB={b.width_mm}
            unit="mm"
            lowerIsBetter
          />
        )}
        {atLeastOne(a.thickness_mm, b.thickness_mm) && (
          <SpecRow
            label="Espessura"
            valueA={a.thickness_mm}
            valueB={b.thickness_mm}
            unit="mm"
            lowerIsBetter
          />
        )}
        {atLeastOne(a.overall_score, b.overall_score) && (
          <SpecRow
            label="Score"
            valueA={a.overall_score}
            valueB={b.overall_score}
            higherIsBetter
          />
        )}
      </div>

      <ScrollToTop />
    </main>
  );
}
