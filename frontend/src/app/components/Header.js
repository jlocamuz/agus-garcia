'use client'

import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Función para hacer scroll suave - CONTACTO AL FONDO
  const scrollToSection = (sectionId) => {
    // Si es contacto, ir al fondo de la página
    if (sectionId === 'contacto') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      closeMobileMenu();
      return;
    }

    // Para las demás secciones, usar offsets normales
    const element = document.getElementById(sectionId);
    if (element) {
      const offsets = {
        'about': 400,     // Sobre mí: perfecto como está
        'recursos': 300,  // Recursos: moderado
        'servicios': 300, // Servicios: moderado
      };
      
      const offset = offsets[sectionId] || 300;
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    closeMobileMenu();
  }

  return (
    <header className="bg-olivaclaro shadow-sm sticky top-0 z-50 border-b border-oliva/20">
      <nav className="max-w-sm mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex-shrink-0">
            <img
              src="/images/image.png"
              alt="Psiag - Agustina García"
              className="h-12 w-auto object-contain"
            />
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="text-oliva hover:text-oliva/80 p-2 rounded-xl hover:bg-olivaclaro transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-4' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl shadow-lg border border-olivaclaro p-4 space-y-2">
            <button 
              onClick={() => scrollToSection('about')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-olivaclaro hover:text-oliva rounded-xl transition-colors w-full text-left"
            >
              <span className="text-lg">👋</span>
              <span className="font-medium">Sobre mí</span>
            </button>

            <button 
              onClick={() => scrollToSection('servicios')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-olivaclaro hover:text-oliva rounded-xl transition-colors w-full text-left"
            >
              <span className="text-lg">📋</span>
              <span className="font-medium">Servicios</span>
            </button>
            
                        
            <button 
              onClick={() => scrollToSection('recursos')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-olivaclaro hover:text-oliva rounded-xl transition-colors w-full text-left"
            >
              <span className="text-lg">🧠</span>
              <span className="font-medium">Recursos Gratuitos</span>
            </button>
            
            <button 
              onClick={() => scrollToSection('contacto')}
              className="flex items-center space-x-3 px-4 py-3 text-white bg-oliva hover:bg-oliva/90 rounded-xl transition-colors w-full text-left"
            >
              <span className="text-lg">💬</span>
              <span className="font-medium">Contacto</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}