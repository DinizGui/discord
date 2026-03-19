'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Headphones,
  VolumeX,
  Users,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

export function VoiceRoom({
  title,
  subtitle,
  variant,
  peerAvatar,
  peerName,
  closeLabel,
  layout = 'full',
  onClosePanel,
}: {
  title: string
  subtitle?: string
  variant: 'server' | 'dm'
  peerAvatar?: string
  peerName?: string
  closeLabel?: string
  layout?: 'full' | 'dock'
  /** DM: volta ao texto e encerra mídia */
  onClosePanel?: () => void
}) {
  const { currentUser } = useApp()
  const [joined, setJoined] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speakingRafRef = useRef<number>(0)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const playSfx = useCallback((kind: 'join' | 'leave' | 'mic_on' | 'mic_off' | 'deafen_on' | 'deafen_off' | 'video_on' | 'video_off') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      const ctx: AudioContext =
        audioCtxRef.current ?? new AudioCtx()
      audioCtxRef.current = ctx

      if (ctx.state === 'suspended') {
        void ctx.resume().catch(() => {})
      }

      const sequences: Record<typeof kind, number[]> = {
        join: [523, 659],
        leave: [659, 523],
        mic_on: [784, 880],
        mic_off: [440, 392],
        deafen_on: [392, 330],
        deafen_off: [330, 392],
        video_on: [988, 1175],
        video_off: [740, 587],
      }

      const freqs = sequences[kind] ?? [523]
      const now = ctx.currentTime
      const master = ctx.createGain()
      master.gain.value = 0.0001
      master.connect(ctx.destination)

      freqs.forEach((freq, i) => {
        const t0 = now + i * 0.08
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq

        // Envelopes curtos (evita clicks + respeita drivers diferentes)
        gain.gain.setValueAtTime(0.0001, t0)
        gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06)

        osc.connect(gain)
        gain.connect(master)
        osc.start(t0)
        osc.stop(t0 + 0.07)
      })
    } catch {
      // Se áudio for bloqueado, não quebra a UX.
    }
  }, [])

  useEffect(() => {
    return () => stopTracks()
  }, [stopTracks])

  /** Detecta quando o microfone capta voz (nível de áudio) */
  useEffect(() => {
    if (!joined || !micOn) {
      setIsSpeaking(false)
      return
    }
    const stream = streamRef.current
    const track = stream?.getAudioTracks()[0]
    if (!stream || !track?.enabled) {
      setIsSpeaking(false)
      return
    }

    let ctx: AudioContext
    try {
      ctx = new AudioContext()
    } catch {
      return
    }
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.65
    source.connect(analyser)

    const buf = new Uint8Array(analyser.fftSize)
    let loudStreak = 0
    let quietStreak = 0
    const RMS_ON = 0.018
    const RMS_OFF = 0.012

    const tick = () => {
      analyser.getByteTimeDomainData(buf)
      let sum = 0
      for (let i = 0; i < buf.length; i++) {
        const x = (buf[i]! - 128) / 128
        sum += x * x
      }
      const rms = Math.sqrt(sum / buf.length)

      if (rms >= RMS_ON) {
        quietStreak = 0
        loudStreak++
        if (loudStreak >= 2) setIsSpeaking(true)
      } else if (rms <= RMS_OFF) {
        loudStreak = 0
        quietStreak++
        if (quietStreak >= 5) setIsSpeaking(false)
      }

      speakingRafRef.current = requestAnimationFrame(tick)
    }
    void ctx.resume().catch(() => {})
    speakingRafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(speakingRafRef.current)
      void ctx.close()
      setIsSpeaking(false)
    }
  }, [joined, micOn])

  const attachStream = (s: MediaStream) => {
    streamRef.current = s
    const el = videoRef.current
    if (el) {
      el.srcObject = s
      void el.play().catch(() => {})
    }
  }

  const join = async (withVideo: boolean) => {
    setError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo ? { facingMode: 'user' } : false,
      })
      attachStream(s)
      setVideoOn(withVideo)
      setMicOn(true)
      setJoined(true)
      playSfx('join')
    } catch {
      setError(
        'Não foi possível usar microfone ou câmera. Permita o acesso nas configurações do navegador.',
      )
    }
  }

  const leave = () => {
    playSfx('leave')
    stopTracks()
    setJoined(false)
    setVideoOn(false)
    setDeafened(false)
    setMicOn(true)
    onClosePanel?.()
  }

  const toggleMic = () => {
    const s = streamRef.current
    if (!s) return
    const a = s.getAudioTracks()[0]
    if (a) {
      a.enabled = !a.enabled
      setMicOn(a.enabled)
      playSfx(a.enabled ? 'mic_on' : 'mic_off')
    }
  }

  const toggleDeafen = () => {
    setDeafened((d) => {
      const next = !d
      playSfx(next ? 'deafen_on' : 'deafen_off')
      return next
    })
  }

  const toggleVideo = async () => {
    const s = streamRef.current
    if (!joined) {
      await join(true)
      return
    }
    const existing = s?.getVideoTracks()[0]
    if (existing) {
      existing.stop()
      s!.removeTrack(existing)
      setVideoOn(false)
      playSfx('video_off')
      if (videoRef.current && s) videoRef.current.srcObject = s
    } else {
      try {
        const vs = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        })
        const vt = vs.getVideoTracks()[0]
        if (s) {
          s.addTrack(vt)
          setVideoOn(true)
          playSfx('video_on')
          if (videoRef.current) {
            videoRef.current.srcObject = s
            void videoRef.current.play().catch(() => {})
          }
        }
      } catch {
        setError('Câmera indisponível.')
      }
    }
  }

  if (layout === 'dock') {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/80 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-zinc-100">{title}</p>
            {subtitle && <p className="truncate text-[10px] text-zinc-500">{subtitle}</p>}
          </div>

          {onClosePanel && (
            <button
              type="button"
              onClick={leave}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/90 text-white transition hover:bg-red-500"
              title={closeLabel || 'Sair da call'}
            >
              <PhoneOff className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 p-3">
          {!joined ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
                <Users className="h-7 w-7 text-emerald-400" />
              </div>
              {error && <p className="text-center text-[11px] text-red-400">{error}</p>}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => void join(false)}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                >
                  Áudio
                </button>
                <button
                  type="button"
                  onClick={() => void join(true)}
                  className="rounded-xl border border-white/15 bg-zinc-800 px-3 py-2 text-[12px] font-semibold text-zinc-200 transition hover:bg-zinc-700"
                >
                  Vídeo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-3">
              <div
                className={cn(
                  'relative aspect-video overflow-hidden rounded-xl border transition-shadow',
                  isSpeaking && micOn
                    ? 'border-emerald-400/40 shadow-[0_0_40px_-10px_rgba(52,211,153,0.8)]'
                    : 'border-white/10',
                )}
              >
                {videoOn ? (
                  <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-950/40">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-white/10">
                      <Image src={currentUser?.avatar || '/placeholder.svg'} alt="Você" fill className="object-cover" />
                    </div>
                  </div>
                )}

                {micOn && isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-3 top-3 rounded-full bg-emerald-600/90 px-2 py-1 text-[11px] font-semibold text-white shadow-lg"
                  >
                    Falando
                  </motion.div>
                )}

                {!micOn && (
                  <div className="absolute left-3 bottom-3 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-zinc-100">
                    (mudo)
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <ControlBtn
                  onClick={toggleMic}
                  active={micOn}
                  label={micOn ? 'Microfone' : 'Mudo'}
                  iconOn={<Mic className="h-5 w-5" />}
                  iconOff={<MicOff className="h-5 w-5 text-red-300" />}
                  className="h-10 w-10"
                />
                <ControlBtn
                  onClick={toggleDeafen}
                  active={!deafened}
                  label={deafened ? 'Som off' : 'Ouvindo'}
                  iconOn={<Headphones className="h-5 w-5" />}
                  iconOff={<VolumeX className="h-5 w-5 text-amber-300" />}
                  className="h-10 w-10"
                />
                <ControlBtn
                  onClick={() => void toggleVideo()}
                  active={videoOn}
                  label={videoOn ? 'Câmera' : 'Vídeo off'}
                  iconOn={<Video className="h-5 w-5" />}
                  iconOff={<VideoOff className="h-5 w-5" />}
                  className="h-10 w-10"
                />
                <button
                  type="button"
                  onClick={leave}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500"
                  title="Desligar"
                >
                  <PhoneOff className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-zinc-950/80">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </div>
        {onClosePanel && (
          <button
            type="button"
            onClick={leave}
            className="shrink-0 rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700"
          >
            {closeLabel || '← Voltar ao chat'}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
        {!joined ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex max-w-md flex-col items-center text-center"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <Users className="h-10 w-10 text-emerald-400" />
            </div>
            <p className="mb-2 text-base font-medium text-zinc-200">
              {variant === 'server' ? 'Canal de voz' : 'Chamada direta'}
            </p>
            <p className="mb-8 text-sm leading-relaxed text-zinc-500">
              Você pode falar e ver sua própria câmera aqui. Para ouvir <strong>outras pessoas</strong> no
              mesmo canal, no futuro será preciso conectar um serviço de voz em grupo (WebRTC/SFU).
            </p>
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => void join(false)}
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500"
              >
                Entrar só com áudio
              </button>
              <button
                type="button"
                onClick={() => void join(true)}
                className="rounded-2xl border border-white/15 bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
              >
                Vídeo + áudio
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
              <motion.div
                layout
                className={cn(
                  'relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 ring-2 transition-shadow duration-150',
                  isSpeaking && micOn
                    ? 'ring-emerald-400 shadow-[0_0_40px_-8px_rgba(52,211,153,0.65)]'
                    : 'ring-white/10',
                )}
              >
                {isSpeaking && micOn && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-emerald-400/50"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {videoOn ? (
                  <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-[180px] items-center justify-center">
                    <motion.div
                      animate={
                        isSpeaking && micOn
                          ? { scale: [1, 1.06, 1], boxShadow: ['0 0 0 0 rgba(52,211,153,0.4)', '0 0 0 12px rgba(52,211,153,0)', '0 0 0 0 rgba(52,211,153,0)'] }
                          : {}
                      }
                      transition={{ duration: 0.85, repeat: isSpeaking && micOn ? Infinity : 0 }}
                      className={cn(
                        'relative h-24 w-24 overflow-hidden rounded-2xl',
                        isSpeaking && micOn ? 'ring-4 ring-emerald-400/80' : 'ring-2 ring-violet-500/40',
                      )}
                    >
                      <Image
                        src={currentUser?.avatar || '/placeholder.svg'}
                        alt="Você"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </div>
                )}
                {/* Indicador “falando” */}
                {micOn && (
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isSpeaking ? 1 : 0,
                      y: isSpeaking ? 0 : 8,
                    }}
                    className="pointer-events-none absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-2 rounded-full bg-emerald-600/95 px-4 py-1.5 text-sm font-semibold text-white shadow-lg ring-2 ring-emerald-400/50"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    Falando
                  </motion.div>
                )}
                <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    Você {!micOn && '(mudo)'}
                  </span>
                  {isSpeaking && micOn && (
                    <span className="rounded-lg bg-emerald-600/90 px-2 py-1 text-xs font-semibold text-white">
                      áudio ativo
                    </span>
                  )}
                </div>
              </motion.div>

              {variant === 'dm' && peerName ? (
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-zinc-900/80 ring-1 ring-dashed ring-white/15">
                  <div className="text-center">
                    <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-2xl">
                      <Image
                        src={peerAvatar || '/placeholder.svg'}
                        alt={peerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-zinc-300">{peerName}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Aguardando a outra pessoa entrar na call pelo mesmo chat
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/40">
                  <p className="max-w-[200px] text-center text-sm text-zinc-500">
                    Quando amigos entrarem neste canal de voz, os rostos aparecerão aqui.
                  </p>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-zinc-900/80 px-4 py-4">
              <div className="relative">
                {isSpeaking && micOn && (
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-90" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-zinc-900" />
                  </span>
                )}
                <ControlBtn
                  onClick={toggleMic}
                  active={micOn}
                  label={micOn ? 'Microfone' : 'Mudo'}
                  iconOn={<Mic className="h-5 w-5" />}
                  iconOff={<MicOff className="h-5 w-5 text-red-400" />}
                />
              </div>
              <ControlBtn
                onClick={toggleDeafen}
                active={!deafened}
                label={deafened ? 'Som off' : 'Ouvindo'}
                iconOn={<Headphones className="h-5 w-5" />}
                iconOff={<VolumeX className="h-5 w-5 text-amber-400" />}
              />
              <ControlBtn
                onClick={() => void toggleVideo()}
                active={videoOn}
                label={videoOn ? 'Câmera' : 'Vídeo off'}
                iconOn={<Video className="h-5 w-5" />}
                iconOff={<VideoOff className="h-5 w-5" />}
              />
              <button
                type="button"
                onClick={leave}
                className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500"
                title="Desligar"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ControlBtn({
  onClick,
  active,
  label,
  iconOn,
  iconOff,
  className,
}: {
  onClick: () => void
  active: boolean
  label: string
  iconOn: React.ReactNode
  iconOff: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full transition',
        className,
        active ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-red-500/20 text-white hover:bg-red-500/30',
      )}
    >
      {active ? iconOn : iconOff}
    </button>
  )
}
