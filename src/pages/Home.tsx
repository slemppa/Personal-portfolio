import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Manifesto from '../components/Manifesto'
import Cases from '../components/Cases'
import TechStack from '../components/TechStack'
import YouTube from '../components/YouTube'
import Story from '../components/Story'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Cases />
        <TechStack />
        <YouTube />
        <Story />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
