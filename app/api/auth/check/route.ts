import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth')
  
  if (authCookie && authCookie.value === 'authenticated') {
    return NextResponse.json({ authenticated: true }, { status: 200 })
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 })
}
