'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SocialMediaButtons() {
  console.log('🚀 SOCIAL MEDIA BUTTONS INICIADO - VERSIÓN DINÁMICA');
  
  const [contenido, setContenido] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar contenido desde Supabase
  useEffect(() => {
    async function loadContenido() {
      try {
        console.log('🔄 Cargando redes sociales...');
        
        const { data, error } = await supabase
          .from('contenido')
          .select('*')
          .eq('seccion', 'redes')
          .order('orden', { ascending: true });

        if (error) {
          console.error('❌ Error de Supabase:', error);
          throw error;
        }

        console.log('📦 Datos redes recibidos:', data);
        
        const contenidoOrganizado = {};
        data.forEach(item => {
          contenidoOrganizado[item.id] = item.contenido;
          console.log(`📋 Red ${item.id}: "${item.contenido}"`);
        });
        
        setContenido(contenidoOrganizado);
        
      } catch (error) {
        console.error('❌ Error cargando redes sociales:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContenido();

    // Recargar cada 10 segundos
    const interval = setInterval(loadContenido, 10000);
    return () => clearInterval(interval);
  }, []);

  // URLs base fijas - solo cambian los números/usuarios
  const buildSocialLinks = () => {
    return {
      telegram: contenido['redes-telegram'] ? `https://t.me/${contenido['redes-telegram']}` : null,
      whatsapp: contenido['redes-whatsapp'] ? `https://wa.me/${contenido['redes-whatsapp']}` : null,
      instagram: contenido['redes-instagram'] ? `https://instagram.com/${contenido['redes-instagram']}` : null,
      tiktok: contenido['redes-tiktok'] ? `https://tiktok.com/@${contenido['redes-tiktok']}` : null,
      linkedin: contenido['redes-linkedin'] ? `https://linkedin.com/in/${contenido['redes-linkedin']}` : null,
      facebook: contenido['redes-facebook'] ? `https://facebook.com/${contenido['redes-facebook']}` : null
    };
  };

  const socialLinks = buildSocialLinks();

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Configuración de cada red social
  const socialConfig = [
    {
      key: 'whatsapp',
      name: 'WhatsApp',
      url: socialLinks.whatsapp,
      color: 'bg-green-500 hover:bg-green-600',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.688"/>
        </svg>
      )
    },
    {
      key: 'instagram',
      name: 'Instagram',
      url: socialLinks.instagram,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      url: socialLinks.tiktok,
      color: 'bg-black hover:bg-gray-800',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
        </svg>
      )
    },
    {
      key: 'telegram',
      name: 'Telegram',
      url: socialLinks.telegram,
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.56c-.12.56-.44.7-.9.44l-2.48-1.84-1.2 1.16c-.13.13-.24.24-.5.24l.18-2.52 4.64-4.18c.2-.18-.04-.28-.32-.1l-5.74 3.6-2.48-.78c-.54-.17-.55-.54.11-.8l9.7-3.74c.45-.17.84.11.7.8z"/>
        </svg>
      )
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      url: socialLinks.linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      key: 'facebook',
      name: 'Facebook',
      url: socialLinks.facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  // Filtrar solo las redes que tienen URL configurada
  const availableSocials = socialConfig.filter(social => social.url);

  // Si no hay redes configuradas, no mostrar nada
  if (availableSocials.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center space-x-4">
      {availableSocials.map((social) => (
        <div key={social.key} className="relative group">
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${social.color} p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg text-white flex items-center justify-center`}
            aria-label={social.name}
          >
            {social.icon}
          </a>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {social.name}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      ))}
    </div>
  );
}