'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Download, Eye, Trash2, Calendar, User, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminRespuestas() {
  const [respuestas, setRespuestas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRespuesta, setSelectedRespuesta] = useState(null);
  const [filters, setFilters] = useState({
    servicio: 'all',
    fecha: 'all',
    busqueda: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar respuestas con información del servicio
      const { data: respuestasData, error: respuestasError } = await supabase
        .from('respuestas_formularios')
        .select(`
          *,
          servicio:servicios(id, title, icon),
          formulario:formularios(nombre)
        `)
        .order('created_at', { ascending: false });

      if (respuestasError) throw respuestasError;

      // Cargar servicios para filtros
      const { data: serviciosData, error: serviciosError } = await supabase
        .from('servicios')
        .select('id, title');

      if (serviciosError) throw serviciosError;

      setRespuestas(respuestasData || []);
      setServicios(serviciosData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta respuesta?')) {
      try {
        const { error } = await supabase
          .from('respuestas_formularios')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await loadData();
        alert('Respuesta eliminada exitosamente');
      } catch (error) {
        console.error('Error eliminando respuesta:', error);
        alert('Error al eliminar la respuesta');
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Fecha', 'Servicio', 'Formulario', 'Respuestas'],
      ...filteredRespuestas.map(respuesta => [
        new Date(respuesta.created_at).toLocaleDateString(),
        respuesta.servicio?.title || 'N/A',
        respuesta.formulario?.nombre || 'N/A',
        JSON.stringify(respuesta.respuestas)
      ])
    ];

    const csvString = csvContent.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respuestas_formularios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filtrar respuestas
  const filteredRespuestas = respuestas.filter(respuesta => {
    const matchServicio = filters.servicio === 'all' || respuesta.servicio_id === filters.servicio;
    
    const matchFecha = (() => {
      if (filters.fecha === 'all') return true;
      const respuestaDate = new Date(respuesta.created_at);
      const now = new Date();
      
      switch (filters.fecha) {
        case 'today':
          return respuestaDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return respuestaDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return respuestaDate >= monthAgo;
        default:
          return true;
      }
    })();

    const matchBusqueda = filters.busqueda === '' || 
      JSON.stringify(respuesta.respuestas).toLowerCase().includes(filters.busqueda.toLowerCase()) ||
      respuesta.servicio?.title.toLowerCase().includes(filters.busqueda.toLowerCase());

    return matchServicio && matchFecha && matchBusqueda;
  });

  const formatRespuestas = (respuestas) => {
    return Object.entries(respuestas).map(([key, value]) => ({
      campo: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
      valor: value
    }));
  };

  const getFieldLabel = (key) => {
    const labels = {
      nombre: 'Nombre',
      apellido: 'Apellido',
      email: 'Email',
      celular: 'Celular',
      telefono: 'Teléfono',
      preferenciaHoraria: 'Preferencia Horaria',
      preferencia_horaria: 'Preferencia Horaria',
      objetivoTerapia: 'Objetivo de Terapia',
      objetivo_terapia: '¿Qué te gustaría trabajar?',
      mensaje: 'Mensaje',
      servicioId: 'ID del Servicio'
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Respuestas de Formularios</h1>
          <p className="text-gray-600">
            Total: {filteredRespuestas.length} respuestas
            {filters.servicio !== 'all' || filters.fecha !== 'all' || filters.busqueda ? 
              ` (filtradas de ${respuestas.length})` : ''
            }
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en respuestas..."
                value={filters.busqueda}
                onChange={(e) => setFilters({...filters, busqueda: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
            <select
              value={filters.servicio}
              onChange={(e) => setFilters({...filters, servicio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Todos los servicios</option>
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>{servicio.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <select
              value={filters.fecha}
              onChange={(e) => setFilters({...filters, fecha: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ servicio: 'all', fecha: 'all', busqueda: '' })}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de respuestas */}
      <div className="space-y-4">
        {filteredRespuestas.map((respuesta) => (
          <div key={respuesta.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xl">{respuesta.servicio?.icon || '📋'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {respuesta.servicio?.title || 'Servicio desconocido'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(respuesta.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{respuesta.formulario?.nombre || 'Formulario'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vista resumida de respuestas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(respuesta.respuestas).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {getFieldLabel(key)}
                      </div>
                      <div className="text-sm text-gray-900 mt-1 truncate">
                        {typeof value === 'string' && value.length > 50 
                          ? `${value.substring(0, 50)}...` 
                          : value || 'N/A'
                        }
                      </div>
                    </div>
                  ))}
                  {Object.keys(respuesta.respuestas).length > 3 && (
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">
                        +{Object.keys(respuesta.respuestas).length - 3} más
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setSelectedRespuesta(respuesta)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(respuesta.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRespuestas.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {respuestas.length === 0 ? 'No hay respuestas' : 'No hay respuestas que coincidan'}
          </h3>
          <p className="text-gray-600">
            {respuestas.length === 0 
              ? 'Aún no se han recibido respuestas de formularios.'
              : 'Intenta ajustar los filtros para ver más resultados.'
            }
          </p>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedRespuesta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedRespuesta.servicio?.icon || '📋'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Respuesta de {selectedRespuesta.servicio?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedRespuesta.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRespuesta(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Información del formulario</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Formulario:</span>
                      <span className="ml-2 text-blue-800">{selectedRespuesta.formulario?.nombre}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">ID:</span>
                      <span className="ml-2 text-blue-800 font-mono text-xs">{selectedRespuesta.id}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Respuestas del usuario</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedRespuesta.respuestas).map(([key, value]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {getFieldLabel(key)}
                        </div>
                        <div className="text-gray-900">
                          {typeof value === 'string' && value.length > 200 ? (
                            <div>
                              <p className="whitespace-pre-wrap">{value}</p>
                            </div>
                          ) : (
                            <span>{value || 'No proporcionado'}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleDelete(selectedRespuesta.id)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
                <button
                  onClick={() => setSelectedRespuesta(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}