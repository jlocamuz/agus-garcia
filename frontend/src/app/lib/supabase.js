// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Variables de entorno con fallback para desarrollo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hlmqzopjsmsjevxswfeo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsbXF6b3Bqc21zamV2eHN3ZmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODA0MDYsImV4cCI6MjA2OTY1NjQwNn0.wShtPkxq-bifMEowJJAI4IQdqwBmDaJX5Khfoju0f7o"
const databaseUrl = process.env.DATABASE_URL;
const secretApiKey = process.env.SECRET_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Puedes usar estas variables donde las necesites, por ejemplo:
// console.log('DB URL:', databaseUrl);
// console.log('API KEY:', secretApiKey);

// ===== FUNCIONES DE STORAGE =====

/**
 * Sube un archivo al storage de Supabase
 * @param {File} file - El archivo a subir
 * @param {string} type - Tipo de archivo ('pdf' o 'image')
 * @returns {Promise<string>} - URL pública del archivo subido
 */
export async function uploadFile(file, type) {
  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    console.log('📤 Subiendo archivo:', filePath);

    // Subir archivo al storage
    const { data, error } = await supabase.storage
      .from('recursos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Error subiendo archivo:', error);
      throw error;
    }

    console.log('✅ Archivo subido:', data);

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('recursos')
      .getPublicUrl(filePath);

    console.log('🔗 URL pública:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('❌ Error en uploadFile:', error);
    throw new Error(`Error al subir el archivo: ${error.message}`);
  }
}

/**
 * Elimina un archivo del storage
 * @param {string} url - URL del archivo a eliminar
 */
export async function deleteFile(url) {
  try {
    if (!url) return;

    // Extraer el path del archivo de la URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // folder/filename

    console.log('🗑️ Eliminando archivo:', filePath);

    const { error } = await supabase.storage
      .from('recursos')
      .remove([filePath]);

    if (error) {
      console.error('❌ Error eliminando archivo:', error);
      throw error;
    }

    console.log('✅ Archivo eliminado');
  } catch (error) {
    console.error('❌ Error en deleteFile:', error);
    // No lanzar error para evitar que falle la eliminación del item
  }
}

// ===== FUNCIONES DE SERVICIOS =====

// Obtener todos los servicios con sus formularios
export async function getServicios() {
  try {
    console.log('🔍 Obteniendo servicios...');
    
    const { data, error } = await supabase
      .from('servicios')
      .select(`
        *,
        formulario:formularios(*)
      `)
      .order('popular', { ascending: false });

    if (error) {
      console.error('❌ Error fetching servicios:', error);
      throw error;
    }

    console.log('✅ Servicios obtenidos:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Error en getServicios:', error);
    return [];
  }
}

// Actualizar un servicio específico
export async function actualizarServicio(id, updateData) {
  try {
    console.log(`🔄 Actualizando servicio ${id}...`);
    console.log('📤 Datos a actualizar:', updateData);

    // Primero verificar que existe
    const { data: existing, error: checkError } = await supabase
      .from('servicios')
      .select('id, title, price, duration')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('❌ Error verificando servicio:', checkError);
      if (checkError.code === 'PGRST116') {
        throw new Error(`Servicio con ID "${id}" no encontrado`);
      }
      throw checkError;
    }

    console.log('✅ Servicio existente:', existing);

    // Realizar la actualización
    const { data, error } = await supabase
      .from('servicios')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('❌ Error actualizando servicio:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No se devolvieron datos después de la actualización');
    }

    console.log('✅ Servicio actualizado exitosamente:', data[0]);
    return data[0];

  } catch (error) {
    console.error(`❌ Error en actualizarServicio para ${id}:`, error);
    throw error;
  }
}

