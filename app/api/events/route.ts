import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  
  const startDate = searchParams.get('start')
  const endDate = searchParams.get('end')
  const workerId = searchParams.get('worker_id')
  
  let query = supabase.from('events').select('*')
  
  if (startDate && endDate) {
    query = query
      .gte('date', startDate)
      .lte('date', endDate)
  }
  
  if (workerId) {
    query = query.eq('worker_id', workerId)
  }
  
  const { data, error } = await query.order('date', { ascending: true })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const eventData = {
    ...body,
    created_by: user.id,
    worker_name: body.worker_name || user.user_metadata?.name || user.email
  }
  
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updateData } = body
  
  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
  }
  
  const { data, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
  }
  
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ success: true })
}