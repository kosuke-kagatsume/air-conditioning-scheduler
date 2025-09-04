'use client'

import React from 'react'

export default function MobileCalendarDebug() {
  return (
    <div style={{ padding: '20px', background: 'white' }}>
      <h1 style={{ color: '#000', fontSize: '24px' }}>デバッグテスト</h1>
      <p style={{ color: '#666' }}>この文字が見えていれば基本的な表示は動作しています</p>
      
      <div style={{ marginTop: '20px' }}>
        <table border={1} style={{ width: '100%' }}>
          <tr>
            <td>日</td>
            <td>月</td>
            <td>火</td>
            <td>水</td>
            <td>木</td>
            <td>金</td>
            <td>土</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
          </tr>
        </table>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <p>ユーザーエージェント:</p>
        <p style={{ fontSize: '12px' }}>{typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#ffe0e0' }}>
        <p>画面サイズ:</p>
        <p>幅: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</p>
        <p>高さ: {typeof window !== 'undefined' ? window.innerHeight : 'N/A'}px</p>
      </div>
    </div>
  )
}