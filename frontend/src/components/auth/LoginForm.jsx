import { useState } from 'react'
import { EyeOff } from 'lucide-react'
import eyeIcon from '../../assets/eye.svg'

function firstMessage(error) {
  if (Array.isArray(error)) return error[0]
  return error
}

function LoginForm({
  onLogin,
  onForgotPassword,
  onGoogleSignIn,
  onCreateAccount,
  isSubmitting = false,
  fieldErrors = {},
  formError,
  successMessage,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const emailError = firstMessage(fieldErrors?.email)
  const passwordError = firstMessage(fieldErrors?.password)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isSubmitting) onLogin?.({ ...formData })
  }

  return (
    <section
      data-responsive="login-form"
      className="flex w-full flex-col items-center"
      aria-label="Login form"
    >
      <div className="flex w-full max-w-[430px] shrink-0 flex-col gap-3">
        <div data-responsive="introduction" className="flex min-h-[85px] w-full shrink-0 flex-col gap-3">
          <h2 className="m-0 text-[32px] font-semibold leading-[38px] text-[#17191f] min-[1024px]:text-[42px] min-[1024px]:leading-[50px]">
            Welcome back!
          </h2>
          <p className="text-[15px] font-normal leading-[23px] text-[#686b73]">
            Your next learning session starts here.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-8"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
        >
          {formError && (
            <p className="text-[13px] font-medium leading-4 text-[#b42318]" role="alert">
              {formError}
            </p>
          )}
          {successMessage && (
            <p className="text-[13px] font-medium leading-4 text-[#067647]" role="status">
              {successMessage}
            </p>
          )}

          <div className="flex w-full flex-col gap-4">
            <div
              className={`flex flex-col gap-2 text-[13px] font-medium leading-4 text-[#17191f] ${emailError ? 'h-auto' : 'h-20'}`}
            >
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'login-email-error' : undefined}
                className={`h-14 w-full rounded-[12px] border bg-white px-4 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] focus:border-[#03f] ${emailError ? 'border-[#b42318]' : 'border-[#dad9d4]'}`}
              />
              {emailError && (
                <span id="login-email-error" className="text-[11px] font-normal leading-4 text-[#b42318]" role="alert">
                  {emailError}
                </span>
              )}
            </div>

            <div
              className={`flex flex-col gap-2 text-[13px] font-medium leading-4 text-[#17191f] ${passwordError ? 'h-auto' : 'h-20'}`}
            >
              <label htmlFor="login-password">Password</label>
              <span className="relative block h-14 w-full">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? 'login-password-error' : undefined}
                  className={`h-14 w-full rounded-[12px] border bg-white px-4 pr-12 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] focus:border-[#03f] ${passwordError ? 'border-[#b42318]' : 'border-[#dad9d4]'}`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.5} className="text-[#686b73]" />
                  ) : (
                    <img src={eyeIcon} alt="" className="size-5" />
                  )}
                </button>
              </span>
              {passwordError && (
                <span id="login-password-error" className="text-[11px] font-normal leading-4 text-[#b42318]" role="alert">
                  {passwordError}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onForgotPassword}
              className="h-4 w-full border-0 bg-transparent p-0 text-right text-[13px] font-medium leading-4 text-[#03f]"
            >
              Forgot password?
            </button>
          </div>

          <div className="flex w-full flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 w-full items-center justify-center rounded-[12px] border-0 bg-[#03f] px-6 text-[15px] font-semibold leading-normal text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#2652ff] hover:shadow-md active:translate-y-0 cursor-pointer"
            >
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
            <div
              className="flex h-[15px] w-full items-center gap-3 text-[12px] font-normal leading-[15px] text-[#686b73]"
              aria-label="Or continue with another method"
            >
              <span className="h-px min-w-0 flex-1 bg-[#dad9d4]" />
              <span>or</span>
              <span className="h-px min-w-0 flex-1 bg-[#dad9d4]" />
            </div>
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-[12px] border border-[#dad9d4] bg-white px-6 text-[15px] font-medium leading-normal text-[#17191f] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f5f5f2] hover:border-[#c8c7c2] hover:shadow-md active:translate-y-0"
            >
              <span className="w-[19px] text-center text-[17px] font-semibold text-[#4285f4]">
                G
              </span>
              Continue with Google
            </button>
          </div>

          <p className="w-full text-center text-[13px] font-normal leading-4 text-[#686b73]">
            New to Re:Learn?{' '}
            <button
              type="button"
              onClick={onCreateAccount}
              className="border-0 bg-transparent p-0 text-[13px] font-semibold leading-4 text-[#03f]"
            >
              Create an account.
            </button>
          </p>
        </form>
      </div>
    </section>
  )
}

export default LoginForm
