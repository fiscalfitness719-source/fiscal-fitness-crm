'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', background: '#0f172a', color: 'white', border: 'none' }}
    >
      🖨 Print / Save as PDF
    </button>
  )
}
