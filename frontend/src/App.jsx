import { useState } from 'react'
import { EyeOff } from 'lucide-react'
import bookOpenIcon from './assets/book-open.svg'
import sparklesIcon from './assets/sparkles.svg'
import eyeIcon from './assets/eye.svg'

function App() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="flex min-h-[max(100svh,844px)] w-full flex-col border border-[#dad9d4] bg-[#f8f7f3] px-6 pb-6 pt-7 font-[Montserrat] text-[#17191f] min-[1024px]:min-h-screen min-[1024px]:flex-row min-[1024px]:border-0 min-[1024px]:p-0">
      <header className="flex h-6 shrink-0 items-center justify-between min-[1024px]:hidden">
        <img
          src="/relearn-full-logo.svg"
          alt="Re:Learn"
          className="h-6 w-auto"
        />
        <a href="#" className="text-[12px] font-medium text-[#03f] no-underline">
          Help
        </a>
      </header>

      <aside className="hidden min-w-0 flex-1 flex-col justify-between overflow-hidden px-[72px] pb-[56px] pt-[44px] min-[1024px]:flex">
        <header className="h-6 shrink-0">
          <img src="/relearn-full-logo.svg" alt="Re:Learn" className="h-7 w-auto" />
        </header>

        <div className="flex w-[620px] max-w-full shrink-0 flex-col gap-6">
          <p className="text-[12px] font-semibold uppercase leading-[15px] text-[#03f]">
            Your learning, in motion
          </p>
          <h1 className="m-0 text-[52px] font-semibold leading-[1.12] text-[#17191f]">
            Small sessions.
            <br />
            <span className="text-[#03f]">Real progress.</span>
          </h1>
          <p className="w-[520px] max-w-full text-[16px] font-normal leading-[1.55] text-[#686b73]">
            Pick up exactly where you left off, with an AI tutor that adapts to
            how you learn.
          </p>
        </div>

        <div className="flex w-[560px] shrink-0 flex-col gap-4">
          <section className="flex h-[228px] flex-col gap-6 rounded-[18px] border border-[#dad9d4] bg-white p-6">
            <div className="flex h-[29px] w-full items-center justify-between">
              <span className="flex h-[29px] items-center rounded-full bg-[#dde3ff] px-3 text-[12px] font-semibold uppercase leading-normal text-[#03f]">
                Next up · 12 min
              </span>
              <span className="flex items-center gap-2 text-[13px] font-medium leading-4 text-[#686b73]">
                <span className="size-2 rounded-full bg-[#03f]" />
                Biology
              </span>
            </div>

            <div className="flex h-[72px] w-full items-center gap-6">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[12px] bg-[#f2f1ec]">
                <img src={bookOpenIcon} alt="" className="size-7" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="text-[20px] font-semibold leading-[1.2] text-[#17191f]">
                  How do cells turn food into energy?
                </p>
                <p className="text-[13px] font-normal leading-[1.55] text-[#686b73]">
                  Continue your guided lesson from yesterday.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="flex h-[15px] items-center justify-between text-[12px] leading-[15px]">
                <span className="font-medium text-[#686b73]">Course progress</span>
                <span className="font-semibold text-[#17191f]">64%</span>
              </div>
              <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#dde3ff]">
                <div className="h-full w-[64.3%] rounded-full bg-[#03f]" />
              </div>
            </div>
          </section>

          <p className="flex h-4 items-center gap-2 text-[12px] font-medium leading-4 text-[#686b73]">
            <img src={sparklesIcon} alt="" className="size-4" />
            Four focused days this week — keep your momentum going.
          </p>
        </div>
      </aside>

      <main className="flex min-h-0 w-full flex-1 flex-col justify-between bg-transparent px-0 pb-0 pt-0 min-[1024px]:w-[600px] min-[1024px]:flex-none min-[1024px]:border-l min-[1024px]:border-[#dad9d4] min-[1024px]:bg-white min-[1024px]:px-[72px] min-[1024px]:pb-[40px] min-[1024px]:pt-[44px]">
        <div className="hidden h-[15px] w-full items-center justify-end gap-2 whitespace-nowrap text-[12px] leading-[15px] min-[1024px]:flex">
          <span className="font-normal text-[#686b73]">Need help?</span>
          <a href="#" className="font-medium text-[#03f] no-underline">
            Contact support
          </a>
        </div>

        <section className="flex w-full flex-1 flex-col items-center justify-center min-[1024px]:flex-none min-[1024px]:justify-start" aria-label="Login form">
          <div className="flex w-full max-w-[430px] flex-col gap-8">
            <div className="flex min-h-[73px] w-full shrink-0 flex-col gap-3 min-[1024px]:h-auto">
              <h2 className="m-0 text-[32px] font-semibold leading-[38px] text-[#17191f] min-[1024px]:text-[42px] min-[1024px]:leading-[50px]">
                Welcome back!
              </h2>
              <p className="text-[15px] font-normal leading-[23px] text-[#686b73] min-[1024px]:leading-[1.55]">
                Your next learning session starts here.
              </p>
            </div>

            <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit}>
              <div className="flex w-full flex-col gap-4">
                <label className="flex h-20 flex-col gap-2 text-[13px] font-medium leading-4 text-[#17191f]">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-label="Email"
                    className="h-14 w-full rounded-[12px] border border-[#dad9d4] bg-white px-4 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] focus:border-[#03f]"
                  />
                </label>

                <label className="flex h-20 flex-col gap-2 text-[13px] font-medium leading-4 text-[#17191f]">
                  <span>Password</span>
                  <span className="relative block h-14 w-full">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      aria-label="Password"
                      className="h-14 w-full rounded-[12px] border border-[#dad9d4] bg-white px-4 pr-12 text-[15px] font-normal leading-normal text-[#17191f] outline-none placeholder:text-[#8a8d94] focus:border-[#03f]"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} strokeWidth={1.5} className="text-[#686b73]" />
                      ) : (
                        <img src={eyeIcon} alt="" className="size-5" />
                      )}
                    </button>
                  </span>
                </label>

                <button
                  type="button"
                  className="h-4 w-full border-0 bg-transparent p-0 text-right text-[13px] font-medium leading-4 text-[#03f]"
                >
                  Forgot password?
                </button>
              </div>

              <div className="flex w-full flex-col gap-4">
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center rounded-[12px] border-0 bg-[#03f] px-6 text-[15px] font-semibold leading-normal text-white"
                >
                  Log in
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
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-[12px] border border-[#dad9d4] bg-white px-6 text-[15px] font-medium leading-normal text-[#17191f]"
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
                  className="border-0 bg-transparent p-0 text-[13px] font-semibold leading-4 text-[#03f]"
                >
                  Create an account.
                </button>
              </p>
            </form>
          </div>
        </section>

        <footer className="w-full text-center text-[10px] font-normal leading-[1.45] text-[#8a8d94] min-[1024px]:text-[11px] min-[1024px]:leading-[13px]">
          By continuing, you agree to our Terms and Privacy Policy.
        </footer>
      </main>
    </div>
  )
}

export default App
