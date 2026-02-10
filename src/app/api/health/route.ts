import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { queryClient } from '@/lib/db'

export async function GET() {
  const status: {
    ok: boolean
    ts: string
    redis?: { ok: boolean; result?: string; error?: string }
    postgres?: { ok: boolean; result?: any; error?: string }
  } = {
    ok: true,
    ts: new Date().toISOString(),
  }

  try {
    const result = await redis.ping()
    status.redis = { ok: true, result }
  } catch (e: any) {
    status.ok = false
    status.redis = { ok: false, error: e?.message || String(e) }
  }

  try {
    const result = await queryClient`select 1 as ok`
    status.postgres = { ok: true, result: result?.[0] ?? null }
  } catch (e: any) {
    status.ok = false
    status.postgres = { ok: false, error: e?.message || String(e) }
  }

  return NextResponse.json(status, { status: status.ok ? 200 : 503 })
}

