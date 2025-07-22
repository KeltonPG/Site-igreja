import { useEffect, useRef, useState } from 'react'
import './Eventos.scss'
import Modal from '../../../../components/Modal/Modal'
import '../../../../components/Modal/Modal.scss'

interface Evento {
  id: number
  titulo: string
  data: string
  horario: string
  duracaoMinutos?: number
  descricao: string
  imagem: string
  categoria: string
  linkLive?: string
}

export default function Eventos() {
  const hoje = new Date().toISOString().split('T')[0]

  const eventos: Evento[] = [
    {
      id: 0,
      titulo: 'Culto do Dia',
      data: hoje,
      horario: '17:00',
      duracaoMinutos: 60,
      descricao: 'Culto especial para a comunidade com louvor e palavra.',
      imagem: 'https://picsum.photos/400/250?random=1',
      categoria: 'Culto',
      linkLive: 'https://youtube.com/live-exemplo'
    },
    {
      id: 1,
      titulo: 'Culto Jovem',
      data: '2025-08-23',
      horario: '17:00',
      duracaoMinutos: 11,
      descricao: 'Culto especial para a galera jovem.',
      imagem: 'https://picsum.photos/400/250?random=2',
      categoria: 'Juventude'
    },
    {
      id: 2,
      titulo: 'Encontro de Casais',
      data: hoje,
      horario: '18:00',
      duracaoMinutos: 120,
      descricao: 'Momento especial para fortalecer relacionamentos.',
      imagem: 'https://picsum.photos/400/250?random=3',
      categoria: 'Casais'
    },
    {
      id: 3,
      titulo: 'Palestra Bíblia e Vida',
      data: '2025-07-30',
      horario: '20:00',
      duracaoMinutos: 60,
      descricao: 'Palestra sobre aplicação da bíblia no dia a dia.',
      imagem: 'https://picsum.photos/400/250?random=4',
      categoria: 'Palestra'
    },
    {
      id: 4,
      titulo: 'Palestra',
      data: '2025-07-30',
      horario: '20:00',
      duracaoMinutos: 60,
      descricao: 'Palestra sobre aplicação da bíblia no dia a dia.',
      imagem: 'https://picsum.photos/400/250?random=4',
      categoria: 'Palestra'
    },
  ]

  const [indiceAtual, setIndiceAtual] = useState(0)
  const [tempoRestante, setTempoRestante] = useState<string>('')
  const [autoPlay, setAutoPlay] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null)

  const carrosselRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)

  const eventosVisiveis = eventos.filter(evento => {
    const inicio = new Date(`${evento.data}T${evento.horario}`)
    const duracaoMs = (evento.duracaoMinutos ?? 60) * 60000
    const fim = new Date(inicio.getTime() + duracaoMs)
    const agora = new Date()
    return agora <= new Date(fim.getTime() + 24 * 3600000)
  })

  const eventosOrdenados = [...eventosVisiveis].sort((a, b) => {
    const ehHoje = (data: string) => data === hoje ? -1 : 1
    return ehHoje(a.data) - ehHoje(b.data)
  })

  function formatarDataBR(dataISO: string) {
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}/${mes}/${ano}`
  }

  useEffect(() => {
    if (indiceAtual >= eventosOrdenados.length) {
      setIndiceAtual(0)
    }
  }, [eventosOrdenados.length, indiceAtual])

  const eventoAtual = eventosOrdenados[indiceAtual] ?? eventosOrdenados[0]

  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setIndiceAtual(prev => (prev + 1) % eventosOrdenados.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoPlay, eventosOrdenados.length])

  useEffect(() => {
    if (!eventoAtual) return
    const interval = setInterval(() => {
      const inicio = new Date(`${eventoAtual.data}T${eventoAtual.horario}`)
      const duracaoMs = (eventoAtual.duracaoMinutos ?? 60) * 60000
      const fim = new Date(inicio.getTime() + duracaoMs)
      const agora = new Date()

      if (agora >= inicio && agora <= fim) {
        setTempoRestante('Acontecendo agora!')
      } else if (agora < inicio) {
        const diff = inicio.getTime() - agora.getTime()
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setTempoRestante(`${h}h ${m}m ${s}s`)
      } else {
        setTempoRestante('Evento finalizado')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [eventoAtual])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (carrosselRef.current) {
      const cards = carrosselRef.current.children
      // if (cards[indiceAtual]) {
      //   ;(cards[indiceAtual] as HTMLElement).scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'nearest',
      //     inline: 'center',
      //   })
      // }
    }
  }, [indiceAtual])

  // Remover funções scrollEsquerda e scrollDireita

  // Variáveis para drag/swipe
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // Funções de drag para mouse (corrigido)
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true
    startX.current = e.pageX - (carrosselRef.current?.offsetLeft || 0)
    scrollLeft.current = carrosselRef.current?.scrollLeft || 0
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMouseMoveWindow)
    window.addEventListener('mouseup', onMouseUpWindow)
  }
  const onMouseMoveWindow = (e: MouseEvent) => {
    if (!isDragging.current) return
    const x = e.pageX - (carrosselRef.current?.offsetLeft || 0)
    const walk = (x - startX.current) * 1.2
    if (carrosselRef.current)
      carrosselRef.current.scrollLeft = scrollLeft.current - walk
  }
  const onMouseUpWindow = () => {
    isDragging.current = false
    document.body.style.userSelect = ''
    window.removeEventListener('mousemove', onMouseMoveWindow)
    window.removeEventListener('mouseup', onMouseUpWindow)
  }
  const onMouseLeave = () => {
    // Não faz nada, pois o mouseup global já cuida
  }
  const onMouseUp = () => {
    // Não faz nada, pois o mouseup global já cuida
  }
  const onMouseMove = () => {
    // Não faz nada, pois o mousemove global já cuida
  }

  // Funções de drag para touch (mantém igual)
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true
    startX.current = e.touches[0].pageX - (carrosselRef.current?.offsetLeft || 0)
    scrollLeft.current = carrosselRef.current?.scrollLeft || 0
  }
  const onTouchEnd = () => {
    isDragging.current = false
  }
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const x = e.touches[0].pageX - (carrosselRef.current?.offsetLeft || 0)
    const walk = (x - startX.current) * 1.2
    if (carrosselRef.current)
      carrosselRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <>
      <section className="carrossel-eventos fade" id="eventos">
        {/* Remover botões de seta */}
        {/* <button className="seta esquerda" onClick={scrollEsquerda}>◀</button> */}

        <div
          className="container-cards"
          ref={carrosselRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
          style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
        >
          {eventosOrdenados.map((evento, index) => {
            const ativo = index === indiceAtual
            const inicio = new Date(`${evento.data}T${evento.horario}`)
            const duracaoMs = (evento.duracaoMinutos ?? 60) * 60000
            const fim = new Date(inicio.getTime() + duracaoMs)
            const agora = new Date()

            const emAndamento = agora >= inicio && agora <= fim
            const passou = agora > fim
            const ehHoje = evento.data === hoje

            let classeBorda = ''
            if (passou) classeBorda = 'finalizado'
            else if (emAndamento) classeBorda = 'ao-vivo'
            else if (ehHoje) classeBorda = 'eh-hoje'

            return (
              <div
                key={evento.id}
                className={`card-evento ${ativo ? 'ativo' : ''} ${classeBorda} ${passou && ativo ? 'passado' : ''}`}
                onClick={e => {
                  e.preventDefault()
                  setIndiceAtual(index)
                  setAutoPlay(false)
                  setEventoSelecionado(evento)
                  setModalAberto(true)
                }}
              >
                <img src={evento.imagem} alt={evento.titulo} />
                <span className={`categoria ${evento.categoria.toLowerCase()}`}>{evento.categoria}</span>
                <h3>{evento.titulo}</h3>
                <p>{evento.descricao}</p>
                <p><strong>{formatarDataBR(evento.data)} - {evento.horario}</strong></p>
                {ativo && ehHoje && (
                  <p className={`contador ${tempoRestante === 'Acontecendo agora!' ? 'finalizado' : ''}`}>
                    {tempoRestante}
                  </p>
                )}
                {evento.linkLive && emAndamento && (
                  <a href={evento.linkLive} target="_blank" className="tag-live" rel="noreferrer">🔴 Ao Vivo</a>
                )}
              </div>
            )
          })}
        </div>

        {/* <button className="seta direita" onClick={scrollDireita}>▶</button> */}

        <div className="paginacao">
          {eventosOrdenados.map((_, i) => (
            <span
              key={i}
              className={`ponto ${i === indiceAtual ? 'ativo' : ''}`}
              onClick={e => {
                e.preventDefault()
                setIndiceAtual(i)
                setAutoPlay(false)
              }}
            />
          ))}
        </div>
      </section>
      <Modal aberto={modalAberto} onClose={() => setModalAberto(false)}>
        {eventoSelecionado && (
          <>
            <h2>{eventoSelecionado.titulo}</h2>
            <img src={eventoSelecionado.imagem} alt={eventoSelecionado.titulo} style={{width: '100%', borderRadius: 8, marginBottom: 16}} />
            <p><strong>Data:</strong> {formatarDataBR(eventoSelecionado.data)} - {eventoSelecionado.horario}</p>
            <p><strong>Categoria:</strong> {eventoSelecionado.categoria}</p>
            <p>{eventoSelecionado.descricao}</p>
            {eventoSelecionado.linkLive && (
              <a href={eventoSelecionado.linkLive} target="_blank" rel="noreferrer" style={{display: 'inline-block', marginTop: 12, color: '#ef4444', fontWeight: 'bold'}}>
                🔴 Ao Vivo
              </a>
            )}
          </>
        )}
      </Modal>
    </>
  )
}
