import { useEffect } from 'react'
import { BookOpen, Sparkles } from 'lucide-react'

// Tambahkan import ini di bawah lucide-react
import workspaceCollage from '../../assets/materials/Learning workspace collage.png'

export default function AuthLayout({ variant = 'login', children }) {
  const isRegister = variant === 'register'

  useEffect(() => {
    document.title = isRegister ? 'Register · ReLearn' : 'Login · ReLearn'
  }, [isRegister])

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8F6EF] font-['Inter',_sans-serif] text-[#181916] min-[1024px]:flex-row min-[1024px]:overflow-hidden">
      {/* ── Mobile header ── */}
      <header className="flex h-14 shrink-0 items-center justify-between px-6 pt-4 min-[1024px]:hidden">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* <div className="h-[34px] w-[32px] bg-[#181916]" /> */}
          <span className="text-[25px] font-black text-[#181916]">Re:Learn</span>
          {/* <span className="text-[15px] font-black text-[#181916]">✱</span> */}
        </div>
        <a href="#" className="text-[12px] font-black text-[#181916] no-underline">
          Help
        </a>
      </header>

      {/* ── Left panel — branding + marketing content ── */}
      <aside className="hidden min-w-0 flex-1 flex-col justify-between overflow-hidden px-[72px] pb-[56px] pt-[44px] min-[1024px]:flex">
        {/* Logo */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* <div className="h-[34px] w-[32px] bg-[#181916]" /> */}
          <span className="text-[25px] font-black text-[#181916]">Re:Learn</span>
          {/* <span className="text-[15px] font-black text-[#181916]">✱</span> */}
        </div>

        {/* Tagline & Content */}
        {isRegister ? (
          <div className="flex w-[620px] max-w-full flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <div className="size-2 bg-[#181916]" />
              <p className="text-[13px] font-black uppercase tracking-wide text-[#181916]">
                Self-learning, your way.
              </p>
            </div>
            <h1 className="m-0 text-[52px] font-black leading-[1.12] text-[#181916]">
              Start learning,
              <br />
              on your own terms.
            </h1>
            <p className="w-[520px] max-w-full text-[16px] font-black leading-[1.55] text-[#62665C]">
              Turn a pile of materials into a clear path. Learn independently without feeling alone.
            </p>
          </div>
        ) : (
          <div className="flex w-[620px] max-w-full flex-col gap-6">
            <p className="text-[12px] font-black uppercase text-[#181916]">
              Your learning, in motion
            </p>
            <h1 className="m-0 text-[52px] font-black leading-[1.12] text-[#181916]">
              Small sessions.
              <br />
              Real progress.
            </h1>
            <p className="w-[520px] max-w-full text-[16px] font-black leading-[1.55] text-[#62665C]">
              Pick up where you left off. Your materials, your learning path, your pace.
            </p>
          </div>
        )}

        {/* Illustration / Bottom Card */}
        {isRegister ? (
          <div className="relative flex w-[584px] max-w-full items-start justify-start">
            <img 
              src={workspaceCollage} 
              alt="Learning Workspace Collage" 
              className="h-auto w-full object-contain object-left" 
            />
          </div>
        ) : (
          <div className="flex w-[560px] max-w-full flex-col gap-4">
            <section className="flex flex-col gap-6 overflow-hidden rounded-[8px] border-2 border-[#181916] bg-white p-6">
              <div className="flex w-full items-center justify-between overflow-hidden">
                <span className="flex items-center rounded-full border-2 border-[#181916] bg-[#D5F35B] px-3 py-[7px] text-[12px] font-black uppercase text-[#181916]">
                  Next up · 12 min
                </span>
                <span className="flex items-center gap-2 overflow-hidden text-[13px] font-black text-[#62665C]">
                  <span className="size-2 rounded-full bg-[#D5F35B]" />
                  Biology
                </span>
              </div>
              <div className="flex w-full items-center gap-6 overflow-hidden">
                <div className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-2 border-[#181916] bg-[#D5F35B]">
                  <BookOpen size={28} strokeWidth={1.8} className="text-[#181916]" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden">
                  <p className="text-[20px] font-black leading-[1.2] text-[#181916]">
                    How do cells turn food into energy?
                  </p>
                  <p className="text-[13px] font-black leading-[1.55] text-[#62665C]">
                    Continue your guided lesson from yesterday.
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 overflow-hidden">
                <div className="flex items-center justify-between text-[12px] font-black">
                  <span className="text-[#62665C]">Course progress</span>
                  <span className="text-[#181916]">64%</span>
                </div>
                <div className="h-[6px] w-full overflow-hidden rounded-full border-2 border-[#181916] bg-[#F8F6EF]">
                  <div className="h-full w-[64.3%] rounded-full border-2 border-[#181916] bg-[#D5F35B]" />
                </div>
              </div>
            </section>
            <p className="flex items-center gap-2 overflow-hidden text-[12px] font-black text-[#62665C]">
              <Sparkles size={16} strokeWidth={1.8} className="shrink-0 text-[#D5F35B]" />
              Four focused days this week — keep your momentum going.
            </p>
          </div>
        )}
      </aside>

      {/* ── Right panel — form ── */}
      <main className="flex min-h-0 w-full flex-1 flex-col justify-between bg-transparent px-6 pb-6 pt-8 min-[1024px]:w-[600px] min-[1024px]:flex-none min-[1024px]:border-l-2 min-[1024px]:border-[#181916] min-[1024px]:bg-white min-[1024px]:px-[72px] min-[1024px]:pb-[40px] min-[1024px]:pt-[44px]">
        <div className="hidden h-[15px] w-full items-center justify-end gap-2 whitespace-nowrap text-[12px] font-black leading-[15px] min-[1024px]:flex">
          <span className="text-[#62665C]">Need help?</span>
          <a href="#" className="text-[#181916] no-underline">
            Contact support
          </a>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center min-[1024px]:flex-none min-[1024px]:justify-center">
          {children}
        </div>

        <footer className="w-full pt-8 text-center text-[11px] font-black leading-[1.45] text-[#62645A] min-[1024px]:pt-0">
          By continuing, you agree to our Terms and Privacy Policy.
        </footer>
      </main>
    </div>
  )
}