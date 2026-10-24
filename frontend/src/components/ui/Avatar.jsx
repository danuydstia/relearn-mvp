import { useEffect, useState } from 'react'

/**
 * Avatar — foto atau inisial.
 * shape="circle" (default, #f2f1ec) dipakai di TopBar;
 * shape="square" (lime, outline ink, radius 8) dipakai di Sidebar.
 * Kalau `src` ada dan berhasil load, tampil foto; kalau tidak, fallback ke inisial.
 */
const SHAPES = {
  circle: 'rounded-full bg-[#f2f1ec]',
  square: 'rounded-[8px] border border-solid border-[#171916] bg-[#d5f35b]',
}

function initialsFrom(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase()
}

export default function Avatar({
  name,
  initials,
  src,
  size = 40,
  shape = 'circle',
  className = '',
}) {
  const [failed, setFailed] = useState(false)
  const label = initials || initialsFrom(name)

  // reset status error kalau src berubah (mis. habis upload foto baru)
  useEffect(() => {
    setFailed(false)
  }, [src])

  const showImage = src && !failed

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden text-[14px] font-black text-[#171916] ${
        SHAPES[shape] ?? SHAPES.circle
      } ${className}`}
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