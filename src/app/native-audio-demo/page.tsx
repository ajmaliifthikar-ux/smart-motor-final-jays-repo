'use client'

import { useState, useEffect } from 'react'
import { useNativeAudio } from '@/hooks/use-native-audio'
import { Mic, MicOff, Volume2, Send, RotateCcw, AlertCircle } from 'lucide-react'

export default function NativeAudioDemo() {
  const [textInput, setTextInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [mounted, setMounted] = useState(false)

  const {
    isStreaming,
    isConnected,
    error,
    transcript,
    audioChunks,
    sendAudio,
    sendText,
    startListening,
    stopListening,
    playAudioResponse,
    reset,
  } = useNativeAudio('demo-session', 'Zephyr')

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleStartListening = async () => {
    setIsListening(true)
    await startListening()
  }

  const handleStopListening = () => {
    setIsListening(false)
    stopListening()
  }

  const handleSendText = async () => {
    if (textInput.trim()) {
      await sendText(textInput)
      setTextInput('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎤 Gemini Native Audio
          </h1>
          <p className="text-slate-400">
            Bidirectional Audio Streaming with Real-Time Transcription
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Model: gemini-2.5-flash-native-audio-preview-12-2025
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className={`p-4 rounded-lg border transition ${
              isConnected
                ? 'bg-green-900/20 border-green-500'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span className="text-sm font-medium text-slate-300">
                Connection
              </span>
            </div>
            <p className="text-lg font-semibold text-white">
              {isConnected ? '🟢 Connected' : '⚪ Initializing...'}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border transition ${
              isStreaming
                ? 'bg-blue-900/20 border-blue-500'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-3 h-3 rounded-full ${
                  isStreaming ? 'bg-blue-500 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span className="text-sm font-medium text-slate-300">Status</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {isStreaming ? '⏳ Processing...' : '✓ Ready'}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500 rounded-lg flex gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-300 font-semibold text-sm">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Voice Input Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            🎙️ Voice Input
          </h2>

          <div className="flex gap-4 mb-4 flex-wrap">
            <button
              onClick={handleStartListening}
              disabled={isListening || isStreaming || !isConnected}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed'
              }`}
            >
              <Mic size={20} />
              {isListening ? 'Listening...' : 'Start Recording'}
            </button>

            {isListening && (
              <button
                onClick={handleStopListening}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 flex items-center gap-2"
              >
                <MicOff size={20} />
                Stop
              </button>
            )}
          </div>

          {audioChunks.length > 0 && (
            <button
              onClick={playAudioResponse}
              disabled={isStreaming}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
            >
              <Volume2 size={20} />
              Play Response ({audioChunks.length} chunks)
            </button>
          )}
        </div>

        {/* Text Input Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">📝 Text Input</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Ask something about Smart Motor..."
              disabled={isStreaming || !isConnected}
              className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition"
            />

            <button
              onClick={handleSendText}
              disabled={isStreaming || !textInput.trim() || !isConnected}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Transcript Section */}
        {transcript && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center justify-between w-full mb-4 cursor-pointer hover:opacity-80 transition"
            >
              <h2 className="text-lg font-semibold text-white">
                📋 AI Response
              </h2>
              <span className="text-slate-400 text-sm">
                {showTranscript ? '▼' : '▶'}
              </span>
            </button>

            {showTranscript && (
              <div className="max-h-64 overflow-y-auto bg-slate-700/50 p-4 rounded">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {transcript}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <p className="text-blue-300 font-medium">
                Streaming response from Gemini...
              </p>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={reset}
          className="w-full py-3 px-4 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 flex items-center justify-center gap-2 transition"
        >
          <RotateCcw size={20} />
          Reset
        </button>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-300">💡 How it works:</span> This demo uses
            the Gemini 2.5 Flash Native Audio model which supports bidirectional
            audio streaming. You can speak naturally and receive audio responses
            with real-time text transcription.
          </p>
        </div>
      </div>
    </div>
  )
}
