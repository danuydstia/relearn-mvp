import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import Avatar from '../components/ui/Avatar.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import IdentityPreview from '../components/profile/IdentityPreview.jsx'
import { useAuth } from '../contexts/AuthContext'

/**
 * EditProfilePage — "Re:Learn · Edit Profile" (design 60:9127 desktop,
 * 60:8281 at 375, 60:8131 at 320).
 *
 * A 600px form card beside a 500px live preview. The preview column only fits
 * once the bounded 1128px content column is reached (≥1440px viewport); below
 * that the row wraps, and on mobile it is dropped entirely — as designed.
 *
 * Three states come from the design's proposal sheet (60:9249):
 * - Empty name: red field, "Enter a name to continue.", Save unavailable.
 * - Saved: a "Profile updated" pill above the identity header, then return to
 *   Profile.
 * - Failed: the shared error card, keeping the entered name on screen.
 */
export default function EditProfilePage() {
  const { user, updateProfile, updateAvatar } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const redirectRef = useRef(null)

  const fileRef = useRef(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState('')

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    },
    [avatarPreview],
  )

  const trimmed = name.trim()
  const isValid = trimmed.length > 0
  const showFieldError = touched && !isValid
  const previewName = trimmed || user?.name || 'Student'

  useEffect(() => () => clearTimeout(redirectRef.current), [])

  const handleAvatarFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // biar bisa pilih file yang sama lagi
    if (!file) return
    if (!file.type.startsWith('image/')) return setAvatarError('File harus berupa gambar.')
    if (file.size > 2 * 1024 * 1024) return setAvatarError('Ukuran maksimal 2MB.')
    setAvatarError('')
    setAvatarFile(file) // disimpan dulu, di-upload saat Save
    setAvatarPreview(URL.createObjectURL(file))
  }

  const submit = async () => {
    setTouched(true)
    if (!isValid || submitting) return

    setSubmitting(true)
    setError('')
    try {
      await updateProfile({ name: trimmed })
      if (avatarFile) {
        await updateAvatar(avatarFile)
        setAvatarFile(null)
        setAvatarPreview(null)
      }
      setSaved(true)
      redirectRef.current = setTimeout(() => navigate('/profile'), 1200)
    } catch (err) {
      const res = err.response
      const first = res?.data?.errors?.name?.[0] || res?.data?.errors?.avatar?.[0]
      setError(first || res?.data?.message || "Your profile couldn't be saved.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-col px-6 pt-7 pb-8 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="flex w-full max-w-[1128px] flex-col gap-8">
        <div className="flex w-full flex-col gap-2">
          <h1 className="w-full text-[28px] leading-[1.5] font-semibold text-[#17191f] lg:text-[32px]">
            Edit Profile
          </h1>
          <p className="w-full text-[14px] leading-[1.5] font-normal text-[#686b73]">
            Update your name and avatar.
          </p>
          <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">
            Proposed editing · Design preview
          </p>
        </div>

        {saved && (
          <p
            role="status"
            className="flex self-start rounded-[6px] bg-[#edf7f1] px-2 py-[3px] text-[11px] leading-[1.5] font-normal whitespace-nowrap text-[#217353]"
          >
            Profile updated
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="flex w-full flex-col items-start gap-3 rounded-[12px] border border-solid border-[#dad9d4] bg-[#fff5f2] p-5"
          >
            <div className="flex w-full items-start gap-3">
              <CircleAlert
                size={20}
                strokeWidth={1.75}
                className="shrink-0 text-[#b42318]"
                aria-hidden="true"
              />
              <div className="flex min-w-px flex-1 flex-col gap-[5px] leading-[1.5]">
                <p className="w-full text-[13px] font-medium text-[#17191f]">
                  Your profile couldn&rsquo;t be saved.
                </p>
                <p className="w-full text-[11px] font-normal text-[#686b73]">
                  Your edits are still here. Try saving again.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={submit} disabled={submitting}>
              Try again
            </Button>
          </div>
        )}

        {/* Identity editing — the preview wraps below the form until there is
            room for its designed 500px width. */}
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-wrap lg:items-start lg:gap-7">
          <form
            className="w-full lg:w-[600px] lg:shrink-0"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
            aria-busy={submitting}
          >
            <Card className="flex w-full flex-col gap-6 p-5 md:p-6">
              <div className="flex w-full flex-col gap-3">
                <p className="w-full text-[13px] leading-[1.5] font-medium text-[#17191f]">
                  Avatar
                </p>
                <div className="flex w-full items-center gap-4">
                  <Avatar name={previewName} src={avatarPreview || user?.avatar_url} size={52} />
                  <div className="flex min-w-px flex-1 flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={submitting}
                      className="flex h-11 items-center self-start text-[13px] leading-[normal] font-medium text-[#0033ff] transition-colors hover:text-[#0026cc] hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Change avatar
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarFile}
                    />
                    {avatarError ? (
                      <p role="alert" className="text-[11px] leading-[1.5] font-normal text-[#a53932]">
                        {avatarError}
                      </p>
                    ) : (
                      <p className="text-[11px] leading-[1.5] font-normal text-[#686b73]">
                        {avatarFile
                          ? 'Foto baru akan disimpan saat kamu klik Save'
                          : 'Optional · JPG, PNG, atau WebP, maks 2MB'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px w-full shrink-0 bg-[#dad9d4]" />

              <div className="flex w-full flex-col gap-2">
                <label
                  htmlFor="profile-name"
                  className="w-full text-[13px] leading-[1.5] font-medium text-[#17191f]"
                >
                  Name
                </label>
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    setError('')
                  }}
                  onBlur={() => setTouched(true)}
                  placeholder="Enter your name"
                  aria-required="true"
                  aria-invalid={showFieldError}
                  aria-describedby={showFieldError ? 'profile-name-error' : 'profile-name-guidance'}
                  className={`h-14 w-full rounded-[12px] border border-solid bg-[#f2f1ec] px-4 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] ${
                    showFieldError
                      ? 'border-[#a53932]'
                      : 'border-[#dad9d4] focus:border-[#0033ff]'
                  }`}
                />
                {showFieldError ? (
                  <p
                    id="profile-name-error"
                    role="alert"
                    className="w-full text-[11px] leading-[1.5] font-normal text-[#a53932]"
                  >
                    Enter a name to continue.
                  </p>
                ) : (
                  <p
                    id="profile-name-guidance"
                    className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]"
                  >
                    The name shown in your learning space.
                  </p>
                )}
              </div>

              {/* Actions stack on mobile and sit side by side from 768px. */}
              <div className="flex w-full flex-col gap-3 md:flex-row">
                <Button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="w-full md:w-[144px]"
                >
                  Save
                </Button>
                <Button
                  as={Link}
                  to="/profile"
                  variant="secondary"
                  className="w-full md:w-[144px]"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </form>

          <div className="hidden min-w-px flex-1 lg:block">
            <IdentityPreview 
              name={previewName} 
              src={avatarPreview || user?.avatar_url} 
            />
          </div>
        </div>

        <p className="w-full text-[11px] leading-[1.5] font-normal text-[#686b73]">
          Example student data · For design review only
        </p>
      </div>
    </div>
  )
}