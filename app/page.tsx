'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CalendarDays, Check, Crown, Gift, LogIn, QrCode, Sparkles, UserPlus } from 'lucide-react'

const SALON_CONFIG = {
  name: 'Maison Noir',
  accent: '#D4AF37',
  logo: 'MN',
  bookingUrl: 'https://example.com/book',
  masterPin: '1234',
}

type ViewState = 'scan_filter' | 'join_form' | 'stamp_form' | 'passport'

export default function Page() {
  const [view, setView] = useState<ViewState>('scan_filter')
  
  // Client Data
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [stamps, setStamps] = useState(0)
  const [isFirstJoin, setIsFirstJoin] = useState(false)
  
  // Security & Modals
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // 1. First-time client registration flow
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName || !phone) return
    setIsFirstJoin(true) // Marks this as a brand new user
    setStamps(1)
    setShowSuccessModal(true)
    setView('passport')
  }

  // 2. Returning client visit / stamp flow
  const handleStampSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setIsFirstJoin(false) // Returning client

    // Reward redemption check on 6th visit
    if (stamps === 5) {
      if (pin !== SALON_CONFIG.masterPin) {
        setPinError(true)
        return
      }
      setStamps(0)
      setPin('')
      setPinError(false)
    } else {
      setStamps((prev) => Math.min(5, prev + 1))
    }

    setShowSuccessModal(true)
    setView('passport')
  }

  return (
    <main style={{ '--accent': SALON_CONFIG.accent } as React.CSSProperties} className="min-h-screen bg-[#121212] px-4 py-5 text-[#f6f0e5] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-md flex-col">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-4 py-2">
          <div className="flex items-center gap-3 text-left">
            <span className="flex size-11 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-sm font-semibold tracking-[0.2em] text-[var(--accent)]">
              {SALON_CONFIG.logo}
            </span>
            <div>
              <span className="block text-[15px] font-medium tracking-wide">{SALON_CONFIG.name}</span>
              <span className="text-xs text-[#9c958b]">Digital Loyalty Pass</span>
            </div>
          </div>
        </header>

        {/* VIEW 1: INITIAL QR SCAN FILTER (Only opened via counter QR scan) */}
        {view === 'scan_filter' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 rounded-[28px] border border-white/[0.08] bg-[#1a1a1a] p-6 shadow-2xl">
            <div className="text-center">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                <QrCode className="size-7" />
              </span>
              <h1 className="text-2xl font-light text-white">Welcome to <span className="font-medium">{SALON_CONFIG.name}</span></h1>
              <p className="mt-2 text-xs text-[#9c958b]">Select an option below to collect today's stamp</p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button onClick={() => setView('join_form')} className="flex items-center justify-between rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-5 text-left transition hover:bg-[var(--accent)]/20">
                <div className="flex items-center gap-4">
                  <UserPlus className="size-6 text-[var(--accent)]" />
                  <div>
                    <p className="text-base font-medium text-white">Join Loyalty Program</p>
                    <p className="text-xs text-[#9c958b]">First time here? Register in seconds</p>
                  </div>
                </div>
              </button>

              <button onClick={() => setView('stamp_form')} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:bg-white/[0.06]">
                <div className="flex items-center gap-4">
                  <LogIn className="size-6 text-[#c4bcae]" />
                  <div>
                    <p className="text-base font-medium text-white">Returning Client / Stamp Card</p>
                    <p className="text-xs text-[#9c958b]">Already joined? Enter phone to stamp</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: JOIN FORM (New Client) */}
        {view === 'join_form' && (
          <motion.form onSubmit={handleJoinSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[28px] border border-white/[0.08] bg-[#1a1a1a] p-6 shadow-2xl">
            <h2 className="text-xl font-medium text-white">New Client Registration</h2>
            <p className="mt-1 text-xs text-[#9c958b]">Fill in your details once to receive your first stamp.</p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-[#9c958b]">
                First Name
                <input required value={userName} onChange={(e) => setUserName(e.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="e.g. Sarah" />
              </label>

              <label className="flex flex-col gap-2 text-xs text-[#9c958b]">
                Phone Number
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="(555) 012-3456" />
              </label>

              <button type="submit" className="mt-2 rounded-xl bg-[var(--accent)] py-4 text-sm font-semibold text-[#17130b]">
                Register & Get Stamp #1
              </button>
              
              <button type="button" onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-[#756d61] hover:text-white">
                ← Back to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 3: STAMP FORM (Returning Client) */}
        {view === 'stamp_form' && (
          <motion.form onSubmit={handleStampSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[28px] border border-white/[0.08] bg-[#1a1a1a] p-6 shadow-2xl">
            <h2 className="text-xl font-medium text-white">{stamps === 5 ? 'Redeem VIP Reward' : 'Stamp Loyalty Card'}</h2>
            <p className="mt-1 text-xs text-[#9c958b]">{stamps === 5 ? 'Staff master PIN required to redeem.' : 'Enter your phone number to collect today\'s stamp.'}</p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-[#9c958b]">
                Phone Number
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder="(555) 012-3456" />
              </label>

              {stamps === 5 && (
                <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4">
                  <Sparkles className="mb-1 size-5 text-[var(--accent)]" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Reward Unlocked: $20 Off Service</p>
                  <label className="mt-3 flex flex-col gap-1.5 text-xs text-[#9c958b]">
                    Enter 4-Digit Staff PIN
                    <input type="password" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value); setPinError(false); }} className={`rounded-lg border ${pinError ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/[0.04]'} px-3 py-2 text-center text-white outline-none`} placeholder="••••" />
                  </label>
                  {pinError && <p className="mt-1 text-[11px] text-red-400">Incorrect staff PIN. Try again.</p>}
                </div>
              )}

              <button type="submit" className="mt-2 rounded-xl bg-[var(--accent)] py-4 text-sm font-semibold text-[#17130b]">
                {stamps === 5 ? 'Verify & Redeem Reward' : 'Collect Today\'s Stamp'}
              </button>

              <button type="button" onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-[#756d61] hover:text-white">
                ← Back to options
              </button>
            </div>
          </motion.form>
        )}

        {/* VIEW 4: DIGITAL PASSPORT (Card View) */}
        {view === 'passport' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col">
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#9c958b]">Loyalty Passport</p>
                <h1 className="mt-1 text-2xl font-light tracking-tight">
                  {isFirstJoin ? (
                    <>Welcome, <span className="font-medium">{userName || 'Valued Guest'}</span></>
                  ) : (
                    <>Welcome back, <span className="font-medium">{userName || 'Valued Guest'}</span></>
                  )}
                </h1>
              </div>
              <span className="flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)]">
                <Gift className="size-3.5" /> Active Card
              </span>
            </div>

            {/* Stamp Progress Display */}
            <section className="mt-5 rounded-[28px] border border-white/[0.08] bg-[#1a1a1a] p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9c958b]">Your Progress</p>
                  <p className="mt-1 text-sm text-[#e7dfd2]">
                    {stamps < 5 ? `${5 - stamps} visit${5 - stamps === 1 ? '' : 's'} away from your VIP reward` : 'VIP Reward Unlocked!'}
                  </p>
                </div>
                <span className="text-3xl font-light text-[var(--accent)]">{stamps}<span className="text-lg text-[#756d61]">/5</span></span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }, (_, index) => {
                  const filled = index < stamps
                  const reward = index === 5
                  return (
                    <div key={index} className={`relative flex aspect-square items-center justify-center rounded-2xl border ${filled ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10' : reward ? 'border-[var(--accent)]/20 bg-[#211e17]' : 'border-white/10 bg-white/[0.025]'}`}>
                      <span className="absolute left-2.5 top-2 text-[10px] text-[#756d61]">0{index + 1}</span>
                      {filled ? (
                        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--accent)] text-[#1a160d]"><Check className="size-5" /></span>
                      ) : reward ? (
                        <Crown className="size-5 text-[var(--accent)]" />
                      ) : (
                        <span className="size-2 rounded-full bg-white/10" />
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div animate={{ width: `${(stamps / 5) * 100}%` }} className="h-full rounded-full bg-[var(--accent)]" />
              </div>
            </section>

            {/* Primary Action Button */}
            <section className="mt-6 flex flex-col gap-3">
              <a href={SALON_CONFIG.bookingUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-4 text-sm font-semibold text-[#17130b] shadow-lg shadow-[var(--accent)]/10 transition hover:opacity-95">
                <CalendarDays className="size-4" /> Book Next Visit
              </a>

              <button onClick={() => setView('scan_filter')} className="py-2 text-center text-xs text-[#756d61] hover:text-[#9c958b]">
                Simulate Counter QR Scan
              </button>
            </section>
          </motion.div>
        )}

        <p className="mt-auto pt-8 text-center text-[10px] uppercase tracking-[0.2em] text-[#5f594f]">
          Secure Digital Pass · {SALON_CONFIG.name}
        </p>
      </div>

      {/* SUCCESS MODAL ON STAMP COLLECTION */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center">
            <motion.div initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-sm rounded-[28px] border border-[var(--accent)]/30 bg-[#1a1a1a] p-6 text-center shadow-2xl">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-[#17130b]">
                <BadgeCheck className="size-8" />
              </span>
              
              <h2 className="mt-5 text-xl font-medium">
                {isFirstJoin ? `Welcome, ${userName}!` : `Welcome back, ${userName || 'Valued Guest'}!`}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#9c958b]">
                {stamps === 0 
                  ? 'Your VIP reward has been redeemed!' 
                  : `You're ${5 - stamps} visit${5 - stamps === 1 ? '' : 's'} away from your VIP reward!`}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <a href={SALON_CONFIG.bookingUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[#17130b]">
                  Book Next Appointment
                </a>
                <button onClick={() => setShowSuccessModal(false)} className="rounded-xl border border-white/10 py-3 text-sm text-[#9c958b] hover:text-white">
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
