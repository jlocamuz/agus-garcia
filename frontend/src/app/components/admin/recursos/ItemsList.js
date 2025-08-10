'use client';

import { useState } from 'react';
import { Edit3, Save, X, Trash2, ExternalLink, FileText, Image, Globe, Link } from 'lucide-react';
import { actualizarItemRecurso, eliminarItemRecurso } from '../../../lib/supabase';
import FileUpload from './FileUpload';

const getTypeIcon = (type) => {
  const icons = {
    url: Globe,
    pdf: FileText,
    image: Image
  };
  return icons[type] || Globe;
};

const getTypeColor = (type) => {
  const colors = {
    url: 'text-blue-600',
    pdf: 'text-red-600',
    image: 'text-green-600'
  };
  return colors[type] || 'text-gray-600';
};

export default function ItemsList({ items, onUpdate }) {
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleEditItem = (item) => {
    console.log('✏️ Editando item:', item);
    setEditingItem({ ...item });
  };

  const handleFileUpload = async (file, downloadUrl) => {
    setEditingItem({
      ...editingItem,
      link: downloadUrl
    });
  };

  const handleSaveItem = async () => {
    try {
      console.log('💾 Actualizando item:', editingItem);
      
      await actualizarItemRecurso(editingItem.id, {
        name: editingItem.name,
        description: editingItem.description,
        link: editingItem.link,
        type: editingItem.type,
        orden: editingItem.orden
      });

      await onUpdate();
      setEditingItem(null);
      alert('Item actualizado exitosamente');
    } catch (error) {
      console.error('❌ Error actualizando item:', error);
      alert('Error al actualizar el item: ' + error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este item?')) {
      try {
        console.log('🗑️ Eliminando item:', id);
        await eliminarItemRecurso(id);
        await onUpdate();
        alert('Item eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error eliminando item:', error);
        alert('Error al eliminar el item: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700">Items ({items.length})</h4>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => {
            const IconComponent = getTypeIcon(item.type);
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                {editingItem && editingItem.id === item.id ? (
                  <div className="flex-1 space-y-3">
                    {/* Campos básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Nombre"
                      />
                      
                      {editingItem.type === 'url' ? (
                        <div className="relative">
                          <input
                            type="url"
                            value={editingItem.link}
                            onChange={(e) => setEditingItem({...editingItem, link: e.target.value})}
                            className="w-full px-2 py-1 pr-8 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="https://ejemplo.com"
                          />
                          <div className="absolute right-2 top-1.5 text-blue-600">
                            <Link className="w-3 h-3" />
                          </div>
                        </div>
                      ) : (
                        <FileUpload
                          type={editingItem.type}
                          onUpload={handleFileUpload}
                          uploading={uploading}
                          setUploading={setUploading}
                          currentFile={editingItem.link}
                        />
                      )}
                    </div>
                    
                    {/* Descripción y orden */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                        className="md:col-span-3 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Descripción"
                      />
                      <input
                        type="number"
                        value={editingItem.orden}
                        onChange={(e) => setEditingItem({...editingItem, orden: parseInt(e.target.value)})}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Orden"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${getTypeColor(item.type)}`} />
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700"
                          title={`Abrir ${item.type === 'pdf' ? 'PDF' : item.type === 'image' ? 'imagen' : 'enlace'}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className="text-xs text-gray-500">#{item.orden}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.type === 'pdf' ? 'bg-red-100 text-red-700' :
                        item.type === 'image' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.type === 'pdf' ? 'PDF' : item.type === 'image' ? 'IMG' : 'URL'}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  {editingItem && editingItem.id === item.id ? (
                    <>
                      <button
                        onClick={handleSaveItem}
                        disabled={uploading}
                        className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        disabled={uploading}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No hay items en este recurso</p>
      )}
    </div>
  );
}