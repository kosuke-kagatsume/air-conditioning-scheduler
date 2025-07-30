'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setStep('otp')
      setLoading(false)
    }, 1500)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      router.push('/demo')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 gradient-bg opacity-5"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">⚡</span>
            </div>
            <h1 className="text-2xl font-bold">HVAC Scheduler</h1>
          </Link>
          
          <h2 className="text-3xl font-bold mb-2">
            {step === 'email' ? 'ログイン' : 'ワンタイムパスワード'}
          </h2>
          <p className="text-gray-400">
            {step === 'email' 
              ? 'メールアドレスを入力してください' 
              : `${email} に送信された6桁のコードを入力`}
          </p>
        </div>

        <div className="glass p-8">
          {step === 'email' ? (
            <form onSubmit={handleRequestOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="loader w-5 h-5"></span>
                ) : (
                  <>
                    <span>ワンタイムパスワードを送信</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  6桁のコード
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-center text-2xl tracking-wider"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="loader w-5 h-5"></span>
                ) : (
                  <>
                    <span>ログイン</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                }}
                className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
              >
                メールアドレスを変更
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400">
              アカウントをお持ちでない方は
              <Link href="/register" className="text-purple-400 hover:text-purple-300 ml-1">
                新規登録
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>デモ用アカウント</p>
          <p className="font-mono mt-1">demo@example.com / 123456</p>
        </div>
      </div>
    </div>
  )
}