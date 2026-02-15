'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTiltOptions {
  maxDegrees?: number
  perspective?: number
  lerpFactor?: number
  deadBand?: number
}

export function useTilt(options?: UseTiltOptions) {
  const {
    maxDegrees = 8,
    perspective = 1000,
    lerpFactor = 0.1,
    deadBand = 0.1,
  } = options ?? {}

  const targetX = useRef(0)
  const targetY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const rafId = useRef<number | null>(null)
  const isAnimating = useRef(false)
  const [, forceUpdate] = useState(0)

  const tick = useCallback(() => {
    currentX.current += (targetX.current - currentX.current) * lerpFactor
    currentY.current += (targetY.current - currentY.current) * lerpFactor

    const atTarget =
      Math.abs(currentX.current) < deadBand &&
      Math.abs(currentY.current) < deadBand &&
      targetX.current === 0 &&
      targetY.current === 0

    if (atTarget) {
      currentX.current = 0
      currentY.current = 0
      isAnimating.current = false
      forceUpdate(n => n + 1)
    } else {
      forceUpdate(n => n + 1)
      rafId.current = requestAnimationFrame(tick)
    }
  }, [lerpFactor, deadBand])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1

    targetX.current = normalizedY * -maxDegrees
    targetY.current = normalizedX * maxDegrees

    if (!isAnimating.current) {
      isAnimating.current = true
      rafId.current = requestAnimationFrame(tick)
    }
  }, [maxDegrees, tick])

  const onMouseLeave = useCallback(() => {
    targetX.current = 0
    targetY.current = 0
    if (!isAnimating.current) {
      isAnimating.current = true
      rafId.current = requestAnimationFrame(tick)
    }
  }, [tick])

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  const tiltStyle: React.CSSProperties = {
    perspective: `${perspective}px`,
    transform: `rotateX(${currentX.current}deg) rotateY(${currentY.current}deg)`,
    transformStyle: 'preserve-3d',
  }

  return {
    tiltStyle,
    tiltHandlers: { onMouseMove, onMouseLeave },
  }
}
