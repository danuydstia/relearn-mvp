import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, FileWarning } from 'lucide-react'
import closeIcon from '../../assets/materials/close.svg'
import documentSourceIcon from '../../assets/materials/document-source.svg'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * UploadMaterialModal — "Popup Upload Materials" dengan state Loading & Error.
 */
export default function UploadMaterialModal({ 
  isOpen, 
  onClose, 
  onChooseFile,
  uploading = false,
  uploadingName = '',
  uploadError = ''
}) {
  const dialogRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // --- Animasi Fake Progress saat AI Memproses ---
  const [fakeProgress, setFakeProgress] = useState(0)
  const [stepText, setStepText] = useState('Mengunggah dokumen...')

  useEffect(() => {
    let interval
    if (uploading) {
      setFakeProgress(0)
      setStepText('Mengunggah dokumen...')
      
      interval = setInterval(() => {
        setFakeProgress((prev) => {
          if (prev >= 95) return 95 // Berhenti di 95% sampai API selesai
          
          const jump = Math.random() * 6 + 2
          const next = Math.min(prev + jump, 95)
          
          if (next > 25 && next <= 60) setStepText('AI membaca materi...')
          else if (next > 60) setStepText('Menyusun kurikulum...')
          
          return next
        })
      }, 1200)
    } else {
      setFakeProgress(0)
    }
    return () => clearInterval(interval)
  }, [uploading])

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // --- Focus Trap & Escape Key Logic ---
  useEffect(() => {
    if (!isOpen) return undefined

    lastFocusedRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      // Cegah user menutup modal via ESC jika sedang loading
      if (event.key === 'Escape') {
        event.preventDefault()
        if (!uploading) onCloseRef.current?.()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (document.activeElement === dialogRef.current) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus()
      }
    }
  }, [isOpen, uploading]) // Tambahkan 'uploading' agar trap terupdate

  if (!isOpen) return null

  return createPortal(
    <div
      className="animate-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-[#171916]/50 p-4"
      onMouseDown={(event) => {
        // Jangan tutup modal jika diklik di luar saat sedang loading
        if (event.target === event.currentTarget && !uploading) {
          onClose?.()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-material-modal-title"
        tabIndex={-1}
        className="animate-modal-card flex max-h-[calc(100vh-32px)] w-full max-w-[774px] flex-col overflow-y-auto rounded-[12px] border-2 border-solid border-[#171916] bg-[#f7f7f2] px-5 pt-6 pb-7 outline-none md:px-8 md:pt-8 md:pb-9"
      >
        <div className="flex w-full flex-col gap-1">
          {/* Header */}
          <div className="flex h-7 w-full items-center justify-between md:h-8">
            <h2
              id="upload-material-modal-title"
              className="text-[22px] leading-[28px] font-black text-[#171916] md:text-[26px] md:leading-[32px]"
            >
              {uploading ? 'Generating Notes...' : uploadError ? 'Generation Failed' : 'Create New Note'}
            </h2>

            {/* Sembunyikan tombol Close saat loading agar tidak dibatalkan */}
            {!uploading && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-2 border-transparent transition-colors hover:border-[#171916] hover:bg-[#d5f35b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]"
              >
                <img src={closeIcon} alt="" className="size-5" />
              </button>
            )}
          </div>

          <p className="text-[16px] leading-[22px] font-medium text-[#62665c] md:text-[19px] md:leading-[26px]">
            {uploading 
              ? 'AI is analyzing your material to create a structured learning path.' 
              : uploadError 
                ? 'Terjadi kesalahan saat memproses materi Anda.'
                : 'Select a source material to generate notes'}
          </p>
        </div>

        {/* Area Konten Utama */}
        <div className="mt-7 w-[700px] max-w-full px-1 md:mt-9">
          
          {/* STATE 1: IDLE (Siap Upload) */}
          {!uploading && !uploadError && (
            <button
              type="button"
              onClick={onChooseFile}
              className="flex h-[280px] w-full cursor-pointer flex-col items-center justify-center gap-[10px] rounded-[8px] border-2 border-solid border-[#171916] bg-white p-[22px] text-center transition-colors hover:bg-[#d5f35b]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916] md:h-[346px]"
            >
              <img src={documentSourceIcon} alt="" className="size-16" />
              <span className="flex w-full flex-col items-center">
                <span className="text-[18px] leading-[24px] font-black text-[#171916]">Document</span>
                <span className="text-[14px] leading-[20px] font-medium text-[#62665c]">
                  PDF, DOCX, PPT
                </span>
              </span>
            </button>
          )}

          {/* STATE 2: LOADING (Animasi AI) */}
          {uploading && (
            <div className="flex h-[280px] w-full flex-col items-center justify-center gap-6 rounded-[8px] border-2 border-solid border-[#171916] bg-white p-[22px] md:h-[346px]">
              
              {/* Animasi Neo-Brutalist */}
              <div className="relative flex size-24 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-[16px] border-4 border-[#171916] bg-[#d5f35b] opacity-30"></div>
                <div className="relative flex size-20 rotate-3 items-center justify-center rounded-[16px] border-4 border-solid border-[#171916] bg-[#d5f35b] shadow-[4px_4px_0px_0px_rgba(23,25,22,1)] transition-transform">
                  <Sparkles size={36} className="animate-pulse text-[#171916]" />
                </div>
              </div>

              {/* Teks */}
              <div className="flex w-full flex-col items-center gap-1 text-center">
                <p className="text-[18px] font-black text-[#171916]">AI sedang bekerja</p>
                <p className="w-full max-w-[400px] truncate text-[14px] font-medium text-[#62665c]">
                  {uploadingName || 'Dokumen Anda'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-[500px]">
                <div className="mb-2 flex justify-between text-[12px] font-bold text-[#62665c]">
                  <span>{stepText}</span>
                  <span className="text-[#171916]">{Math.round(fakeProgress)}%</span>
                </div>
                <div className="h-5 w-full overflow-hidden rounded-[6px] border-2 border-solid border-[#171916] bg-white">
                  <div 
                    className="h-full bg-[#d5f35b] transition-all duration-500 ease-out" 
                    style={{ width: `${fakeProgress}%` }} 
                  />
                </div>
              </div>

              <p className="text-center text-[11px] font-medium text-[#62665c]">
                Proses ini memakan waktu 1-3 menit. Jangan tutup halaman ini.
              </p>
            </div>
          )}

          {/* STATE 3: ERROR */}
          {!uploading && uploadError && (
            <div className="flex h-[280px] w-full flex-col items-center justify-center gap-6 rounded-[8px] border-2 border-solid border-[#b42318] bg-[#fff5f2] p-[22px] md:h-[346px]">
              <div className="flex size-20 items-center justify-center rounded-full border-4 border-solid border-[#b42318] bg-white">
                <FileWarning size={36} className="text-[#b42318]" />
              </div>
              
              <div className="flex flex-col items-center gap-1 text-center px-4">
                <p className="text-[18px] font-black text-[#b42318]">Gagal memproses materi</p>
                <p className="text-[14px] font-medium text-[#62665c]">{uploadError}</p>
              </div>

              <button
                type="button"
                onClick={onChooseFile}
                className="mt-2 rounded-[8px] border-2 border-solid border-[#171916] bg-[#d5f35b] px-6 py-2.5 text-[14px] font-black text-[#171916] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Coba Upload Ulang
              </button>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body,
  )
}