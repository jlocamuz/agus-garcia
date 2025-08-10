'use client';

import { useState, useEffect } from 'react';
import { Plus, Folder } from 'lucide-react';
import { getRecursos } from '../../lib/supabase';
import NewRecursoForm from '@/app/components/admin/recursos/NewRecursoForm';
import RecursoCard from '@/app/components/admin/recursos/RecursoCard';

export default function AdminRecursos() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewRecursoForm, setShowNewRecursoForm] = useState(false);

  useEffect(() => {
    loadRecursos();
  }, []);

  const loadRecursos = async () => {
    try {
      console.log('🔄 Cargando recursos...');
      setLoading(true);
      const data = await getRecursos();
      console.log('✅ Recursos cargados:', data);
      setRecursos(data);
    } catch (error) {
      console.error('❌ Error cargando recursos:', error);
      alert('Error al cargar los recursos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Recursos</h1>
          <p className="text-gray-600">Administra los recursos gratuitos de tu sitio web (URLs, PDFs, imágenes)</p>
        </div>
        <button
          onClick={() => setShowNewRecursoForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Recurso</span>
        </button>
      </div>

      {/* Formulario para nuevo recurso */}
      {showNewRecursoForm && (
        <NewRecursoForm 
          onClose={() => setShowNewRecursoForm(false)}
          onSuccess={loadRecursos}
        />
      )}

      {/* Lista de recursos */}
      <div className="space-y-6">
        {recursos.map((recurso) => (
          <RecursoCard 
            key={recurso.id} 
            recurso={recurso} 
            onUpdate={loadRecursos}
          />
        ))}
      </div>

      {recursos.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recursos</h3>
          <p className="text-gray-600">Crea tu primer recurso para comenzar.</p>
        </div>
      )}
    </div>
  );
}