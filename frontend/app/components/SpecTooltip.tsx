'use client'

import { useState } from 'react'

const descriptions: Record<string, string> = {
  // Tela
  'Tamanho': 'Indica o tamanho da tela medido na diagonal, em polegadas. Telas maiores oferecem mais conforto para vídeos, leitura e jogos, enquanto telas menores facilitam o uso com uma mão.',
  'Tipo': 'Define a tecnologia do painel da tela. AMOLED entrega cores mais intensas, contraste superior e pretos profundos. LCD e IPS costumam ter bom custo-benefício e boa fidelidade de cores.',
  'Resolução': 'Representa a quantidade de pixels exibidos na tela. Quanto maior a resolução, mais nítidas e detalhadas ficam imagens, vídeos e textos.',
  'Refresh': 'Taxa de atualização da tela em Hertz (Hz). Valores mais altos, como 90Hz ou 120Hz, tornam rolagens, animações e jogos muito mais fluidos.',
  'Brilho': 'Mede a intensidade máxima de luz da tela em nits. Quanto maior o valor, melhor a visibilidade em ambientes externos ou sob luz forte.',
  'PPI': 'Quantidade de pixels por polegada. Um valor maior significa imagens mais definidas, com textos e detalhes mais nítidos.',
  'Proteção': 'Tipo de vidro ou camada protetora da tela. Quanto mais avançada a proteção, maior a resistência contra riscos e quedas.',
  'HDR': 'Recurso que melhora contraste, brilho e profundidade das cores em conteúdos compatíveis, oferecendo uma imagem mais realista.',
  'Proporção': 'Relação entre largura e altura da tela. Formatos mais alongados são melhores para vídeos, navegação e multitarefa.',

  // Hardware
  'Chipset': 'É o processador principal do dispositivo, responsável pelo desempenho geral em aplicativos, jogos, câmera e eficiência energética.',
  'CPU': 'Processador central do aparelho. Quanto melhor a CPU, maior a velocidade para executar tarefas e alternar entre aplicativos.',
  'GPU': 'Responsável pelo processamento gráfico. Impacta diretamente a qualidade visual em jogos, vídeos e animações do sistema.',
  'RAM': 'Memória usada para manter apps e processos ativos. Mais RAM melhora a multitarefa e reduz travamentos.',
  'Tipo RAM': 'Tecnologia da memória RAM. Versões mais recentes oferecem maior velocidade e menor consumo de bateria.',
  'Armazenamento': 'Espaço interno disponível para instalar aplicativos, salvar fotos, vídeos e arquivos.',
  'Tipo armazen.': 'Tecnologia usada no armazenamento interno. Versões mais modernas tornam o aparelho mais rápido ao abrir apps e transferir arquivos.',
  'Bateria': 'Capacidade total da bateria em mAh. Valores maiores normalmente indicam maior autonomia de uso.',
  'Carregamento': 'Potência máxima de carregamento com fio. Quanto maior o valor em Watts, menor o tempo necessário para recarregar.',
  'Wireless': 'Indica suporte a carregamento sem fio, oferecendo mais praticidade no uso diário.',
  'Carreg. reverso': 'Permite usar o aparelho para recarregar outros dispositivos compatíveis, como fones ou relógios.',

  // Câmera
  'Principal': 'Resolução da câmera traseira principal. Embora megapixels sejam importantes, qualidade do sensor e software também influenciam muito no resultado.',
  'Abertura': 'Quantidade de luz que a lente consegue capturar. Valores menores favorecem fotos mais claras, especialmente à noite.',
  'OIS': 'Estabilização óptica que reduz tremores durante fotos e vídeos, melhorando nitidez e suavidade.',
  'Ultra-wide': 'Lente com ângulo mais aberto, ideal para paisagens, grupos de pessoas e ambientes amplos.',
  'Telefoto': 'Lente dedicada ao zoom óptico, permitindo aproximar objetos distantes sem perder qualidade.',
  'Zoom': 'Nível máximo de aproximação óptica disponível sem perda significativa de qualidade.',
  'Vídeo': 'Resolução máxima suportada para gravação de vídeos, como Full HD, 4K ou 8K.',
  'FPS': 'Quantidade de quadros por segundo na gravação. Valores maiores deixam o vídeo mais suave.',
  'Frontal': 'Especificação da câmera frontal, usada para selfies, chamadas de vídeo e reconhecimento facial.',

  // Conectividade
  'SIM': 'Quantidade de chips físicos que o aparelho suporta simultaneamente.',
  'eSIM': 'Chip digital integrado que dispensa cartão físico e pode ser ativado diretamente pela operadora.',
  'Redes': 'Tecnologias de conexão móvel compatíveis, como 4G e 5G. Versões mais recentes oferecem maior velocidade.',
  'Wi-Fi': 'Padrão de rede sem fio suportado. Versões mais novas melhoram velocidade, estabilidade e alcance.',
  'Bluetooth': 'Versão da conexão Bluetooth usada para acessórios como fones, relógios e caixas de som.',
  'NFC': 'Permite pagamentos por aproximação, pareamento rápido e troca de dados entre dispositivos próximos.',
  'GPS': 'Sistemas de localização compatíveis. Mais sistemas podem melhorar precisão e velocidade de posicionamento.',
  'USB': 'Tipo e velocidade da porta usada para carregamento e transferência de dados.',
  'Rádio FM': 'Permite ouvir emissoras de rádio sem necessidade de internet.',
  'Infravermelho': 'Permite usar o aparelho como controle remoto para TVs, ar-condicionado e outros eletrônicos.',

  // Recursos
  'Proteção IP': 'Certificação de resistência à água e poeira. Quanto maior a classificação, maior a proteção.',
  'Cartão memória': 'Permite expandir o armazenamento interno com cartão microSD.',
  'Máx. cartão': 'Capacidade máxima de cartão de memória suportada pelo aparelho.',
  'Alto-falantes': 'Configuração de áudio do dispositivo. Som estéreo oferece experiência mais imersiva.',
  'P2 (fone)': 'Entrada tradicional para fones de ouvido com conector de 3,5 mm.',
  'Áudio': 'Recursos extras de som, como áudio espacial, Dolby Atmos e alta resolução.',
  'Sensores': 'Componentes que auxiliam em recursos como rotação de tela, bússola, biometria e movimentos.',
  'Sensor de impressão digital':'Componente responsável por reconhecer e autenticar a impressão digital do usuário, permitindo desbloquear o aparelho e acessar funções com mais segurança.',

  // Geral
  'Lançamento': 'Data ou ano em que o dispositivo foi lançado oficialmente.',
  'Sistema': 'Sistema operacional instalado, responsável pela interface e funcionamento do aparelho.',
  'Peso': 'Peso total do dispositivo em gramas. Influencia conforto no uso diário.',
  'Score': 'Pontuação geral baseada no conjunto das especificações, usada para facilitar a comparação entre modelos.',
}

export function SpecTooltip({ label }: { label: string }) {
  const [show, setShow] = useState(false)
  const description = descriptions[label]

  if (!description) return null

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="w-1 h-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-[10px] flex items-center justify-center hover:bg-teal-100 hover:text-teal-500 dark:hover:bg-teal-900 dark:hover:text-teal-400 transition-colors cursor-help"
        aria-label={`Explicação: ${label}`}
      >
        ⓘ
      </button>

      {show && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-max max-w-[260px] min-w-[220px] bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl leading-relaxed whitespace-normal break-words">
          <div className="font-medium text-teal-400 mb-1">{label}</div>
          {description}
          {/* Seta */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
        </div>
      )}
    </span>
  )
}