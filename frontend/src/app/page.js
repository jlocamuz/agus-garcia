// pages/Home.js (o el archivo principal)
import AboutMe from "./components/AboutMe";
import Hero from "./components/Hero";
import Recursos from "./components/Recursos";
import Contacto from "./components/Contacto";
import Servicios from "./components/Servicios";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutMe />
      <Recursos />
      <Servicios />
      <Contacto />
    </>
  );
}