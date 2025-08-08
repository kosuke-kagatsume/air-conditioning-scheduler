'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

export default function InventoryPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e1e4e8',
        padding: '12px 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/demo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'white'
              }}>
                📅
              </div>
              <h1 style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#2c3e50'
              }}>HVAC Scheduler</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div>
        {/* サイドバー */}
        <Sidebar />

        {/* Main Content */}
        <main style={{ marginLeft: '240px', padding: '20px', minHeight: 'calc(100vh - 60px)', marginTop: '60px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2c3e50'
            }}>
              在庫管理
            </h2>
            <button className="btn-primary">
              + 在庫追加
            </button>
          </div>

          {/* 在庫管理のプレースホルダーコンテンツ */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              📦
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '12px'
            }}>
              在庫管理機能
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6c7684',
              maxWidth: '400px'
            }}>
              資材や部品の在庫状況を管理し、発注タイミングを最適化します。
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}