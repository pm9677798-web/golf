'use client'

import { memo, useCallback } from 'react'

interface FastButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const FastButton = memo(function FastButton({ 
  onClick, 
  children, 
  className = '', 
  disabled = false,
  type = 'button'
}: FastButtonProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (!disabled) {
      onClick()
    }
  }, [onClick, disabled])

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`fast-click ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
    </button>
  )
})

export default FastButton