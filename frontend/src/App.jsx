import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Star } from 'lucide-react'
import bookOpenIcon from './assets/book-open.svg'
import sparklesIcon from './assets/sparkles.svg'
import LoginForm from './components/auth/LoginForm.jsx'
import RegisterForm from './components/auth/RegisterForm.jsx'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isRegisterPage = location.pathname === '/register'
  const loginForm = <LoginForm onCreateAccount={() => navigate('/register')} />

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f7f3] px-6 pb-6 pt-7 font-[Montserrat] text-[#17191f] min-[1024px]:flex-row min-[1024px]:p-0">
      <header className="flex h-6 shrink-0 items-center justify-between min-[768px]:hidden">
        <img
          src="/relearn-full-logo.svg"
          alt="Re:Learn"
          className="h-6 w-auto"
        />
        <a href="#" className="text-[12px] font-medium text-[#03f] no-underline">
          Help
        </a>
      </header>

      <aside className="hidden min-w-0 flex-1 flex-col justify-between overflow-hidden px-8 pb-8 pt-8 min-[768px]:flex min-[1024px]:px-[72px] min-[1024px]:pb-[56px] min-[1024px]:pt-[44px]">
        <header className="h-6 shrink-0">
          <img src="/relearn-full-logo.svg" alt="Re:Learn" className="h-7 w-auto" />
        </header>

        {isRegisterPage ? (
          <div className="flex w-[620px] max-w-full shrink-0 flex-col gap-4">
            <p className="text-[12px] font-semibold uppercase leading-[15px] text-[#03f]">
              Your learning, in motion
            </p>
            <h1 className="m-0 text-[38px] font-semibold leading-[1.08] text-[#17191f] min-[1024px]:text-[52px]">
              Start learning,
              <br />
              <span className="text-[#03f]">on your own terms.</span>
            </h1>
            <p className="w-[520px] max-w-full text-[14px] font-normal leading-[1.55] text-[#686b73] min-[1024px]:text-[16px]">
              Bite-sized sessions designed to fit your schedule and help you grow every single day.
            </p>
          </div>
        ) : (
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
              Pick up exactly where you left off, with an AI tutor that adapts to how you learn.
            </p>
          </div>
        )}

        {isRegisterPage ? (
          <div className="flex w-full max-w-[900px] shrink-0 flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                ['AM', 'Maya R.', '2 days ago'],
                ['DK', 'Daniel K.', '1 week ago'],
                ['SL', 'Sofia L.', '3 days ago'],
              ].map(([initials, name, date]) => (
                <article key={name} className="min-w-0 rounded-[6px] border border-[#dad9d4] bg-white p-3">
                  <div className="mb-3 flex gap-0.5 text-[#e0aa00]" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} size={13} fill="currentColor" strokeWidth={1.5} />
                    ))}
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e4eaff] text-[9px] font-semibold text-[#03f]">
                      {initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-medium text-[#17191f]">{name}</span>
                      <span className="block text-[10px] text-[#8a8d94]">{date}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-[#686b73]">
              <Sparkles size={13} className="text-[#03f]" />
              What our learners feel
            </p>
          </div>
        ) : (
          <div className="flex w-[560px] max-w-full shrink-0 flex-col gap-4">
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
        )}
      </aside>

      <main className="flex min-h-0 w-full flex-1 flex-col justify-between bg-transparent px-0 pb-0 pt-8 min-[768px]:w-[31%] min-[768px]:flex-none min-[768px]:border-l min-[768px]:border-[#dad9d4] min-[768px]:bg-white min-[768px]:px-[4%] min-[768px]:pb-8 min-[768px]:pt-8 min-[1024px]:w-[min(600px,36vw)] min-[1024px]:px-[72px] min-[1024px]:pb-[40px] min-[1024px]:pt-[44px]">
        <div className="hidden h-[15px] w-full items-center justify-end gap-2 whitespace-nowrap text-[12px] leading-[15px] min-[768px]:flex">
          <span className="font-normal text-[#686b73]">Need help?</span>
          <a href="#" className="font-medium text-[#03f] no-underline">
            Contact support
          </a>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center min-[768px]:flex-none min-[768px]:justify-center">
          <Routes>
            <Route path="/" element={loginForm} />
            <Route path="/login" element={loginForm} />
            <Route
              path="/register"
              element={<RegisterForm onBackToLogin={() => navigate('/login')} />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>

        <footer className="w-full pt-8 text-center text-[10px] font-normal leading-[1.45] text-[#8a8d94] min-[1024px]:pt-0 min-[1024px]:text-[11px] min-[1024px]:leading-[13px]">
          By continuing, you agree to our Terms and Privacy Policy.
        </footer>
      </main>
    </div>
  )
}

export default App
