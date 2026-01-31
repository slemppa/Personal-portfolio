import Nav from './components/Nav'
import Hero from './components/Hero'
import Cases from './components/Cases'
import TechStack from './components/TechStack'
import YouTube from './components/YouTube'
import Story from './components/Story'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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

export default App
