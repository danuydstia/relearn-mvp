import { useEffect, useRef } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import Button from './Button.jsx'

/**
 * ModalAlert — dialog modal alert untuk notifikasi status (sukses, error, info).
 * Didesain selaras dengan token warna Re:Learn (#17191f, #686b73, #edf7f1, #217353).
 */
export default function ModalAlert({
  isOpen,
  onClose,
  onConfirm,
  title = 'Berhasil',
  description = '',
  confirmText = 'Kembali ke Profil',
  cancelText = 'Tetap di Sini',
  type = 'success',
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    modalRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isSuccess = type === 'success'
  const isError = type === 'error'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17191f]/40 backdrop-blur-[2px] animate-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-alert-title"
        aria-describedby={description ? 'modal-alert-desc' : undefined}
        tabIndex={-1}
        className="relative flex w-full max-w-[420px] flex-col items-center rounded-[16px] border border-solid border-[#dad9d4] bg-white p-6 md:p-8 text-center shadow-[0_16px_36px_rgba(23,25,31,0.12)] outline-none animate-modal-card"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-[6px] text-[#686b73] transition-colors hover:bg-[#f8f7f3] hover:text-[#17191f] cursor-pointer"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        )}

        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess
              ? 'bg-[#edf7f1] text-[#217353]'
              : isError
                ? 'bg-[#fff5f2] text-[#b42318]'
                : 'bg-[#eef1ff] text-[#0033ff]'
          }`}
        >
          {isSuccess && <CheckCircle2 size={36} strokeWidth={2} aria-hidden="true" />}
          {isError && <AlertCircle size={36} strokeWidth={2} aria-hidden="true" />}
          {!isSuccess && !isError && <Info size={36} strokeWidth={2} aria-hidden="true" />}
        </div>

        <h3
          id="modal-alert-title"
          className="text-[20px] font-semibold leading-[1.3] text-[#17191f]"
        >
          {title}
        </h3>

        {description && (
          <p
            id="modal-alert-desc"
            className="mt-2 text-[14px] leading-[1.5] font-normal text-[#686b73]"
          >
            {description}
          </p>
        )}

        <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row-reverse sm:gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm || onClose}
            className="w-full sm:flex-1"
          >
            {confirmText}
          </Button>

          {cancelText && (
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:flex-1"
            >
              {cancelText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

