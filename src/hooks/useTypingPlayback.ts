import { useEffect, useRef, useState } from 'react'

type Options = {
  textLength: number
  typeSpeed: number
  endPause: number
}

export function useTypingPlayback({ textLength, typeSpeed, endPause }: Options) {
  const [charIndex, setCharIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const [epoch, setEpoch] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearTimer() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  function playFromStart() {
    clearTimer()
    setCharIndex(0)
    setPlaying(true)
    setEpoch((e) => e + 1)
  }

  function pause() {
    setPlaying(false)
    clearTimer()
  }

  function resetIndex() {
    setCharIndex(0)
    setEpoch((e) => e + 1)
  }

  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    clearTimer()
    if (!playing) return

    let cancelled = false
    let index = 0

    const schedule = (fn: () => void, ms: number) => {
      timeoutRef.current = setTimeout(fn, ms)
    }

    const tick = () => {
      if (cancelled) return
      if (index < textLength) {
        index += 1
        setCharIndex(index)
        schedule(tick, typeSpeed)
        return
      }
      schedule(() => {
        if (cancelled) return
        index = 0
        setCharIndex(0)
        schedule(tick, typeSpeed)
      }, endPause * 1000)
    }

    schedule(tick, typeSpeed)

    return () => {
      cancelled = true
      clearTimer()
    }
  }, [playing, typeSpeed, endPause, textLength, epoch])

  return {
    charIndex,
    playing,
    showCursor,
    playFromStart,
    pause,
    resetIndex,
  }
}
