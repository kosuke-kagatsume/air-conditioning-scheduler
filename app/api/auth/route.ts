import { NextRequest, NextResponse } from 'next/server'

// Mock database
const mockUsers = [
  { id: '1', email: 'demo@example.com', name: '山田太郎', role: 'admin' },
  { id: '2', email: 'worker@example.com', name: '佐藤職人', role: 'worker' }
]

const otpStore = new Map<string, { otp: string; expires: number }>()

export async function POST(request: NextRequest) {
  const { action, email, otp } = await request.json()

  if (action === 'request-otp') {
    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP with 10-minute expiration
    otpStore.set(email, {
      otp: generatedOtp,
      expires: Date.now() + 10 * 60 * 1000
    })

    // In real app, send email here
    console.log(`OTP for ${email}: ${generatedOtp}`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to email'
    })
  }

  if (action === 'verify-otp') {
    const storedOtp = otpStore.get(email)
    
    // For demo, accept "123456" as valid OTP
    if (otp === '123456' || (storedOtp && storedOtp.otp === otp && storedOtp.expires > Date.now())) {
      const user = mockUsers.find(u => u.email === email)
      
      if (user) {
        // Clear OTP after successful verification
        otpStore.delete(email)
        
        // In real app, generate JWT here
        const token = Buffer.from(JSON.stringify(user)).toString('base64')
        
        return NextResponse.json({
          success: true,
          user,
          token
        })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid OTP or user not found'
    }, { status: 401 })
  }

  return NextResponse.json({
    success: false,
    message: 'Invalid action'
  }, { status: 400 })
}