import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import closeIcon from '../../assets/materials/close.svg'
import documentSourceIcon from '../../assets/materials/document-source.svg'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * UploadMaterialModal — "Popup Upload Materials".
 *
 * 774px max-width surface, white with a 2px ink border, 12px radius, 32px
 * gutters. The header carries the title and supporting copy; the single
 * "Document" source card opens the file picker. Selecting a file closes the
 * modal — the page owns the upload, progress and error states. Width, padding
 * and type step down below 768px.
 */
export default function UploadMaterialModal({ isOpen, onClose, onChooseFile }) {
  const dialogRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    lastFocusedRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
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
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="animate-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-[#171916]/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-material-modal-title"
        aria-describedby="upload-material-modal-description"
        tabIndex={-1}
        className="animate-modal-card flex max-h-[calc(100vh-32px)] w-full max-w-[774px] flex-col overflow-y-auto rounded-[12px] border-2 border-solid border-[#171916] bg-[#f7f7f2] px-5 pt-6 pb-7 outline-none md:px-8 md:pt-8 md:pb-9"
      >
        <div className="flex w-full flex-col gap-1">
          {/* Fixed height so the 36px close hit target does not stretch the title row. */}
          <div className="flex h-7 w-full items-center justify-between md:h-8">
            <h2
              id="upload-material-modal-title"
              className="text-[22px] leading-[28px] font-black text-[#171916] md:text-[26px] md:leading-[32px]"
            >
              Create New Note
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-2 border-transparent transition-colors hover:border-[#171916] hover:bg-[#d5f35b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]"
            >
              <img src={closeIcon} alt="" className="size-5" />
            </button>
          </div>

          <p
            id="upload-material-modal-description"
            className="text-[16px] leading-[22px] font-medium text-[#62665c] md:text-[19px] md:leading-[26px]"
          >
            Select a source material to generate notes
          </p>
        </div>

        <div className="mt-7 w-[700px] max-w-full px-1 md:mt-9">
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
        </div>
      </div>
    </div>,
    document.body,
  )
}