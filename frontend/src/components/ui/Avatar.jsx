import { useEffect, useState } from 'react'

/**
 * Avatar — photo or initials circle.
 * Design: Simple Design System / Avatar (Initial, Large) — 40px circle.
 * Initials should be single characters where possible (per Figma docs).
 * Kalau `src` ada dan berhasil load, tampil foto; kalau tidak, fallback ke inisial.
 */
function initialsFrom(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase()
}

export default function Avatar({ name, initials, src, size = 40, className = '' }) {
  const [failed, setFailed] = useState(false)
  const label = initials || initialsFrom(name)

  // reset status error kalau src berubah (mis. habis upload foto baru)
  useEffect(() => {
    setFailed(false)
  }, [src])

  const showImage = src && !failed

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f2f1ec] text-[13px] font-medium text-[#17191f] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={showImage ? undefined : 'true'}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || ''}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer" // penting buat foto googleusercontent
          onError={() => {
  console.log('avatar gagal load:', src)
  setFailed(true)
}}
        />
      ) : (
        label
      )}
    </span>
  )
}