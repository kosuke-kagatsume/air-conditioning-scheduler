'use client'

export default function DebugPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Route - No Constants</h1>
      <p>This route works without importing any constants</p>
      <p>Current timestamp: {new Date().toISOString()}</p>
    </div>
  )
}