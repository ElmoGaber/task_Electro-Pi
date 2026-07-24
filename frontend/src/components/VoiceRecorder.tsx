import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface VoiceRecorderProps {
  onRecorded: (blob: Blob) => void
}

export function VoiceRecorder({ onRecorded }: VoiceRecorderProps) {
  const { t } = useTranslation()
  const [recording, setRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onRecorded(blob)
      }

      mediaRecorder.start()
      setRecording(true)
      setDuration(0)
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch {
      // permission denied
    }
  }, [onRecorded])

  const stopRecording = useCallback(() => {
    mediaRef.current?.stop()
    setRecording(false)
    clearInterval(timerRef.current)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="voice-recorder">
      {recording ? (
        <button type="button" className="voice-btn voice-btn--stop" onClick={stopRecording}>
          <span className="voice-pulse" /> {t('voice.stop', 'Stop')} ({formatTime(duration)})
        </button>
      ) : (
        <button type="button" className="voice-btn voice-btn--start" onClick={startRecording}>
          🎤 {t('voice.record', 'Record voice')}
        </button>
      )}
    </div>
  )
}
