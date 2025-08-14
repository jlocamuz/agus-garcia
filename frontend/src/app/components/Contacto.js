'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';

export default function Contacto() {
  const [contenido, setContenido] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar contenido desde Supabase (igual que Hero)
  useEffect(() => {
    async function loadContenido() {
      try {
        console.log('🔄 Cargando contenido de contacto...');
        console.log('⏰ Timestamp:', new Date().toISOString());
        
        // Llamada directa a Supabase sin cache
        const { data, error } = await supabase
          .from('contenido')
          .select('*')
          .eq('seccion', 'contacto')
          .order('orden', { ascending: true });

        if (error) {
          console.error('❌ Error de Supabase:', error);
          throw error;
        }

        console.log('📦 Datos RAW de Supabase:', data);
        console.log('📊 Cantidad de registros:', data?.length || 0);
        
        if (!data || data.length === 0) {
          console.warn('⚠️ No hay datos para la sección "contacto"');
          setContenido({});
          return;
        }
        
        // Organizar contenido por ID para fácil acceso (igual que Hero)
        const contenidoOrganizado = {};
        data.forEach((item, index) => {
          contenidoOrganizado[item.id] = item.contenido;
          console.log(`📋 [${index}] ${item.id}: "${item.contenido}"`);
        });
        
        console.log('✅ Contenido organizado:', contenidoOrganizado);
        setContenido(contenidoOrganizado);
        
        // Mostrar específicamente el teléfono para debug
        console.log('📱 Teléfono en state:', contenidoOrganizado['contacto-telefono']);
        
      } catch (error) {
        console.error('❌ Error cargando contenido de contacto:', error);
        setContenido({});
      } finally {
        setLoading(false);
      }
    }

    loadContenido();

    // Recargar contenido cada 2 segundos para ver cambios MÁS rápido
    const interval = setInterval(() => {
      console.log('🔄 Recargando contenido automáticamente...');
      loadContenido();
    }, 2000);

    // Limpiar interval cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Funciones para manejar clicks en contacto
  const handleWhatsApp = () => {
    const numero = contenido['contacto-whatsapp']?.replace(/[^\d]/g, '') || contenido['contacto-telefono']?.replace(/[^\d]/g, '') || '5492611234567';
    const mensaje = `Hola, me interesa agendar una consulta`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const handleEmail = () => {
    const email = contenido['contacto-email'] || 'contacto@ejemplo.com';
    const asunto = 'Consulta - Sesión';
    window.open(`mailto:${email}?subject=${encodeURIComponent(asunto)}`, '_blank');
  };

  const handlePhone = () => {
    const telefono = contenido['contacto-telefono'] || '+5492611234567';
    window.open(`tel:${telefono}`, '_self');
  };

  if (loading) {
    return (
      <section id="contacto" className="py-16 bg-oliva text-white">
        <div className="px-4">
          <div className="max-w-sm mx-auto text-center">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/20 rounded mx-auto w-3/4"></div>
              <div className="h-6 bg-white/20 rounded mx-auto w-1/2"></div>
              <div className="space-y-3">
                <div className="h-12 bg-white/20 rounded"></div>
                <div className="h-12 bg-white/20 rounded"></div>
                <div className="h-12 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="py-16 bg-oliva text-white">
      <div className="px-4">
        <div className="max-w-sm mx-auto text-center space-y-8">
          
          {/* Título principal */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              {contenido['contacto-titulo'] || '¿Listo para comenzar?'}
            </h2>
            
            {/* Subtítulo */}
            <p className="text-xl text-olivaclaro">
              {contenido['contacto-subtitulo'] || 'Contáctame para agendar tu primera sesión'}
            </p>
            
            {/* Descripción */}
            <p className="text-white/90 leading-relaxed">
              {contenido['contacto-descripcion'] || 'Estoy aquí para acompañarte en tu proceso de crecimiento personal.'}
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            {/* Teléfono */}
            {contenido['contacto-telefono'] && (
              <button
                onClick={handlePhone}
                className="flex items-center justify-center space-x-3 w-full p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">{contenido['contacto-telefono']}</span>
              </button>
            )}

            {/* Email */}
            {contenido['contacto-email'] && (
              <button
                onClick={handleEmail}
                className="flex items-center justify-center space-x-3 w-full p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">{contenido['contacto-email']}</span>
              </button>
            )}

            {/* WhatsApp */}
            {contenido['contacto-whatsapp'] && (
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center space-x-3 w-full p-4 bg-green-600 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{contenido['contacto-whatsapp']}</span>
              </button>
            )}

            {/* Horarios */}
            {contenido['contacto-horarios'] && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-xl">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{contenido['contacto-horarios']}</span>
              </div>
            )}

            {/* Ubicación */}
            {contenido['contacto-ubicacion'] && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-xl">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{contenido['contacto-ubicacion']}</span>
              </div>
            )}
          </div>

          {/* Botones de acción principales */}
          <div className="space-y-3">
            {/* Botón principal */}
            {contenido['contacto-boton-principal'] && (
              <button
                onClick={handleWhatsApp}
                className="w-full bg-rosa text-white py-4 px-6 rounded-full font-semibold hover:bg-rosa/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {contenido['contacto-boton-principal']}
              </button>
            )}

            {/* Botón WhatsApp */}
            {contenido['contacto-boton-whatsapp'] && (
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-full font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {contenido['contacto-boton-whatsapp']}
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}