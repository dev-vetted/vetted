import { NextResponse, NextRequest } from 'next/server'

const allowedOrigins = new Set<string>([
  'https://vetted-vendor-web.vercel.app',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
])

const allowedHeaders = [
  'Content-Type',
  'Authorization',
  'x-tenant-id',
  'x-user-id',
]

const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  const isAllowedOrigin = allowedOrigins.has(origin)

  // Preflight request
  if (req.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 })
    if (isAllowedOrigin) {
      res.headers.set('Access-Control-Allow-Origin', origin)
      res.headers.set('Vary', 'Origin')
    }
    res.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '))
    res.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '))
    res.headers.set('Access-Control-Max-Age', '86400')
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    return res
  }

  const res = NextResponse.next()
  if (isAllowedOrigin) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Vary', 'Origin')
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  return res
}

export const config = {
  matcher: ['/api/:path*'],
}


