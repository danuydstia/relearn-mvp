import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function firstMessage(error) {
  if (Array.isArray(error)) return error[0]
  return error
}

/**
 * LoginForm — new theme: bold 2px outlines, pill primary button,
 * #181916 ink, #62665C muted text, #D5F35B accent.
 */
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

  const inputBase =
    'h-14 w-full rounded-[8px] border-2 bg-white px-4 text-[15px] font-black leading-normal text-[#181916] outline-none placeholder:text-[#8A8D94] transition-colors'
  const inputNormal = `${inputBase} border-[#181916] focus:border-[#D5F35B]`
  const inputError = `${inputBase} border-[#b42318] focus:border-[#b42318]`

  return (
    <section
      data-responsive="login-form"
      className="flex w-full flex-col items-center"
      aria-label="Login form"
    >
      <div className="flex w-full max-w-[430px] shrink-0 flex-col">
        {/* Heading */}
        <div className="flex w-full flex-col gap-3">
          <h2 className="m-0 text-[32px] font-black leading-[38px] text-[#181916] min-[1024px]:text-[42px] min-[1024px]:leading-[50.4px]">
            Welcome back!
          </h2>
          <p className="text-[15px] font-black leading-[23.25px] text-[#62665C]">
            Your next learning session starts here.
          </p>
        </div>

        <form
          className="mt-8 flex w-full flex-col gap-8"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
        >
          {formError && (
            <p className="text-[13px] font-black leading-4 text-[#b42318]" role="alert">
              {formError}
            </p>
          )}
          {successMessage && (
            <p className="text-[13px] font-black leading-4 text-[#067647]" role="status">
              {successMessage}
            </p>
          )}

          {/* Fields */}
          <div className="flex w-full flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-[13px] font-black text-[#181916]">
                Email
              </label>
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
                className={emailError ? inputError : inputNormal}
              />
              {emailError && (
                <span
                  id="login-email-error"
                  className="text-[11px] font-black leading-4 text-[#b42318]"
                  role="alert"
                >
                  {emailError}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="login-password" className="text-[13px] font-black text-[#181916]">
                Password
              </label>
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
                  className={`pr-12 ${passwordError ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#62665C]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.8} />
                  ) : (
                    <Eye size={20} strokeWidth={1.8} />
                  )}
                </button>
              </span>
              {passwordError && (
                <span
                  id="login-password-error"
                  className="text-[11px] font-black leading-4 text-[#b42318]"
                  role="alert"
                >
                  {passwordError}
                </span>
              )}
            </div>

            {/* Forgot password */}
            <button
              type="button"
              onClick={onForgotPassword}
              className="w-full cursor-pointer border-0 bg-transparent p-0 text-right text-[13px] font-black text-[#181916]"
            >
              Forgot password?
            </button>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-4">
            {/* Log in */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#181916] bg-[#181916] px-6 text-[15px] font-black text-[#F8F6EF] transition-all duration-200 ease-out hover:bg-[#2a2d26] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <span
                  className="size-4 animate-spin rounded-full border-2 border-[#F8F6EF] border-t-transparent"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>

            {/* Divider */}
            <div
              className="flex w-full items-center gap-3 text-[12px] font-black text-[#62665C]"
              aria-label="Or continue with another method"
            >
              <span className="h-px min-w-0 flex-1 bg-[#181916]" />
              <span>or</span>
              <span className="h-px min-w-0 flex-1 bg-[#181916]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-[8px] border-2 border-[#181916] bg-white px-6 text-[15px] font-black text-[#181916] transition-all duration-200 ease-out hover:bg-[#F8F6EF] active:scale-[0.99]"
            >
              <span className="w-[19px] text-center text-[17px] font-black text-[#4285F4]">G</span>
              Continue with Google
            </button>
          </div>

          {/* Switch to register */}
          <p className="w-full text-center text-[13px] font-black text-[#62665C]">
            New to ReLearn?{' '}
            <button
              type="button"
              onClick={onCreateAccount}
              className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-black text-[#181916]"
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
