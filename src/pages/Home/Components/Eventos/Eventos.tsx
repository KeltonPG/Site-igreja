import { useEffect, useState } from 'react'
import './Eventos.scss'

interface Evento {
  id: number
  titulo: string
  data?: string
  periodo?: { inicio: string; fim: string }
  horario: string
  descricao: string
  imagem: string
  linkDetalhes?: string
  diaDaSemana?: number // 0 dom - 6 sáb
}

const imagensAleatorias = [
  'https://picsum.photos/400/250?random=1',
  'https://picsum.photos/400/250?random=2',
  'https://picsum.photos/400/250?random=3',
  'https://picsum.photos/400/250?random=4',
  'https://picsum.photos/400/250?random=5',
]

const eventosOriginais: Evento[] = [
  {
    id: 1,
    titulo: 'Culto Jovem',
    data: '2025-06-23',
    horario: '19:30',
    descricao: 'Culto especial para a galera jovem.',
    imagem: '',
    linkDetalhes: '/eventos/culto-jovem',
  },
  {
    id: 2,
    titulo: 'Encontro de Casais',
    periodo: { inicio: '2025-06-22', fim: '2025-06-23' },
    horario: '18:00',
    descricao: 'Encontro com palestras e dinâmicas para casais.',
    imagem: '',
    linkDetalhes: '/eventos/encontro-casais',
  },
]

const eventosSemanais: Evento[] = [
  {
    id: 1001,
    titulo: 'Círculo de Oração',
    horario: '15:30',
    descricao: 'Momento de oração durante a tarde.',
    imagem: '',
    diaDaSemana: 2, // terça
  },
  {
    id: 1002,
    titulo: 'Culto dos Jovens',
    horario: '19:30',
    descricao: 'Culto voltado para a juventude.',
    imagem: '',
    diaDaSemana: 2, // terça
  },
  {
    id: 1003,
    titulo: 'Culto de Doutrina',
    horario: '19:30',
    descricao: 'Culto com ensino bíblico.',
    imagem: '',
    diaDaSemana: 4, // quinta
  },
  {
    id: 1004,
    titulo: 'Culto Normal',
    horario: '18:00',
    descricao: 'Culto de domingo para toda a igreja.',
    imagem: '',
    diaDaSemana: 0, // domingo
  },
]

function gerarDataDoEventoSemanal(diaDaSemana: number, baseDate: Date): string {
  const diaAtual = baseDate.getDay()
  const diff = (diaDaSemana + 7 - diaAtual) % 7
  const data = new Date(baseDate)
  data.setDate(baseDate.getDate() + diff)
  return data.toISOString().split('T')[0]
}

function isHoje(data: string): boolean {
  const hoje = new Date().toISOString().split('T')[0]
  return hoje === data
}

function isEventoOcorrendoHoje(evento: Evento): boolean {
  const agora = new Date()
  if (!evento.data) return false
  const [h, m] = evento.horario.split(':').map(Number)
  const dataEvento = new Date(evento.data + 'T00:00:00')
  dataEvento.setHours(h, m, 0, 0)
  const fimEvento = new Date(dataEvento.getTime() + 60 * 60 * 1000)
  return agora >= dataEvento && agora < fimEvento
}

function contagemRegressiva(evento: Evento): string | null {
  if (!evento.data) return null
  const agora = new Date()
  const eventoData = new Date(evento.data + 'T' + evento.horario)
  const diff = eventoData.getTime() - agora.getTime()
  if (diff <= 0) return null

  const horas = Math.floor(diff / (1000 * 60 * 60))
  const minutos = Math.floor((diff / (1000 * 60)) % 60)
  const segundos = Math.floor((diff / 1000) % 60)
  return `${horas}h ${minutos}m ${segundos}s`
}

export default function Eventos() {
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [eventoModal, setEventoModal] = useState<Evento | null>(null)
  const [agora, setAgora] = useState(new Date())
  const [eventosSemana, setEventosSemana] = useState<Evento[]>([])

  // Atualiza os eventos semanais com datas sempre atuais
  useEffect(() => {
    const atualizarEventosSemana = () => {
      const baseDate = new Date()
      const atualizados = eventosSemanais.map((evento, i) => ({
        ...evento,
        data: gerarDataDoEventoSemanal(evento.diaDaSemana!, baseDate),
        imagem: imagensAleatorias[(i + eventosOriginais.length) % imagensAleatorias.length],
      }))
      setEventosSemana(atualizados)
    }
    atualizarEventosSemana()

    // Atualiza todo dia à meia-noite
    const now = new Date()
    const msAteMeiaNoite =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const timeoutId = setTimeout(() => {
      atualizarEventosSemana()
      setInterval(atualizarEventosSemana, 24 * 60 * 60 * 1000)
    }, msAteMeiaNoite)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const eventos = [...eventosOriginais, ...eventosSemana]

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % eventos.length)
    }, 7000)
    return () => clearInterval(intervalo)
  }, [eventos.length])

  const proximo = () => setIndiceAtual((prev) => (prev + 1) % eventos.length)
  const anterior = () => setIndiceAtual((prev) => (prev === 0 ? eventos.length - 1 : prev - 1))

  return (
    <section className="eventos-carrossel-container">
      <h3>Eventos</h3>
      <div className="carrossel-wrapper">
        <button className="seta esquerda" onClick={anterior}>
          ❮
        </button>
        <div className="cards">
          {eventos.map((evento, i) => {
            const hoje = evento.data ? isHoje(evento.data) : false
            const atual = isEventoOcorrendoHoje(evento)
            const contagem = hoje && !atual ? contagemRegressiva(evento) : null

            return (
              <div
                key={evento.id}
                className={`card ${i === indiceAtual ? 'ativo' : ''} ${
                  atual ? 'evento-atual' : hoje && contagem ? 'evento-hoje' : ''
                }`}
                style={{ transform: `translateX(${(i - indiceAtual) * 240}px)` }}
                onClick={() => setEventoModal(evento)}
              >
                {atual && <span className="tag-ao-vivo">AO VIVO</span>}
                <img src={evento.imagem} alt={evento.titulo} />
                <h4>{evento.titulo}</h4>
                <p>
                  {evento.periodo
                    ? `De ${evento.periodo.inicio} até ${evento.periodo.fim}`
                    : `${evento.data} - ${evento.horario}`}
                </p>
                {contagem && <p className="contagem-regressiva">Começa em: {contagem}</p>}
              </div>
            )
          })}
        </div>
        <button className="seta direita" onClick={proximo}>
          ❯
        </button>
      </div>

      {eventoModal && (
        <div className="modal-fundo" onClick={() => setEventoModal(null)}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <button className="fechar" onClick={() => setEventoModal(null)}>
              &times;
            </button>
            <img src={eventoModal.imagem} alt={eventoModal.titulo} />
            <h2>{eventoModal.titulo}</h2>
            <p>
              {eventoModal.periodo
                ? `De ${eventoModal.periodo.inicio} até ${eventoModal.periodo.fim}`
                : `${eventoModal.data} - ${eventoModal.horario}`}
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
