'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Image, CheckCircle, X } from 'lucide-react';

export default function FileUpload({ type, onUpload, uploading, setUploading, currentFile }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const acceptedTypes = {
    pdf: '.pdf',
    image: '.jpg,.jpeg,.png,.gif,.webp,.svg'
  };

  const maxFileSizes = {
    pdf: 10 * 1024 * 1024, // 10MB
    image: 5 * 1024 * 1024  // 5MB
  };

  const validateFile = (file) => {
    // Validar tipo de archivo
    if (type === 'pdf' && file.type !== 'application/pdf') {
      throw new Error('Por favor selecciona un archivo PDF válido');
    }
    
    if (type === 'image' && !file.type.startsWith('image/')) {
      throw new Error('Por favor selecciona una imagen válida');
    }

    // Validar tamaño
    if (file.size > maxFileSizes[type]) {
      const maxSizeMB = maxFileSizes[type] / (1024 * 1024);
      throw new Error(`El archivo es demasiado grande. Máximo permitido: ${maxSizeMB}MB`);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      
      // Validar archivo
      validateFile(file);

      // Importar la función de upload (ajusta la ruta según tu estructura)
      const { uploadFile } = await import('../../../lib/supabase');
      
      // Subir archivo usando Supabase Storage
      const downloadUrl = await uploadFile(file, type);
      
      onUpload(file, downloadUrl);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    onUpload(null, '');
  };

  const getFileIcon = () => {
    return type === 'pdf' ? FileText : Image;
  };

  const getFileTypeLabel = () => {
    return type === 'pdf' ? 'PDF' : 'Imagen';
  };

  const FileIcon = getFileIcon();

  if (currentFile) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 border border-green-300 bg-green-50 rounded-lg">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <FileIcon className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700 flex-1 truncate">
          Archivo subido correctamente
        </span>
        <button
          onClick={removeFile}
          className="p-1 text-green-600 hover:text-red-600 transition-colors"
          title="Eliminar archivo"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes[type]}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
          ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="text-sm text-gray-600">Subiendo...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Upload className="w-4 h-4 text-gray-400" />
            <FileIcon className="w-4 h-4 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium">Subir {getFileTypeLabel()}</span>
              <p className="text-xs text-gray-500 mt-1">
                {type === 'pdf' ? 'Máximo 10MB' : 'Máximo 5MB'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}