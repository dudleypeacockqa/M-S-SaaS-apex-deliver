/**
 * FocusTimer Component
 *
 * Pomodoro-style focus session timer
 */

import React, { useState, useEffect } from 'react'
import { cn } from '@/styles/design-tokens'
import { Play, Pause, Square, Clock } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import {
  useActiveFocusSession,
  useStartFocusSession,
  useCompleteFocusSession,
} from '@/hooks/master-admin'

export const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0) // seconds
  const [isRunning, setIsRunning] = useState(false)

  const { data: activeSession } = useActiveFocusSession()
  const startSession = useStartFocusSession()
  const completeSession = useCompleteFocusSession()

  // Calculate time left from active session
  useEffect(() => {
    if (activeSession && !activeSession.completed) {
      const startTime = new Date(activeSession.start_time).getTime()
      const duration = activeSession.duration_minutes * 60 * 1000
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, Math.floor((duration - elapsed) / 1000))
      setTimeLeft(remaining)
      setIsRunning(true)
    } else {
      setIsRunning(false)
      setTimeLeft(0)
    }
  }, [activeSession])

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          // Auto-complete when timer reaches zero
          if (activeSession) {
            handleComplete(false)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeLeft, activeSession])

  const handleStart = async (durationMinutes: number) => {
    try {
      await startSession.mutateAsync({
        start_time: new Date().toISOString(),
        duration_minutes: durationMinutes,
      })
    } catch (error) {
      console.error('Failed to start focus session:', error)
    }
  }

  const handleComplete = async (interrupted: boolean = false) => {
    if (!activeSession) return

    try {
      await completeSession.mutateAsync({
        sessionId: activeSession.id,
        update: {
          end_time: new Date().toISOString(),
          completed: !interrupted,
          interrupted,
        },
      })
    } catch (error) {
      console.error('Failed to complete focus session:', error)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = activeSession
    ? ((activeSession.duration_minutes * 60 - timeLeft) /
        (activeSession.duration_minutes * 60)) *
      100
    : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Focus Session</h3>
      </div>

      {activeSession && !activeSession.completed ? (
        // Active Session
        <div className="space-y-4">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">
              {activeSession.duration_minutes} minute session
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            <Button
              variant="danger"
              btnSize="sm"
              fullWidth
              onClick={() => handleComplete(true)}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>

          {activeSession.notes && (
            <p className="text-sm text-gray-600 italic">
              Note: {activeSession.notes}
            </p>
          )}
        </div>
      ) : (
        // Start Session
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Start a focused work session with no distractions.
          </p>

          {/* Quick Start Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="primary"
              btnSize="sm"
              onClick={() => handleStart(25)}
              loading={startSession.isPending}
            >
              <Play className="h-4 w-4 mr-1" />
              25 min
            </Button>
            <Button
              variant="secondary"
              btnSize="sm"
              onClick={() => handleStart(50)}
              loading={startSession.isPending}
            >
              <Play className="h-4 w-4 mr-1" />
              50 min
            </Button>
            <Button
              variant="outline"
              btnSize="sm"
              onClick={() => handleStart(15)}
              loading={startSession.isPending}
            >
              <Play className="h-4 w-4 mr-1" />
              15 min
            </Button>
            <Button
              variant="outline"
              btnSize="sm"
              onClick={() => handleStart(90)}
              loading={startSession.isPending}
            >
              <Play className="h-4 w-4 mr-1" />
              90 min
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
