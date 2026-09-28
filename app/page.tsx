'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Calendar, Check, Crown, Lock, LogIn, UserPlus } from 'lucide-react'

// Brand Configuration for Locs by Angie
const SALON_CONFIG = {
  name: 'Locs by Angie',
  logoImgPath: '/locs.jpg',
  qrCodeSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23271c14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="5.5" y="5.5" width="2" height="2" fill="%23271c14"/><rect x="16.5" y="5.5" width="2" height="2" fill="%23271c14"/><rect x="5.5" y="16.5" width="2" height="2" fill="%23271c14"/><rect x="16.5" y="16.5" width="2" height="2" fill="%23271c14"/></svg>`,
  bookingUrl: 'https://locsbyangiedreadlocks.com/',
  masterPin: '1234',
  totalStampsNeeded: 5,
  featuredReward: 'Complimentary Hot Oil & ACV Scalp Detox',
  rewardValue: '$35 Value',
}

type ViewState = 'scan_filter' | 'join_form' | 'stamp_form' | 'passport'

export default function Page() {
  const [view, setView] = useState<ViewState>('scan_filter')

  // Client Data with LocalStorage Persistence
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [stamps, setStamps] = useState(0)
  const [isFirstJoin, setIsFirstJoin] = useState(false)

  // Security & Modals
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
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-6 font-sans text-zinc-900 antialiased sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-sm flex-col justify-between">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2 shadow-xs">
              <img
                src={SALON_CONFIG.qrCodeSvg}
                alt="Pass Code"
                className="size-full object-contain"
              />
            </span>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-900">
                {SALON_CONFIG.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                VIP Client Pass
              </span>
            </div>
          </div>
        </header>

        {/* VIEW 1: LANDING & VALUE PROPOSITION */}
        {view === 'scan_filter' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-auto py-4"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xs">
                <img
                  src={SALON_CONFIG.logoImgPath}
                  alt={SALON_CONFIG.name}
                  className="h-auto max-h-14 w-auto object-contain rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = SALON_CONFIG.qrCodeSvg
                  }}
                />
              </div>

              <h1 className="text-lg font-medium tracking-tight text-zinc-900">
                Client Loyalty Program
              </h1>
              <p className="mt-1 text-xs text-zinc-500">
                Earn rewards on retwists, maintenance & scalp treatments.
              </p>
            </div>

            {/* HIGH-VALUE DEMO BANNER */}
            <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white p-4 text-left shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-900">
                  5th Visit Reward
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-900 border border-amber-200/60">
                  {SALON_CONFIG.rewardValue}
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-zinc-900">
                {SALON_CONFIG.featuredReward}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                Automatically applied after completing 5 maintenance visits.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setView('join_form')}
                className="flex w-full items-center justify-between rounded-xl bg-zinc-900 px-4 py-3.5 text-left text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="size-4 text-zinc-300" />
                  <div>
                    <p className="text-xs font-medium text-white">New Client Registration</p>
                    <p className="text-[10px] text-zinc-400">Claim initial visit stamp</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setView('stamp_form')}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 text-left transition hover:bg-zinc-50 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <LogIn className="size-4 text-zinc-600" />
                  <div>
                    <p className="text-xs font-medium text-zinc-900">Returning Client</p>
                    <p className="text-[10px] text-zinc-400">Enter phone to record today's visit</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: REGISTRATION FORM */}
        {view === 'join_form' && (
          <motion.form
            onSubmit={handleJoinSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-auto py-4"
          >
            <h2 className="text-base font-medium text-zinc-900">Client Registration</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Register once to start tracking your retwist sessions and unlocks.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700">
                First Name
                <input
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="rounded-lg border border-zinc-200/80 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                  placeholder="e.g. Marcus"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700">
                Phone Number
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg border border-zinc-200/80 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                  placeholder="(510) 012-3456"
                />
              </label>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-zinc-900 py-3 text-xs font-medium text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.99]"
              >
                Register & Claim Stamp #1
              </button>

              <button
                type="button"
                onClick={() => setView('scan_filter')}
                className="py-1 text-center text-xs text-zinc-400 hover:text-zinc-600"
              >
                ← Return to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 3: STAMP FORM */}
        {view === 'stamp_form' && (
          <motion.form
            onSubmit={handleStampSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-auto py-4"
          >
            <h2 className="text-base font-medium text-zinc-900">
              {stamps >= SALON_CONFIG.totalStampsNeeded ? 'Redeem Reward' : 'Record Visit'}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {stamps >= SALON_CONFIG.totalStampsNeeded
                ? 'Staff authorization required to redeem.'
                : 'Enter your phone number to collect today\'s stamp.'}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700">
                Phone Number
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg border border-zinc-200/80 bg-white px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                  placeholder="(510) 012-3456"
                />
              </label>

              {stamps >= SALON_CONFIG.totalStampsNeeded && (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5">
                  <div className="flex items-center gap-1.5 text-amber-900">
                    <Lock className="size-3.5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Reward Ready
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-700 font-medium">
                    {SALON_CONFIG.featuredReward}
                  </p>
                  <label className="mt-3 flex flex-col gap-1 text-xs text-zinc-500">
                    Staff PIN
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value)
                        setPinError(false)
                      }}
                      className={`rounded-lg border ${
                        pinError ? 'border-red-500 bg-red-50' : 'border-zinc-200 bg-white'
                      } px-3 py-2 text-center text-xs text-zinc-900 outline-none`}
                      placeholder="••••"
                    />
                  </label>
                  {pinError && <p className="mt-1 text-[10px] text-red-600">Incorrect PIN. Please try again.</p>}
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-zinc-900 py-3 text-xs font-medium text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.99]"
              >
                {stamps >= SALON_CONFIG.totalStampsNeeded ? 'Authorize & Redeem' : 'Confirm Visit'}
              </button>

              <button
                type="button"
                onClick={() => setView('scan_filter')}
                className="py-1 text-center text-xs text-zinc-400 hover:text-zinc-600"
              >
                ← Return to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 4: DIGITAL PASSPORT CARD */}
        {view === 'passport' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="my-auto py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400">Digital Card</p>
                <h1 className="text-lg font-medium text-zinc-900">
                  {userName || 'Valued Guest'}
                </h1>
              </div>
              <span className="rounded-md border border-zinc-200/80 bg-white px-2.5 py-1 text-[10px] font-medium text-zinc-700 shadow-2xs">
                Active Member
              </span>
            </div>

            <section className="mt-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400">Progress</p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {stamps < SALON_CONFIG.totalStampsNeeded
                      ? `${SALON_CONFIG.totalStampsNeeded - stamps} visit${
                          SALON_CONFIG.totalStampsNeeded - stamps === 1 ? '' : 's'
                        } remaining until reward`
                      : 'Reward Ready for Redemption'}
                  </p>
                </div>
                <span className="text-xl font-light text-zinc-900">
                  {stamps}
                  <span className="text-sm text-zinc-300">/{SALON_CONFIG.totalStampsNeeded}</span>
                </span>
              </div>

              {/* Minimal Stamp Grid */}
              <div className="mt-5 grid grid-cols-5 gap-2">
                {Array.from({ length: SALON_CONFIG.totalStampsNeeded }, (_, index) => {
                  const filled = index < stamps
                  const isRewardSpot = index === SALON_CONFIG.totalStampsNeeded - 1
                  return (
                    <div
                      key={index}
                      className={`relative flex aspect-square items-center justify-center rounded-xl border ${
                        filled
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : isRewardSpot
                          ? 'border-amber-300/80 bg-amber-50/40'
                          : 'border-zinc-100 bg-zinc-50/50'
                      }`}
                    >
                      <span
                        className={`absolute left-2 top-1.5 text-[8px] font-mono ${
                          filled ? 'text-zinc-500' : 'text-zinc-300'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      {filled ? (
                        <Check className="size-3.5 stroke-[2.5]" />
                      ) : isRewardSpot ? (
                        <Crown className="size-3.5 text-amber-800" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-zinc-200" />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-zinc-100">
                <motion.div
                  animate={{ width: `${(stamps / SALON_CONFIG.totalStampsNeeded) * 100}%` }}
                  className="h-full rounded-full bg-zinc-900"
                />
              </div>
            </section>

            <section className="mt-4 flex flex-col gap-2.5">
              <a
                href={SALON_CONFIG.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-xs font-medium text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.99]"
              >
                <Calendar className="size-3.5" /> Schedule Next Appointment
              </a>

              <button
                onClick={() => setView('scan_filter')}
                className="py-1 text-center text-xs text-zinc-400 hover:text-zinc-600"
              >
                Simulate QR Code Scan
              </button>
            </section>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="pt-4 text-center border-t border-zinc-200/60">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400">
            {SALON_CONFIG.name} · Digital Pass
          </p>
        </footer>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-900/20 p-4 backdrop-blur-xs sm:items-center"
          >
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              className="w-full max-w-xs rounded-2xl border border-zinc-200/80 bg-white p-5 text-center shadow-lg"
            >
              <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-900 text-white">
                <BadgeCheck className="size-5" />
              </span>

              <h2 className="mt-3 text-sm font-medium text-zinc-900">
                {isFirstJoin ? `Welcome, ${userName}` : `Welcome back, ${userName || 'Guest'}`}
              </h2>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                {stamps === 0
                  ? 'Your reward has been redeemed.'
                  : `${SALON_CONFIG.totalStampsNeeded - stamps} visit${
                      SALON_CONFIG.totalStampsNeeded - stamps === 1 ? '' : 's'
                    } remaining until your complimentary treatment.`}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={SALON_CONFIG.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-zinc-900 py-2.5 text-xs font-medium text-white shadow-xs"
                >
                  Book Appointment
                </a>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="py-1 text-xs text-zinc-400 hover:text-zinc-600"
                >
                  View Digital Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
