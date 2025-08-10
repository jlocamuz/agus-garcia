import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.DATABASE_URL?.replace(/\/$/, '');
  const supabaseAnonKey = process.env.SECRET_API_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Supabase env vars not set' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  // Solo selecciona los campos existentes
  const { data, error } = await supabase
    .from('respuestas_formularios')
    .select('id, servicio_id, formulario_id, respuestas, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Parsear los datos relevantes del campo respuestas (JSONB)
  const actividad = data.map(row => {
    let nombre = null, email = null, telefono = null, mensaje = null;
    if (row.respuestas) {
      // Intenta extraer los campos más comunes
      nombre = row.respuestas.nombre || row.respuestas.Nombre || null;
      email = row.respuestas.email || row.respuestas.Email || null;
      telefono = row.respuestas.telefono || row.respuestas.Telefono || null;
      mensaje = row.respuestas.mensaje || row.respuestas.Mensaje || null;
    }
    return {
      id: row.id,
      servicio_id: row.servicio_id,
      formulario_id: row.formulario_id,
      created_at: row.created_at,
      nombre,
      email,
      telefono,
      mensaje
    };
  });

  return NextResponse.json({ actividad });
}
