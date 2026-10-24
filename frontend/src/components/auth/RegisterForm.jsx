import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function RegisterForm({
  onRegister,
  onGoogleSignIn,
  onBackToLogin,
  isSubmitting = false,
  formError,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isSubmitting) onRegister({ ...formData, password_confirmation: formData.password })
  }

  const inputClass =
    'h-14 w-full rounded-[8px] border-2 border-[#181916] bg-white px-4 text-[15px] font-black leading-normal text-[#181916] outline-none placeholder:text-[#8A8D94] transition-colors focus:border-[#D5F35B]'

  return (
    <section className="flex w-full flex-col items-center" aria-label="Register form">
      <div className="flex w-[430px] max-w-full flex-col gap-8">
        <div className="flex w-full flex-col gap-3">
          <h2 className="m-0 text-[42px] font-black leading-[50.4px] text-[#181916]">
            Get started
          </h2>
          <p className="text-[15px] font-black leading-[23.25px] text-[#62645A]">
            Enter your details to create your new account
          </p>
        </div>

        <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          {formError && <p className="text-[13px] font-black text-[#b42318]">{formError}</p>}

          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-2 text-[13px] font-black text-[#181916]">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your name" className={inputClass} />
            </div>

            <div className="flex flex-col gap-2 text-[13px] font-black text-[#181916]">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
            </div>

            <div className="flex flex-col gap-2 text-[13px] font-black text-[#181916]">
              <label htmlFor="password">Password</label>
              <span className="relative block h-14 w-full">
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" minLength={8} required value={formData.password} onChange={handleChange} placeholder="Enter your password" className={`pr-12 ${inputClass}`} />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#62665C]" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} strokeWidth={1.8} /> : <Eye size={20} strokeWidth={1.8} />}
                </button>
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <button type="submit" disabled={isSubmitting} className="flex h-[56px] w-full items-center justify-center gap-2 rounded-full border-2 border-[#181916] bg-[#181916] px-6 text-[15px] font-black text-[#F8F6EF] transition-all hover:bg-[#2a2d26] active:scale-[0.99] disabled:opacity-60">
              {isSubmitting && <span className="size-4 animate-spin rounded-full border-2 border-[#F8F6EF] border-t-transparent" />}
              {isSubmitting ? 'Registering…' : 'Register'}
            </button>

            <div className="flex items-center gap-3 text-[12px] font-black text-[#62645A]">
              <span className="h-px flex-1 bg-[#181916]" /> or <span className="h-px flex-1 bg-[#181916]" />
            </div>

            <button type="button" onClick={onGoogleSignIn} className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[8px] border-2 border-[#181916] bg-white px-6 text-[15px] font-black text-[#181916] transition-all hover:bg-[#F8F6EF] active:scale-[0.99]">
              <span className="text-[17px] font-black text-[#4285F4]">G</span>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-[13px] font-black text-[#62645A]">
            Already have a account?{' '}
            <button type="button" onClick={onBackToLogin} className="text-[#181916]">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </section>
  )
}

export default RegisterForm