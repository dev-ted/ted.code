import { NextRequest, NextResponse } from 'next/server'

// Mock credentials - in production, these should be in environment variables
const MOCK_USERNAME = 'admin'
const MOCK_PASSWORD = '@dmin123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      )

      // Set authentication cookie
      response.cookies.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    )
  }
}
