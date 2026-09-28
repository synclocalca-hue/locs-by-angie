'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CalendarDays, Check, Crown, Gift, LogIn, Sparkles, UserPlus } from 'lucide-react'

// Brand Configuration for Locs by Angie
const SALON_CONFIG = {
  name: 'Locs by Angie',
  logoUrl: '/locs.jpg', // Placed directly in public/ folder
  logoText: 'Locs By Angie',
  bookingUrl: 'https://locsbyangiedreadlocks.com/',
  masterPin: '1234',
  totalStampsNeeded: 5,
}

type ViewState = 'scan_filter' | 'join_form' | 'stamp_form' | 'passport'

export default function Page() {
  const [view, setView] = useState<ViewState>('scan_filter')

  // Client Data with LocalStorage Persistence
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [stamps, setStamps] = useState(0)
  const [isFirstJoin, setIsFirstJoin] = useState(false)

  // Modals & PIN verification
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Restore client session from LocalStorage on load
  useEffect(() => {
    const savedName = localStorage.getItem('angie_user_name')
    const savedPhone = localStorage.getItem('angie_user_phone')
    const savedStamps = localStorage.getItem('angie_user_stamps')

    if (savedName) setUserName(savedName)
    if (savedPhone) setPhone(savedPhone)
    if (savedStamps) setStamps(Number(savedStamps))
  }, [])

  // Helper to persist state updates
  const saveClientData = (name: string, phoneNumber: string, currentStamps: number) => {
    localStorage.setItem('angie_user_name', name)
    localStorage.setItem('angie_user_phone', phoneNumber)
    localStorage.setItem('angie_user_stamps', currentStamps.toString())
  }

  // 1. New Client Registration Flow
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName || !phone) return

    const initialStamps = 1
    setIsFirstJoin(true)
    setStamps(initialStamps)
    saveClientData(userName, phone, initialStamps)
    setShowSuccessModal(true)
    setView('passport')
  }

  // 2. Returning Client / Stamp Collection Flow
  const handleStampSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setIsFirstJoin(false)

    if (stamps >= SALON_CONFIG.totalStampsNeeded) {
      if (pin !== SALON_CONFIG.masterPin) {
        setPinError(true)
        return
      }
      setStamps(0)
      setPin('')
      setPinError(false)
      saveClientData(userName || 'Valued Guest', phone, 0)
    } else {
      const updatedStamps = Math.min(SALON_CONFIG.totalStampsNeeded, stamps + 1)
      setStamps(updatedStamps)
      saveClientData(userName || 'Valued Guest', phone, updatedStamps)
    }

    setShowSuccessModal(true)
    setView('passport')
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-5 font-sans text-zinc-900 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-md flex-col">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-amber-900/10 py-2 pb-4">
          <div className="flex items-center gap-3 text-left">
            <span className="flex size-11 items-center justify-center overflow-hidden rounded-full border border-amber-900/20 bg-amber-950 text-xs font-bold tracking-[0.15em] text-amber-200">
              {SALON_CONFIG.logoText}
            </span>
            <div>
              <span className="block text-[15px] font-semibold uppercase tracking-wider text-zinc-900">
                {SALON_CONFIG.name}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-amber-800/70">
                VIP Loc Care Pass
              </span>
            </div>
          </div>
        </header>

        {/* VIEW 1: INITIAL SCAN FILTER */}
        {view === 'scan_filter' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 rounded-[28px] border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-900/5"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50/50 p-3 shadow-inner">
                <img
                  src={SALON_CONFIG.logoUrl}
                  alt={SALON_CONFIG.name}
                  className="h-auto max-h-12 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text monogram if logo fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>

              <h1 className="text-2xl font-light tracking-wide text-zinc-900">
                Welcome to <span className="font-semibold">{SALON_CONFIG.name}</span>
              </h1>
              <p className="mt-2 text-xs text-zinc-500">
                Collect stamps on retwists, maintenance & color sessions
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={() => setView('join_form')}
                className="flex items-center justify-between rounded-2xl border border-amber-950 bg-amber-950 p-5 text-left text-white shadow-md transition hover:bg-amber-900"
              >
                <div className="flex items-center gap-4">
                  <UserPlus className="size-6 text-amber-300" />
                  <div>
                    <p className="text-base font-medium text-white">Join Loc Care Loyalty</p>
                    <p className="text-xs text-amber-200/70">First visit? Register in seconds</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setView('stamp_form')}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 text-left transition hover:bg-zinc-100"
              >
                <div className="flex items-center gap-4">
                  <LogIn className="size-6 text-zinc-700" />
                  <div>
                    <p className="text-base font-medium text-zinc-900">Returning Client / Stamp Pass</p>
                    <p className="text-xs text-zinc-400">Enter phone to collect today's stamp</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: JOIN FORM */}
        {view === 'join_form' && (
          <motion.form
            onSubmit={handleJoinSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-[28px] border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-900/5"
          >
            <h2 className="text-xl font-medium text-zinc-900">New Client Registration</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Register once to collect your first retwist stamp and unlock VIP benefits.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-zinc-500">
                First Name
                <input
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-amber-900"
                  placeholder="e.g. Marcus"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-zinc-500">
                Phone Number
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-amber-900"
                  placeholder="(510) 012-3456"
                />
              </label>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-amber-950 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-amber-900"
              >
                Register & Get Stamp #1
              </button>

              <button
                type="button"
                onClick={() => setView('scan_filter')}
                className="py-2 text-center text-xs text-zinc-400 hover:text-zinc-600"
              >
                ← Back to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 3: STAMP FORM */}
        {view === 'stamp_form' && (
          <motion.form
            onSubmit={handleStampSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-[28px] border border-amber-900/10 bg-white p-6 shadow-xl shadow-amber-900/5"
          >
            <h2 className="text-xl font-medium text-zinc-900">
              {stamps >= SALON_CONFIG.totalStampsNeeded ? 'Redeem VIP Loc Treatment' : 'Stamp Loyalty Pass'}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {stamps >= SALON_CONFIG.totalStampsNeeded
                ? 'Angie or staff PIN required to redeem.'
                : "Enter your phone number to stamp today's appointment."}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-zinc-500">
                Phone Number
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-amber-900"
                  placeholder="(510) 012-3456"
                />
              </label>

              {stamps >= SALON_CONFIG.totalStampsNeeded && (
                <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4">
                  <Sparkles className="mb-1 size-5 text-amber-800" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-950">
                    Reward Unlocked: Free Hydrating Scalp Treatment / ACV Loc Detox
                  </p>
                  <label className="mt-3 flex flex-col gap-1.5 text-xs text-amber-900/80">
                    Enter 4-Digit Staff PIN
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value)
                        setPinError(false)
                      }}
                      className={`rounded-lg border ${
                        pinError ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-white'
                      } px-3 py-2 text-center text-zinc-900 outline-none`}
                      placeholder="••••"
                    />
                  </label>
                  {pinError && <p className="mt-1 text-[11px] text-red-600">Incorrect staff PIN. Try again.</p>}
                </div>
              )}

              <button
                type="submit"
                className="mt-2 rounded-xl bg-amber-950 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-amber-900"
              >
                {stamps >= SALON_CONFIG.totalStampsNeeded ? 'Verify & Redeem Reward' : "Collect Today's Stamp"}
              </button>

              <button
                type="button"
                onClick={() => setView('scan_filter')}
                className="py-2 text-center text-xs text-zinc-400 hover:text-zinc-600"
              >
                ← Back to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 4: DIGITAL PASSPORT */}
        {view === 'passport' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col">
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-amber-800">VIP Loc Passport</p>
                <h1 className="mt-1 text-2xl font-light tracking-tight text-zinc-900">
                  Welcome{isFirstJoin ? '' : ' back'}, <span className="font-semibold">{userName || 'Valued Guest'}</span>
                </h1>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-amber-900/20 bg-amber-100/60 px-3 py-1.5 text-xs font-medium text-amber-950">
                <Gift className="size-3.5 text-amber-800" /> Active Pass
              </span>
            </div>

            <section className="mt-5 rounded-[28px] border border-amber-900/10 bg-white p-5 shadow-xl shadow-amber-900/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Retwist Cycle</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {stamps < SALON_CONFIG.totalStampsNeeded
                      ? `${SALON_CONFIG.totalStampsNeeded - stamps} visit${
                          SALON_CONFIG.totalStampsNeeded - stamps === 1 ? '' : 's'
                        } away from your Free Scalp Detox Treatment`
                      : 'Free Scalp Detox Unlocked!'}
                  </p>
                </div>
                <span className="text-3xl font-light text-zinc-900">
                  {stamps}
                  <span className="text-lg text-amber-900/30">/{SALON_CONFIG.totalStampsNeeded}</span>
                </span>
              </div>

              {/* 5-Stamp Grid Layout */}
              <div className="mt-6 grid grid-cols-5 gap-2">
                {Array.from({ length: SALON_CONFIG.totalStampsNeeded }, (_, index) => {
                  const filled = index < stamps
                  const isRewardSpot = index === SALON_CONFIG.totalStampsNeeded - 1
                  return (
                    <div
                      key={index}
                      className={`relative flex aspect-square items-center justify-center rounded-2xl border ${
                        filled
                          ? 'border-amber-950 bg-amber-950 text-white'
                          : isRewardSpot
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-zinc-100 bg-zinc-50/50'
                      }`}
                    >
                      <span
                        className={`absolute left-2 top-2 text-[9px] ${
                          filled ? 'text-amber-200/60' : 'text-zinc-400'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      {filled ? (
                        <span className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-amber-950">
                          <Check className="size-4 stroke-[3]" />
                        </span>
                      ) : isRewardSpot ? (
                        <Crown className="size-5 text-amber-800" />
                      ) : (
                        <span className="size-2 rounded-full bg-zinc-200" />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <motion.div
                  animate={{ width: `${(stamps / SALON_CONFIG.totalStampsNeeded) * 100}%` }}
                  className="h-full rounded-full bg-amber-950"
                />
              </div>
            </section>

            <section className="mt-6 flex flex-col gap-3">
              <a
                href={SALON_CONFIG.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-amber-950 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-900"
              >
                <CalendarDays className="size-4 text-amber-300" /> Book Next Retwist Session
              </a>

              <button
                onClick={() => setView('scan_filter')}
                className="py-2 text-center text-xs text-zinc-400 hover:text-zinc-600"
              >
                Simulate Counter QR Scan
              </button>
            </section>
          </motion.div>
        )}

        <p className="mt-auto pt-8 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          Secure Loc Care Pass · {SALON_CONFIG.name}
        </p>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-950/50 p-4 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ y: 30, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              className="w-full max-w-sm rounded-[28px] border border-amber-900/10 bg-white p-6 text-center shadow-2xl"
            >
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-950 text-amber-200">
                <BadgeCheck className="size-8" />
              </span>

              <h2 className="mt-5 text-xl font-medium text-zinc-900">
                {isFirstJoin ? `Welcome, ${userName}!` : `Welcome back, ${userName || 'Valued Guest'}!`}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {stamps === 0
                  ? 'Your Scalp Detox reward has been redeemed!'
                  : `You're ${SALON_CONFIG.totalStampsNeeded - stamps} retwist visit${
                      SALON_CONFIG.totalStampsNeeded - stamps === 1 ? '' : 's'
                    } away from your complimentary scalp treatment!`}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={SALON_CONFIG.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-amber-950 py-3 text-sm font-semibold text-white"
                >
                  Book Next Retwist
                </a>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="rounded-xl border border-zinc-200 py-3 text-sm text-zinc-500 hover:text-zinc-900"
                >
                  View Passport Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