// Crear un nuevo servicio
export async function crearServicio(servicioData) {
  try {
    console.log('➕ Creando nuevo servicio...');
    console.log('📤 Datos del servicio:', servicioData);

    // Verificar que no existe un servicio con el mismo ID
    const { data: existing } = await supabase
      .from('servicios')
      .select('id')
      .eq('id', servicioData.id)
      .single();

    if (existing) {
      throw new Error(`Ya existe un servicio con ID "${servicioData.id}"`);
    }

    const { data, error } = await supabase
      .from('servicios')
      .insert([{
        ...servicioData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('*');

    if (error) {
      console.error('❌ Error creando servicio:', error);
      throw error;
    }

    console.log('✅ Servicio creado exitosamente:', data[0]);
    return data[0];

  } catch (error) {
    console.error('❌ Error en crearServicio:', error);
    throw error;
  }
}

// Eliminar un servicio
export async function eliminarServicio(id) {
  try {
    console.log(`🗑️ Eliminando servicio ${id}...`);

    const { error } = await supabase
      .from('servicios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error eliminando servicio:', error);
      throw error;
    }

    console.log('✅ Servicio eliminado exitosamente');
    return true;

  } catch (error) {
    console.error(`❌ Error en eliminarServicio para ${id}:`, error);
    throw error;
  }
}

// Obtener un servicio específico
export async function getServicioPorId(id) {
  try {
    console.log(`🔍 Obteniendo servicio ${id}...`);

    const { data, error } = await supabase
      .from('servicios')
      .select(`
        *,
        formulario:formularios(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching servicio:', error);
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    console.log('✅ Servicio obtenido:', data);
    return data;

  } catch (error) {
    console.error(`❌ Error en getServicioPorId para ${id}:`, error);
    throw error;
  }
}

// Función de diagnóstico para verificar la estructura de la tabla
export async function diagnosticarTablaServicios() {
  try {
    console.log('🔍 Diagnosticando tabla servicios...');
    
    // Obtener información de la tabla
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error en diagnóstico:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    // Verificar permisos de actualización
    try {
      const testUpdate = await supabase
        .from('servicios')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', 'test-no-existe');
      
      console.log('✅ Permisos de actualización: OK');
    } catch (updateError) {
      console.warn('⚠️ Posible problema con permisos de actualización:', updateError);
    }

    return {
      success: true,
      rowCount: data?.length || 0,
      sampleData: data?.[0] || null,
      structure: data?.[0] ? Object.keys(data[0]) : []
    };

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Obtener un formulario específico
export async function getFormulario(formId) {
  try {
    const { data, error } = await supabase
      .from('formularios')
      .select('*')
      .eq('id', formId)
      .single()

    if (error) {
      console.error('Error fetching formulario:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en getFormulario:', error)
    return null
  }
}

// Obtener todos los formularios
export async function getFormularios() {
  try {
    const { data, error } = await supabase
      .from('formularios')
      .select('*')

    if (error) {
      console.error('Error fetching formularios:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en getFormularios:', error)
    throw error
  }
}

// Enviar respuesta de formulario
export async function enviarRespuestaFormulario(servicioId, formularioId, respuestas) {
  try {
    const { data, error } = await supabase
      .from('respuestas_formularios')
      .insert([
        {
          servicio_id: servicioId,
          formulario_id: formularioId,
          respuestas: respuestas
        }
      ])

    if (error) {
      console.error('Error enviando respuesta:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en enviarRespuestaFormulario:', error)
    throw error
  }
}

// ===== FUNCIONES DE RECURSOS =====

// Obtener todos los recursos con sus items
export async function getRecursos() {
  try {
    const { data, error } = await supabase
      .from('recursos')
      .select(`
        *,
        items:items_recursos(
          id,
          name,
          description,
          link,
          type,
          orden
        )
      `)
      .order('orden', { ascending: true })

    if (error) {
      console.error('Error fetching recursos:', error)
      return []
    }

    // Ordenar los items dentro de cada recurso
    const recursosOrdenados = data?.map(recurso => ({
      ...recurso,
      items: recurso.items?.sort((a, b) => a.orden - b.orden) || []
    }))

    return recursosOrdenados || []
  } catch (error) {
    console.error('Error en getRecursos:', error)
    return []
  }
}

// Crear un nuevo recurso
export async function crearRecurso(recurso) {
  try {
    const { data, error } = await supabase
      .from('recursos')
      .insert([{
        ...recurso,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('Error creando recurso:', error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Error en crearRecurso:', error)
    throw error
  }
}

// Crear un nuevo item de recurso
export async function crearItemRecurso(item) {
  try {
    console.log('➕ Creando nuevo item de recurso...');
    console.log('📤 Datos del item:', item);

    const { data, error } = await supabase
      .from('items_recursos')
      .insert([{
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('*');

    if (error) {
      console.error('❌ Error creando item de recurso:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No se devolvieron datos después de crear el item');
    }

    console.log('✅ Item de recurso creado exitosamente:', data[0]);
    return data[0];

  } catch (error) {
    console.error('❌ Error en crearItemRecurso:', error);
    throw error;
  }
}

// Actualizar un recurso
export async function actualizarRecurso(id, cambios) {
  try {
    console.log(`🔄 Actualizando recurso ${id}...`);
    console.log('📤 Cambios a aplicar:', cambios);

    // Primero verificar que existe
    const { data: existing, error: checkError } = await supabase
      .from('recursos')
      .select('id, title')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('❌ Error verificando recurso:', checkError);
      if (checkError.code === 'PGRST116') {
        throw new Error(`Recurso con ID "${id}" no encontrado`);
      }
      throw checkError;
    }

    console.log('✅ Recurso existente:', existing);

    // Realizar la actualización
    const { data, error } = await supabase
      .from('recursos')
      .update({
        ...cambios,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('❌ Error actualizando recurso:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No se devolvieron datos después de la actualización');
    }

    console.log('✅ Recurso actualizado exitosamente:', data[0]);
    return data[0];

  } catch (error) {
    console.error(`❌ Error en actualizarRecurso para ${id}:`, error);
    throw error;
  }
}

// Actualizar un item de recurso (versión mejorada para manejar archivos)
export async function actualizarItemRecurso(id, cambios) {
  try {
    console.log(`🔄 Actualizando item ${id}...`);
    console.log('📤 Cambios a aplicar:', cambios);

    // Primero obtener el item actual para verificar si cambió el archivo
    const { data: existing, error: checkError } = await supabase
      .from('items_recursos')
      .select('id, name, link, type, recurso_id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('❌ Error verificando item:', checkError);
      if (checkError.code === 'PGRST116') {
        throw new Error(`Item con ID "${id}" no encontrado`);
      }
      throw checkError;
    }

    console.log('✅ Item existente:', existing);

    // Si se cambió el archivo y el anterior era un archivo subido, eliminarlo
    if (existing.link && 
        cambios.link && 
        existing.link !== cambios.link && 
        (existing.type === 'pdf' || existing.type === 'image') &&
        existing.link.includes(supabaseUrl)) {
      console.log('🗑️ Eliminando archivo anterior:', existing.link);
      await deleteFile(existing.link);
    }

    // Realizar la actualización
    const { data, error } = await supabase
      .from('items_recursos')
      .update({
        ...cambios,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('❌ Error actualizando item:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No se devolvieron datos después de la actualización');
    }

    console.log('✅ Item actualizado exitosamente:', data[0]);
    return data[0];

  } catch (error) {
    console.error(`❌ Error en actualizarItemRecurso para ${id}:`, error);
    throw error;
  }
}

// Eliminar un recurso (y todos sus items por CASCADE)
export async function eliminarRecurso(id) {
  try {
    // Primero obtener todos los items del recurso para eliminar sus archivos
    const { data: items, error: itemsError } = await supabase
      .from('items_recursos')
      .select('id, link, type')
      .eq('recurso_id', id);

    if (itemsError) {
      console.error('❌ Error obteniendo items del recurso:', itemsError);
    } else if (items) {
      // Eliminar archivos de storage de cada item
      for (const item of items) {
        if (item.link && 
            (item.type === 'pdf' || item.type === 'image') &&
            item.link.includes(supabaseUrl)) {
          console.log('🗑️ Eliminando archivo del item:', item.link);
          await deleteFile(item.link);
        }
      }
    }

    // Eliminar el recurso (los items se eliminan por CASCADE)
    const { error } = await supabase
      .from('recursos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error eliminando recurso:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error en eliminarRecurso:', error)
    throw error
  }
}

// Eliminar un item de recurso (versión mejorada para manejar archivos)
export async function eliminarItemRecurso(id) {
  try {
    console.log(`🗑️ Eliminando item ${id}...`);

    // Primero obtener el item para eliminar el archivo si existe
    const { data: existing, error: checkError } = await supabase
      .from('items_recursos')
      .select('id, name, link, type')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('❌ Error verificando item a eliminar:', checkError);
      if (checkError.code === 'PGRST116') {
        throw new Error(`Item con ID "${id}" no encontrado`);
      }
      throw checkError;
    }

    console.log('✅ Item encontrado para eliminar:', existing);

    // Si es un archivo subido, eliminarlo del storage
    if (existing.link && 
        (existing.type === 'pdf' || existing.type === 'image') &&
        existing.link.includes(supabaseUrl)) {
      console.log('🗑️ Eliminando archivo del storage:', existing.link);
      await deleteFile(existing.link);
    }

    // Eliminar el registro de la base de datos
    const { error } = await supabase
      .from('items_recursos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error eliminando item de recurso:', error);
      throw error;
    }

    console.log('✅ Item eliminado exitosamente');
    return true;

  } catch (error) {
    console.error(`❌ Error en eliminarItemRecurso para ${id}:`, error);
    throw error;
  }
}

// ===== FUNCIONES DE CONTENIDO =====

// Obtener contenido por sección
export async function getContenidoPorSeccion(seccion) {
  try {
    const { data, error } = await supabase
      .from('contenido')
      .select('*')
      .eq('seccion', seccion)
      .order('orden', { ascending: true })

    if (error) {
      console.error(`Error fetching contenido para ${seccion}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error en getContenidoPorSeccion:', error)
    return []
  }
}

// Obtener todo el contenido
export async function getTodoElContenido() {
  try {
    const { data, error } = await supabase
      .from('contenido')
      .select('*')
      .order('seccion', { ascending: true })
      .order('orden', { ascending: true })

    if (error) {
      console.error('Error fetching todo el contenido:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error en getTodoElContenido:', error)
    return []
  }
}

// Obtener contenido específico por ID
export async function getContenidoPorId(id) {
  try {
    const { data, error } = await supabase
      .from('contenido')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching contenido ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en getContenidoPorId:', error)
    return null
  }
}

// Actualizar contenido
export async function actualizarContenido(id, nuevoContenido) {
  try {
    console.log(`Intentando actualizar contenido ${id} con:`, nuevoContenido)
    
    // Primero verificar que el contenido existe
    const { data: existing, error: checkError } = await supabase
      .from('contenido')
      .select('id, contenido')
      .eq('id', id)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        throw new Error(`No se encontró contenido con ID: ${id}`)
      }
      console.error('Error verificando contenido:', checkError)
      throw new Error(`Error verificando contenido: ${checkError.message}`)
    }

    console.log('Contenido existente encontrado:', existing)

    // Ahora actualizar
    const { data, error } = await supabase
      .from('contenido')
      .update({ 
        contenido: nuevoContenido,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error(`Error actualizando contenido ${id}:`, error)
      throw new Error(`Error actualizando contenido: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No se devolvieron datos después de la actualización')
    }

    console.log('Contenido actualizado exitosamente:', data[0])
    return data[0]

  } catch (error) {
    console.error(`Error en actualizarContenido para ${id}:`, error)
    throw error
  }
}

// Crear nuevo contenido
export async function crearContenido(contenidoData) {
  try {
    console.log('Creando nuevo contenido:', contenidoData)
    
    const { data, error } = await supabase
      .from('contenido')
      .insert([{
        ...contenidoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('Error creando contenido:', error)
      throw new Error(`Error creando contenido: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No se devolvieron datos después de crear el contenido')
    }

    console.log('Contenido creado exitosamente:', data[0])
    return data[0]

  } catch (error) {
    console.error('Error en crearContenido:', error)
    throw error
  }
}

// Eliminar contenido
export async function eliminarContenido(id) {
  try {
    console.log(`Eliminando contenido ${id}`)
    
    const { error } = await supabase
      .from('contenido')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error eliminando contenido ${id}:`, error)
      throw new Error(`Error eliminando contenido: ${error.message}`)
    }

    console.log(`Contenido ${id} eliminado exitosamente`)
    return true

  } catch (error) {
    console.error(`Error en eliminarContenido para ${id}:`, error)
    throw error
  }
}

// ===== FUNCIONES AUXILIARES =====

// Función helper para convertir array de contenido a objeto organizado
export function organizarContenidoPorTipo(contenidoArray) {
  const contenidoOrganizado = {}
  
  contenidoArray.forEach(item => {
    if (!contenidoOrganizado[item.tipo]) {
      contenidoOrganizado[item.tipo] = []
    }
    contenidoOrganizado[item.tipo].push(item)
  })

  return contenidoOrganizado
}

// Verificar la estructura de la tabla contenido
export async function verificarTablaContenido() {
  try {
    const { data, error } = await supabase
      .from('contenido')
      .select('id, seccion, tipo, contenido')
      .limit(1)

    if (error) {
      console.error('Error verificando tabla contenido:', error)
      return false
    }

    console.log('Tabla contenido verificada exitosamente')
    return true
  } catch (error) {
    console.error('Error verificando tabla:', error)
    return false
  }
}

// Crear contenido inicial si no existe
export async function crearContenidoInicial() {
  try {
    console.log('Verificando si existe contenido inicial...')
    
    // Verificar si ya existe contenido
    const { data: existing, error: checkError } = await supabase
      .from('contenido')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('Error verificando contenido existente:', checkError)
      throw checkError
    }

    if (existing && existing.length > 0) {
      console.log('Ya existe contenido inicial, no es necesario crear')
      return
    }

    console.log('No existe contenido, creando contenido inicial...')

    // Crear contenido inicial
    const contenidoInicial = [
      { id: 'hero-nombre', seccion: 'hero', tipo: 'titulo', contenido: 'Agustina García', orden: 1 },
      { id: 'hero-profesion', seccion: 'hero', tipo: 'subtitulo', contenido: 'Psicóloga Clínica', orden: 2 },
      { id: 'hero-descripcion', seccion: 'hero', tipo: 'texto', contenido: 'Te ayudo a lidiar con el estrés, la ansiedad y a construir relaciones saludables contigo mismo y con los demás.', orden: 3 },
      { id: 'hero-boton-principal', seccion: 'hero', tipo: 'boton', contenido: 'Empezar terapia', orden: 4 },
      { id: 'hero-boton-secundario', seccion: 'hero', tipo: 'boton', contenido: 'Conocer más', orden: 5 },
      { id: 'about-titulo', seccion: 'about', tipo: 'titulo', contenido: 'Sobre mí', orden: 1 },
      { id: 'about-parrafo-1', seccion: 'about', tipo: 'parrafo', contenido: 'Soy psicóloga con más de 8 años de experiencia especializada en trastornos de ansiedad, depresión y problemas de pareja.', orden: 2 },
      { id: 'about-parrafo-2', seccion: 'about', tipo: 'parrafo', contenido: 'Mi enfoque combina terapia cognitivo-conductual y métodos humanísticos, creyendo firmemente que cada persona tiene los recursos internos para cambiar.', orden: 3 },
      { id: 'about-parrafo-3', seccion: 'about', tipo: 'parrafo', contenido: 'Graduada de la Universidad Estatal Lomonósov de Moscú, me actualizo constantemente participando en congresos profesionales.', orden: 4 },
      { id: 'about-formacion-titulo', seccion: 'about', tipo: 'subtitulo', contenido: 'Formación', orden: 5 },
      { id: 'about-formacion-1', seccion: 'about', tipo: 'item-lista', contenido: 'Universidad Estatal Lomonósov de Moscú', orden: 6 },
      { id: 'about-formacion-2', seccion: 'about', tipo: 'item-lista', contenido: 'Especialización en Terapia Cognitivo-Conductual', orden: 7 },
      { id: 'about-formacion-3', seccion: 'about', tipo: 'item-lista', contenido: 'Métodos Humanísticos en Psicología', orden: 8 }
    ]

    const { data, error } = await supabase
      .from('contenido')
      .insert(contenidoInicial)
      .select()

    if (error) {
      console.error('Error creando contenido inicial:', error)
      throw error
    }

    console.log('Contenido inicial creado exitosamente:', data.length, 'elementos')
    return data

  } catch (error) {
    console.error('Error en crearContenidoInicial:', error)
    throw error
  }
}