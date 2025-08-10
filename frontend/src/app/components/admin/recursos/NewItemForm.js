'use client';

import { useState } from 'react';
import { Save, X, Upload, FileText, Image, Globe, Link } from 'lucide-react';
import { crearItemRecurso } from '../../../lib/supabase';
import FileUpload from './FileUpload';

const itemTypes = [
  { value: 'url', label: 'Sitio Web', icon: Globe, description: 'Enlace a un sitio web' },
  { value: 'pdf', label: 'Documento PDF', icon: FileText, description: 'Subir archivo PDF' },
  { value: 'image', label: 'Imagen', icon: Image, description: 'Subir imagen o infografía' }
];

export default function NewItemForm({ recursoId, onClose, onSuccess }) {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    link: '',
    type: 'url',
    orden: 0
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file, downloadUrl) => {
    setNewItem({
      ...newItem,
      link: downloadUrl
    });
  };

  const handleCreateItem = async () => {
    try {
      if (!newItem.name) {
        alert('Por favor completa el nombre del item');
        return;
      }

      if (newItem.type === 'url' && !newItem.link) {
        alert('Por favor especifica la URL para el sitio web');
        return;
      }

      if ((newItem.type === 'pdf' || newItem.type === 'image') && !newItem.link) {
        alert('Por favor sube el archivo antes de crear el item');
        return;
      }

      console.log('➕ Creando nuevo item para recurso:', recursoId, newItem);

      await crearItemRecurso({
        ...newItem,
        recurso_id: recursoId
      });

      await onSuccess();
      
      // Limpiar formulario
      setNewItem({
        name: '',
        description: '',
        link: '',
        type: 'url',
        orden: 0
      });
      onClose();
      alert('Item creado exitosamente');
    } catch (error) {
      console.error('❌ Error creando item:', error);
      alert('Error al crear el item: ' + error.message);
    }
  };

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-3">Nuevo Item</h4>
      
      {/* Selector de tipo de contenido */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de contenido</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {itemTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setNewItem({...newItem, type: type.value, link: ''})}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  newItem.type === type.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium text-sm">{type.label}</span>
                </div>
                <p className="text-xs text-gray-600">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          placeholder="Nombre del item"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        
        {newItem.type === 'url' ? (
          <div className="relative">
            <input
              type="url"
              placeholder="https://ejemplo.com"
              value={newItem.link}
              onChange={(e) => setNewItem({...newItem, link: e.target.value})}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="absolute right-2 top-2.5 text-blue-600">
              <Link className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <FileUpload
            type={newItem.type}
            onUpload={handleFileUpload}
            uploading={uploading}
            setUploading={setUploading}
            currentFile={newItem.link}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <input
          type="text"
          placeholder="Descripción"
          value={newItem.description}
          onChange={(e) => setNewItem({...newItem, description: e.target.value})}
          className="md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="number"
          placeholder="Orden"
          value={newItem.orden}
          onChange={(e) => setNewItem({...newItem, orden: parseInt(e.target.value)})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleCreateItem}
          disabled={uploading}
          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-3 h-3" />
          <span>{uploading ? 'Subiendo...' : 'Crear'}</span>
        </button>
        <button
          onClick={onClose}
          disabled={uploading}
          className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-3 h-3" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
}