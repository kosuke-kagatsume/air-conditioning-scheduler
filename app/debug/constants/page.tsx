'use client'

// Testing minimal constants import
import { COLORS } from '@/constants/settings'

export default function DebugConstantsPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Route - With Constants Import</h1>
      <p>This route tests importing constants</p>
      <div>
        <h2>Colors:</h2>
        <pre>{JSON.stringify(COLORS, null, 2)}</pre>
      </div>
    </div>
  )
}