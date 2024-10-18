import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);

  const { data, error } = await supabase.storage
    .from('files')
    .upload(`${Date.now()}_${file.name}`, fileBuffer);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: dbError } = await supabase.from('files').insert({
    name: file.name,
    path: data.path,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}