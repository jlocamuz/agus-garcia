'use client';

import { useState, useEffect } from 'react';
import { getContenidoPorSeccion } from '../lib/supabase';

export default function AboutMe() {
  const [contenido, setContenido] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar contenido desde Supabase
  useEffect(() => {
    async function loadContenido() {
      try {
        const data = await getContenidoPorSeccion('about');
        
        // Organizar contenido por tipo para facilitar el renderizado
        const contenidoOrganizado = {
          titulo: '',
          parrafos: [],
          formacionTitulo: '',
          formacionItems: []
        };

        data.forEach(item => {
          switch (item.tipo) {
            case 'titulo':
              contenidoOrganizado.titulo = item.contenido;
              break;
            case 'parrafo':
              contenidoOrganizado.parrafos.push(item.contenido);
              break;
            case 'subtitulo':
              if (item.id === 'about-formacion-titulo') {
                contenidoOrganizado.formacionTitulo = item.contenido;
              }
              break;
            case 'item-lista':
              contenidoOrganizado.formacionItems.push(item.contenido);
              break;
          }
        });
        
        setContenido(contenidoOrganizado);
      } catch (error) {
        console.error('Error cargando contenido de about:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContenido();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-16 bg-white">
        <div className="px-4">
          <div className="max-w-sm mx-auto text-center">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded mx-auto w-1/2"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-gray-200 rounded-2xl h-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-16 bg-white">
      <div className="px-4">
        <div className="max-w-sm mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {contenido.titulo || 'Sobre mí'}
          </h2>
          
          <div className="space-y-4 text-gray-600 leading-relaxed text-left">
            {contenido.parrafos.length > 0 ? (
              contenido.parrafos.map((parrafo, index) => (
                <p key={index}>
                  {parrafo}
                </p>
              ))
            ) : (
              // Fallback content si no hay párrafos en la BD
              <>
                <p>
                  Soy psicóloga con más de 8 años de experiencia especializada en trastornos de ansiedad, depresión y problemas de pareja.
                </p>
                <p>
                  Mi enfoque combina terapia cognitivo-conductual y métodos humanísticos, creyendo firmemente que cada persona tiene los recursos internos para cambiar.
                </p>
                <p>
                  Graduada de la Universidad Estatal Lomonósov de Moscú, me actualizo constantemente participando en congresos profesionales.
                </p>
              </>
            )}
          </div>

          {/* Credenciales */}
          <div className="bg-olivaclaro rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4 text-left">
              {contenido.formacionTitulo || 'Formación'}
            </h3>
            <div className="space-y-4 text-sm">
              {contenido.formacionItems.length > 0 ? (
                contenido.formacionItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-oliva rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-left">{item}</span>
                  </div>
                ))
              ) : (
                // Fallback content si no hay items de formación en la BD
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-oliva rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-left">Universidad Estatal Lomonósov de Moscú</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-oliva rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-left">Especialización en Terapia Cognitivo-Conductual</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-oliva rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-left">Métodos Humanísticos en Psicología</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}