import Avatar from '../ui/Avatar.jsx'

/**
 * IdentityPreview — "Identity preview" (design 60:9221).
 *
 * The right-hand column of Edit Profile: shows the name and avatar the way the
 * Profile screen will, between two hairlines. Removed below 768px, where the
 * design drops the column entirely.
 */
export default function IdentityPreview({ name, src }) { // Tambahkan src di sini
  return (
    <div className="flex w-full flex-col gap-4 pt-2">
      <p className="w-full text-[20px] leading-[1.5] font-normal text-[#17191f]">
        Profile preview
      </p>

      <div className="flex w-full items-center gap-4 border-y border-solid border-[#dad9d4] py-6">
        {/* Tambahkan src di sini */}
        <Avatar name={name} src={src} /> 
        
        <p className="min-w-px flex-1 truncate text-[22px] leading-[1.5] font-semibold text-[#17191f]">
          {name}
        </p>
      </div>

      <p className="w-full text-[13px] leading-[1.5] font-normal text-[#686b73]">
        Your name and avatar, as shown on your profile.
      </p>
    </div>
  )
}

