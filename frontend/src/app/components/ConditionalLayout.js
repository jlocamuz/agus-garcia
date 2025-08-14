'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../lib/supabase';
import Header from './Header';
import SocialMediaButtons from './SocialMediaButtons';

export default function ConditionalLayout({ children }) {
  console.log('🚀 CONDITIONAL LAYOUT INICIADO - VERSIÓN SIMPLE');
  
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  const [contenido, setContenido] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar contenido desde Supabase
  useEffect(() => {
    async function loadContenido() {
      try {
        console.log('🔄 Cargando contenido de footer...');
        
        const { data, error } = await supabase
          .from('contenido')
          .select('*')
          .eq('seccion', 'footer')
          .order('orden', { ascending: true });

        if (error) {
          console.error('❌ Error de Supabase:', error);
          throw error;
        }

        console.log('📦 Datos footer recibidos:', data);
        
        const contenidoOrganizado = {};
        data.forEach(item => {
          contenidoOrganizado[item.id] = item.contenido;
          console.log(`📋 Footer ${item.id}: "${item.contenido}"`);
        });
        
        setContenido(contenidoOrganizado);
        
      } catch (error) {
        console.error('❌ Error cargando contenido footer:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContenido();

    // Recargar cada 10 segundos
    const interval = setInterval(loadContenido, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Solo mostrar Header si NO es página de admin */}
      {!isAdminPage && <Header />}
      
      <main className="min-h-screen">
        {children}
      </main>
      
      {/* Solo mostrar Footer si NO es página de admin */}
      {!isAdminPage && (
        <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12">
          <div className="max-w-sm mx-auto px-4 text-center space-y-8">
            
            {/* Información principal */}
            <div>
              <h3 className="text-xl font-bold mb-2">
                {contenido['footer-nombre'] || 'Agustina García'}
              </h3>
              <p className="text-gray-400">
                {contenido['footer-profesion'] || 'Psicóloga Clínica'}
              </p>
            </div>
            
            {/* Secciones de contenido */}
            <div className="space-y-4">
              
              {/* Contacto rápido */}
              <div>
                <h4 className="font-semibold mb-2">
                  {contenido['footer-contacto-titulo'] || 'Contacto rápido'}
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>{contenido['footer-telefono'] || '📞 +54 9 261 123-4568'}</p>
                  <p>{contenido['footer-email'] || '✉️ agustina@psiag.com'}</p>
                </div>
              </div>
              
              {/* Horarios */}
              <div>
                <h4 className="font-semibold mb-2">
                  {contenido['footer-horarios-titulo'] || 'Horarios'}
                </h4>
                <div className="text-sm text-gray-300">
                  <p>{contenido['footer-horarios-semana'] || 'Lunes a Viernes: 9:00 - 18:00hs'}</p>
                  <p>{contenido['footer-horarios-fines'] || 'Fines de semana: Con cita previa'}</p>
                </div>
              </div>
              
            </div>

            {/* Redes sociales */}
            <SocialMediaButtons />
            
          </div>
        </footer>
      )}
    </>
  );
}