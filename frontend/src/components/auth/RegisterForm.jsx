import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function RegisterForm({ onRegister, onGoogleSignIn, onBackToLogin, isSubmitting = false, formError }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSubmitting) return

    onRegister({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password,
    })
  }

  return (
    <section
      data-responsive="register-form"
      className="flex w-full flex-col items-center"
      aria-label="Register form"
    >
      <div className="flex w-[430px] max-w-full flex-col gap-8">
        <div className="flex w-full shrink-0 flex-col gap-3">
          <h2 className="m-0 text-[32px] font-semibold leading-[38px] text-[#17191f] min-[1024px]:text-[42px] min-[1024px]:leading-[50px]">
            Get started
          </h2>
          <p className="text-[15px] font-normal leading-[23px] text-[#686b73]">
            Enter your details to create your new account.
          </p>
        </div>

        <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          {formError && (
            <p className="text-[13px] font-medium leading-4 text-[#b42318]" role="alert">
              {formError}
            </p>
          )}

          <div className="flex w-full flex-col gap-4">
            <label className="flex flex-col gap-2 text-[13px] font-medium leading-4 text-[#17191f]">
              <span>Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="h-14 w-full rounded-[12px] border border-[#dad9d4] bg-white px-4 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] focus:border-[#03f]"
              />
            </label>

            <label className="flex flex-col gap-2 text-[13px] font-medium leading-4 text-[#17191f]">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="h-14 w-full rounded-[12px] border border-[#dad9d4] bg-white px-4 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] focus:border-[#03f]"
              />
            </label>

            <label className="flex flex-col gap-2 text-[13px] font-medium leading-4 text-[#17191f]">
              <span>Password</span>
              <span className="relative block h-14 w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="h-14 w-full rounded-[12px] border border-[#dad9d4] bg-white px-4 pr-12 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] focus:border-[#03f]"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[#686b73]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </span>
            </label>
          </div>

          <div className="flex w-full flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[12px] border-0 bg-[#03f] px-6 text-[15px] font-semibold leading-normal text-white disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#2652ff] hover:shadow-md active:translate-y-0 cursor-pointer"
            >
              {isSubmitting && (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              )}
              {isSubmitting ? 'Registering…' : 'Register'}
            </button>

            <div className="flex items-center gap-3 text-[12px] leading-[normal] text-[#686b73]" aria-label="Or continue with another method">
              <span className="h-px flex-1 bg-[#dad9d4]" />
              <span>or</span>
              <span className="h-px flex-1 bg-[#dad9d4]" />
            </div>

            <button
              type="button"
              onClick={onGoogleSignIn}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-[12px] border border-[#dad9d4] bg-white px-6 text-[15px] font-medium text-[#17191f] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f5f5f2] hover:border-[#c8c7c2] hover:shadow-md active:translate-y-0"
            >
              <span className="text-[16px] font-semibold text-[#4285f4]">G</span>
              Continue with Google
            </button>
          </div>

          <p className="w-full text-center text-[13px] font-normal leading-4 text-[#686b73]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="border-0 bg-transparent p-0 text-[13px] font-semibold leading-4 text-[#03f] cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </section>
  )
}

export default RegisterForm