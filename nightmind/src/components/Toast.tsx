import { create } from 'zustand'
import { AnimatePresence, motion } from 'framer-motion'
import { useMotionProfile } from '../lib/motion'

type ToastState = { message: string | null; show: (m: string) => void; clear: () => void }

const useToast = create<ToastState>((set) => ({
  message: null,
  show: (message) => {
    set({ message })
    window.setTimeout(() => set((s) => (s.message === message ? { message: null } : s)), 2600)
  },
  clear: () => set({ message: null }),
}))

/** Buttons name the action literally and keep the same word through the flow. */
export const toast = (message: string) => useToast.getState().show(message)

export function ToastHost() {
  const message = useToast((s) => s.message)
  const m = useMotionProfile()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[104px] z-[60] flex justify-center px-margin md:bottom-8 md:pl-[88px] xl:pl-[240px]"
    >
      <AnimatePresence>
        {message ? (
          <motion.div
            key={message}
            initial={m.full ? { opacity: 0, y: 8 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={m.t(180)}
            className="rounded-full border border-outline-variant bg-high px-5 py-3 t-label-caps text-on-surface"
          >
            {message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
