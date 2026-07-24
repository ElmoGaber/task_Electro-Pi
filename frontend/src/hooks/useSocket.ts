import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/context/useAuth'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

interface PresenceData {
  userId: string
  socketId: string
}

interface TypingData {
  userId: string
  taskId?: string
  typing: boolean
}

export function useSocket() {
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) return

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('join:tasks', user.id)
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('typing:indicator', (data: TypingData) => {
      setTypingUsers((prev) => {
        const next = new Set(prev)
        if (data.typing) next.add(data.userId)
        else next.delete(data.userId)
        return next
      })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnected(false)
    }
  }, [user])

  const emitTyping = (typing: boolean, taskId?: string) => {
    if (!socketRef.current || !user) return
    socketRef.current.emit(typing ? 'typing:start' : 'typing:stop', {
      userId: user.id,
      taskId,
    })
  }

  return { connected, typingUsers, emitTyping }
}
