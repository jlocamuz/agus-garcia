'use client';

import { useState } from 'react';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { actualizarRecurso, eliminarRecurso } from '../../../lib/supabase';
import NewItemForm from './NewItemForm';
import ItemsList from './ItemsList';

export default function RecursoCard({ recurso, onUpdate }) {
  const [editingRecurso, setEditingRecurso] = useState(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  const handleEditRecurso = (recurso) => {
    setEditingRecurso({ ...recurso });
  };

  const handleSaveRecurso = async () => {
    try {
      console.log('💾 Actualizando recurso:', editingRecurso);
      
      await actualizarRecurso(editingRecurso.id, {
        title: editingRecurso.title,
        description: editingRecurso.description,
        icon: editingRecurso.icon,
        color: editingRecurso.color,
        orden: editingRecurso.orden
      });

      await onUpdate();
      setEditingRecurso(null);
      alert('Recurso actualizado exitosamente');
    } catch (error) {
      console.error('❌ Error actualizando recurso:', error);
      alert('Error al actualizar el recurso: ' + error.message);
    }
  };

  const handleDeleteRecurso = async (id) => {
    if (confirm('¿Estás seguro? Esto eliminará el recurso y todos sus items.')) {
      try {
        console.log('🗑️ Eliminando recurso:', id);
        await eliminarRecurso(id);
        await onUpdate();
        alert('Recurso eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error eliminando recurso:', error);
        alert('Error al eliminar el recurso: ' + error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header del recurso */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{recurso.icon}</span>
          <div>
            {editingRecurso && editingRecurso.id === recurso.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingRecurso.title}
                  onChange={(e) => setEditingRecurso({...editingRecurso, title: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={editingRecurso.description}
                  onChange={(e) => setEditingRecurso({...editingRecurso, description: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Descripción"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveRecurso}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={() => setEditingRecurso(null)}
                    className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900">{recurso.title}</h3>
                <p className="text-sm text-gray-600">{recurso.description}</p>
                <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${recurso.color}`}>
                  Orden: {recurso.orden}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewItemForm(!showNewItemForm)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Agregar item"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditRecurso(recurso)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Editar recurso"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteRecurso(recurso.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar recurso"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formulario para nuevo item */}
      {showNewItemForm && (
        <NewItemForm 
          recursoId={recurso.id}
          onClose={() => setShowNewItemForm(false)}
          onSuccess={onUpdate}
        />
      )}

      {/* Lista de items */}
      <ItemsList 
        items={recurso.items || []}
        onUpdate={onUpdate}
      />
    </div>
  );
}