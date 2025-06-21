import { useEffect, useState } from 'react'
import './Eventos.scss'

interface Evento {
  id: number
  titulo: string
  data: string
  horario: string
  descricao: string
  imagem: string
  linkDetalhes?: string
}

// Imagens aleatórias para demo
const imagensAleatorias = [
  'https://picsum.photos/400/250?random=1',
  'https://picsum.photos/400/250?random=2',
  'https://picsum.photos/400/250?random=3',
  'https://picsum.photos/400/250?random=4',
  'https://picsum.photos/400/250?random=5',
]

function estaHoje(evento: Evento): boolean {
  const hoje = new Date()
  const dataEvento = new Date(evento.data + 'T00:00:00')
  return (
    dataEvento.getFullYear() === hoje.getFullYear() &&
    dataEvento.getMonth() === hoje.getMonth() &&
    dataEvento.getDate() === hoje.getDate()
  )
}

function isEventoAtual(evento: Evento): boolean {
  const agora = new Date()
  const dataEvento = new Date(evento.data + 'T' + evento.horario)
  const fimEvento = new Date(dataEvento.getTime() + 60 * 60 * 1000) // 1 hora
  return agora >= dataEvento && agora < fimEvento
}

export default function Eventos() {
  const eventosOriginais: Evento[] = [
    {
      id: 1,
      titulo: 'Culto Jovem',
      data: '2025-06-21',
      horario: '19:30',
      descricao: 'Culto especial para a galera jovem.',
      imagem: '',
      linkDetalhes: '/eventos/culto-jovem',
    },
    {
      id: 2,
      titulo: 'Encontro de Casais',
      data: '2025-06-25',
      horario: '18:00',
      descricao: 'Momento especial para fortalecer relacionamentos.',
      imagem: '',
      linkDetalhes: '/eventos/encontro-casais',
    },
    {
      id: 3,
      titulo: 'Palestra Bíblia e Vida',
      data: '2025-06-28',
      horario: '20:00',
      descricao: 'Palestra sobre aplicação da bíblia no dia a dia.',
      imagem: '',
      linkDetalhes: '/eventos/palestra-biblia',
    },
  ]

  // Substitui imagens vazias por aleatórias
  const eventos = eventosOriginais.map((evento, i) => ({
    ...evento,
    imagem: imagensAleatorias[i % imagensAleatorias.length],
  }))

  const [indiceAtual, setIndiceAtual] = useState(0)
  const [eventoModal, setEventoModal] = useState<Evento | null>(null)
  const [agora, setAgora] = useState(new Date())

  // Atualiza 'agora' a cada segundo para contagem regressiva dinâmica
  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const proximo = () => {
    setIndiceAtual((prev) => (prev + 1) % eventos.length)
  }

  const anterior = () => {
    setIndiceAtual((prev) => (prev === 0 ? eventos.length - 1 : prev - 1))
  }

  // Contagem regressiva formatada para evento que vai começar hoje
  function contagemRegressiva(evento: Evento) {
    const dataEvento = new Date(evento.data + 'T' + evento.horario)
    const diffMs = dataEvento.getTime() - agora.getTime()
    if (diffMs <= 0) return null
    const segundos = Math.floor((diffMs / 1000) % 60)
    const minutos = Math.floor((diffMs / (1000 * 60)) % 60)
    const horas = Math.floor(diffMs / (1000 * 60 * 60))
    return `${horas}h ${minutos}m ${segundos}s`
  }

  return (
    <section className="eventos-carrossel-container">
      <h3>Eventos</h3>

      <div
        className="carrossel-wrapper"
        onMouseEnter={() => document.body.classList.add('mostrar-setas')}
        onMouseLeave={() => document.body.classList.remove('mostrar-setas')}
      >
        <button className="seta esquerda" onClick={anterior}>
          ❮
        </button>

        <div className="cards">
          {eventos.map((evento, i) => {
            const hoje = estaHoje(evento)
            const atual = isEventoAtual(evento)
            const vaiComecar = hoje && !atual && contagemRegressiva(evento)

            return (
              <div
                key={evento.id}
                className={`card ${
                  i === indiceAtual ? 'ativo' : ''
                } ${
                  atual
                    ? 'evento-atual'
                    : vaiComecar
                    ? 'evento-hoje-vai-comecar'
                    : ''
                }`}
                style={{ transform: `translateX(${(i - indiceAtual) * 110}%)` }}
                onClick={() => setEventoModal(evento)}
              >
                <img src={evento.imagem} alt={evento.titulo} />
                <h4>{evento.titulo}</h4>
                <p>
                  {evento.data} - {evento.horario}
                </p>
                {vaiComecar && (
                  <p className="contagem-regressiva">
                    Começa em: {contagemRegressiva(evento)}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <button className="seta direita" onClick={proximo}>
          ❯
        </button>
      </div>

      {/* Modal */}
      {eventoModal && (
        <div className="modal-fundo" onClick={() => setEventoModal(null)}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <button className="fechar" onClick={() => setEventoModal(null)}>
              &times;
            </button>
            <img src={eventoModal.imagem} alt={eventoModal.titulo} />
            <h2>{eventoModal.titulo}</h2>
            <p>
              {eventoModal.data} - {eventoModal.horario}
            </p>
            <p>{eventoModal.descricao}</p>
            {eventoModal.linkDetalhes && (
              <a href={eventoModal.linkDetalhes} className="btn-detalhes">
                Ver mais detalhes
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
