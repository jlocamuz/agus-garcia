'use client';

import { useState, useEffect } from 'react';
import { getContenidoPorSeccion } from '../lib/supabase';

export default function Hero() {
  const [contenido, setContenido] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar contenido desde Supabase
  useEffect(() => {
    async function loadContenido() {
      try {
        const data = await getContenidoPorSeccion('hero');
        
        // Organizar contenido por ID para fácil acceso
        const contenidoOrganizado = {};
        data.forEach(item => {
          contenidoOrganizado[item.id] = item.contenido;
        });
        
        setContenido(contenidoOrganizado);
      } catch (error) {
        console.error('Error cargando contenido del hero:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContenido();
  }, []);

  // Función para hacer scroll suave a la sección de servicios
  const handleScrollToOnlineConsulta = () => {
    const serviciosSection = document.getElementById('approach');
    if (serviciosSection) {
      serviciosSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Opcional: Resaltar brevemente la consulta online después del scroll
      setTimeout(() => {
        const consultaOnlineCard = document.querySelector('[data-service="consulta-online"]');
        if (consultaOnlineCard) {
          consultaOnlineCard.classList.add('ring-4', 'ring-rosa', 'ring-opacity-50');
          setTimeout(() => {
            consultaOnlineCard.classList.remove('ring-4', 'ring-rosa', 'ring-opacity-50');
          }, 2000);
        }
      }, 500);
    }
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-olivaclaro via-white to-oliva/20 min-h-screen flex items-center">
        <div className="w-full px-4 py-8">
          <div className="max-w-sm mx-auto text-center">
            <div className="animate-pulse space-y-8">
              <div className="w-48 h-48 mx-auto rounded-full bg-gray-200"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded mx-auto w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded mx-auto w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded mx-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-olivaclaro via-white to-oliva/20 min-h-screen flex items-center">
      <div className="w-full px-4 py-8">
        <div className="max-w-sm mx-auto text-center space-y-8">
          {/* Imagen de perfil circular */}
          <div className="relative">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-oliva/30 to-rosa/30 p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/images/agus3.png"
                  alt="Agustina García - Psicóloga"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Información principal */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {contenido['hero-nombre'] || 'Agustina García'}
              </h1>
              <p className="text-lg text-oliva font-medium">
                {contenido['hero-profesion'] || 'Psicóloga Clínica'}
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed px-4">
              {contenido['hero-descripcion'] || 'Te ayudo a lidiar con el estrés, la ansiedad y a construir relaciones saludables contigo mismo y con los demás.'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 px-4">
            <button
              onClick={handleScrollToOnlineConsulta}
              className="block w-full bg-oliva text-white py-4 px-6 rounded-full font-medium text-center hover:bg-oliva/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {contenido['hero-boton-principal'] || 'Empezar terapia'}
            </button>
            <a
              href="#about"
              className="block w-full border-2 border-oliva text-oliva py-4 px-6 rounded-full font-medium text-center hover:bg-olivaclaro transition-colors"
            >
              {contenido['hero-boton-secundario'] || 'Conocer más'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}