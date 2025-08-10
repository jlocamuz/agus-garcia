'use client';

import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { crearRecurso } from '../../../lib/supabase';

const colorOptions = [
  'bg-oliva/20 text-oliva border-l-4 border-oliva',
  'bg-rosa/20 text-rosa border-l-4 border-rosa',
  'bg-blue-100 text-blue-800 border-l-4 border-blue-500',
  'bg-green-100 text-green-800 border-l-4 border-green-500',
  'bg-purple-100 text-purple-800 border-l-4 border-purple-500',
  'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
];

export default function NewRecursoForm({ onClose, onSuccess }) {
  const [newRecurso, setNewRecurso] = useState({
    id: '',
    title: '',
    description: '',
    icon: '',
    color: 'bg-oliva/20 text-oliva border-l-4 border-oliva',
    orden: 0
  });

  const handleCreateRecurso = async () => {
    try {
      if (!newRecurso.id || !newRecurso.title) {
        alert('Por favor completa los campos requeridos (ID y Título)');
        return;
      }

      console.log('➕ Creando nuevo recurso:', newRecurso);
      await crearRecurso(newRecurso);

      // Recargar recursos
      await onSuccess();
      
      // Cerrar formulario
      onClose();
      alert('Recurso creado exitosamente');
    } catch (error) {
      console.error('❌ Error creando recurso:', error);
      alert('Error al crear el recurso: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200 text-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Recurso</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
          <input
            type="text"
            value={newRecurso.id}
            onChange={(e) => setNewRecurso({...newRecurso, id: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="podcasts"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            value={newRecurso.title}
            onChange={(e) => setNewRecurso({...newRecurso, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Recomendaciones de podcasts"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
          <input
            type="text"
            value={newRecurso.icon}
            onChange={(e) => setNewRecurso({...newRecurso, icon: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="🧠"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
          <input
            type="number"
            value={newRecurso.orden}
            onChange={(e) => setNewRecurso({...newRecurso, orden: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={newRecurso.description}
          onChange={(e) => setNewRecurso({...newRecurso, description: e.target.value})}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Explora podcasts sobre psicología y bienestar"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Color del tema</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {colorOptions.map((color, index) => (
            <button
              key={index}
              onClick={() => setNewRecurso({...newRecurso, color})}
              className={`p-3 rounded-lg border-2 text-sm ${
                newRecurso.color === color ? 'ring-2 ring-indigo-500' : ''
              } ${color}`}
            >
              Ejemplo
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={handleCreateRecurso}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Crear Recurso</span>
        </button>
        <button
          onClick={onClose}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
}