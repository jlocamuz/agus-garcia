'use client';

import { useState, useEffect } from 'react';
import { getRecursos } from "@/app/lib/supabase"; 
import { FileText, Image, Globe, ExternalLink } from 'lucide-react';

export default function Recursos() {
  const [openResource, setOpenResource] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el icono según el tipo
  const getTypeIcon = (type) => {
    const icons = {
      url: Globe,
      pdf: FileText,
      image: Image
    };
    const IconComponent = icons[type] || Globe;
    return <IconComponent className="w-4 h-4" />;
  };

  // Función para obtener el color del tipo
  const getTypeColor = (type) => {
    const colors = {
      url: 'text-blue-600',
      pdf: 'text-red-600',
      image: 'text-green-600'
    };
    return colors[type] || 'text-gray-600';
  };

  // Función para determinar si un enlace debe abrirse en nueva pestaña
  const shouldOpenInNewTab = (type, link) => {
    if (type === 'pdf' || type === 'image') return true;
    if (type === 'url' && link && typeof window !== 'undefined' && !link.includes(window.location.hostname)) return true;
    return false;
  };

  // Cargar recursos desde Supabase directamente (como en Servicios)
  useEffect(() => {
    async function loadRecursos() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Cargando recursos directamente desde Supabase...');
        
        const data = await getRecursos();
        
        console.log('✅ Recursos cargados:', data?.length || 0);
        console.log('📦 Datos:', data);
        
        setRecursos(data || []);
        
      } catch (error) {
        console.error('❌ Error cargando recursos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadRecursos();
  }, []);

  const toggleResource = (index) => {
    setOpenResource(openResource === index ? null : index);
  };

  if (loading) {
    return (
      <section id="recursos" className="py-16 bg-olivaclaro/50">
        <div className="px-4">
          <div className="max-w-sm mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oliva mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando recursos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="recursos" className="py-16 bg-olivaclaro/50">
        <div className="px-4">
          <div className="max-w-sm mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium">Error cargando recursos</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="recursos" className="py-16 bg-olivaclaro/50">
      <div className="px-4">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos gratuitos
            </h2>
            <p className="text-gray-600">
              Haz clic en cada recurso para ver las opciones disponibles
            </p>
          </div>

          {recursos.length === 0 && !loading ? (
            <div className="text-center py-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 mb-2">No hay recursos disponibles en este momento.</p>
                <p className="text-gray-500 text-sm">Los recursos se mostrarán aquí una vez que sean añadidos.</p>
              </div>
            </div> 
          ) : (
            <div className="space-y-4">
              {recursos.map((recurso, index) => (
                <div key={recurso.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Header del recurso - Botón clickeable */}
                  <button
                    onClick={() => toggleResource(index)}
                    className={`w-full p-6 ${recurso.color} hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-oliva focus:ring-opacity-50`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-xl text-2xl bg-white shadow-sm">
                        {recurso.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {recurso.title}
                          </h3>
                          <svg 
                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                              openResource === index ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {recurso.description}
                        </p>
                        <div className="mt-2">
                          <span className="text-xs bg-white/50 px-2 py-1 rounded-full">
                            {recurso.items?.length || 0} elementos
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Lista desplegable */}
                  <div className={`transition-all duration-300 ease-in-out ${
                    openResource === index 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  } overflow-hidden`}>
                    <div className="p-4 bg-gray-50 border-t">
                      {recurso.items && recurso.items.length > 0 ? (
                        <div className="space-y-3">
                          {recurso.items.map((item) => {
                            const isNewTab = shouldOpenInNewTab(item.type, item.link);
                            
                            return (
                              <a
                                key={item.id}
                                href={item.link}
                                target={isNewTab ? "_blank" : "_self"}
                                rel={isNewTab ? "noopener noreferrer" : undefined}
                                className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-oliva hover:shadow-md transition-all duration-200 group"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3 flex-1">
                                    {/* Icono del tipo */}
                                    <div className={`mt-0.5 ${getTypeColor(item.type)}`}>
                                      {getTypeIcon(item.type)}
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 flex-wrap">
                                        <h4 className="font-medium text-gray-900 group-hover:text-oliva transition-colors">
                                          {item.name}
                                        </h4>
                                        
                                        {/* Badge del tipo */}
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          item.type === 'pdf' ? 'bg-red-100 text-red-700' :
                                          item.type === 'image' ? 'bg-green-100 text-green-700' :
                                          'bg-blue-100 text-blue-700'
                                        }`}>
                                          {item.type === 'pdf' ? 'PDF' : 
                                           item.type === 'image' ? 'IMG' : 'WEB'}
                                        </span>
                                      </div>
                                      
                                      {item.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Icono de enlace externo */}
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-oliva transition-colors mt-1 ml-2 flex-shrink-0" />
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>No hay items disponibles para este recurso</p>
                          <p className="text-xs mt-1">Los items aparecerán aquí una vez que sean añadidos</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nota informativa */}
          {recursos.length > 0 && (
            <div className="mt-8 p-4 bg-white/70 rounded-xl text-center">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Todos estos recursos son completamente gratuitos. 
                Haz clic en cualquier elemento para acceder directamente.
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}