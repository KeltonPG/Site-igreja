import FadeInSection from '../../components/FadeInSection/FadeInSection'

import Header from '../../components/Cabecalho/Cabecalho'
import Inicio from '../../components/Inicio/Inicio'
import Eventos from '../../components/Eventos/Eventos'
import Galeria from '../../components/Galeria/Galeria'
import Contato from '../../components/Contato/Contato'
import Rodape from '../../components/Rodape/Rodape'

import './Home.scss'

export default function Home() {
  return (
    <>
      <Header />
      <FadeInSection>
        <Inicio />
      </FadeInSection>
      <FadeInSection>
        <Eventos />
      </FadeInSection>
      <FadeInSection>
        <Galeria />
      </FadeInSection>
      <FadeInSection>
        <Contato />
      </FadeInSection>
      <Rodape />
    </>
  )
}
