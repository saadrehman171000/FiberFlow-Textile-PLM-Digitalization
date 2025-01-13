export function Placeholder({ width, height, text }: { width: number, height: number, text?: string }) {
  return (
    <div 
      style={{
        width: width,
        height: height,
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        color: '#6b7280',
        fontSize: '14px'
      }}
    >
      {text || `${width}x${height}`}
    </div>
  )
} 