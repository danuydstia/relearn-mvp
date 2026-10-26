import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import TransitionScribble from '../components/TransitionScribble.jsx';

// Semua gambar sekarang ada di public/materials/ (dipanggil lewat path absolut).
// Kalau foldernya beda, cukup ubah ASSET_BASE. Contoh: '' jika file langsung di public/.
const ASSET_BASE = '/materials';
const asset = (file) => encodeURI(`${ASSET_BASE}/${file}`);

const imgLogo = asset('relearn-full-logo-black.png');
const imgLearningWorkspace = asset('Learning workspace collage.png');
const imgCommunityWorkspace = asset('Community workspace collage.png');
const imgLearningRoute = asset('Learning route preview.png');
const imgAIConversation = asset('AI conversation collage.png');
const imgStep1 = asset('Learning step card (1).png');
const imgStep2 = asset('Learning step card (2).png');
const imgStep3 = asset('Learning step card (3).png');
const imgStep4 = asset('Learning step card.png');
const imgKeepLearning = asset('Keep learning sticker.png');
const imgAchievementWorkspace = asset('Achievement workspace.png');

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Jeda sebelum animasi hero mulai, supaya pas dengan intro coretan
// (intro menutup layar 0.8 dtk lalu menyapu keluar). Set 0 kalau intro dimatikan.
const HERO_DELAY = 1.3;

const NAV_LINKS = [
  { href: '#community', label: 'Community' },
  { href: '#path', label: 'Learning Path' },
  { href: '#ai', label: 'AI Chat Bot' },
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
];

const MARQUEE_ITEMS = ['Curiosity', 'Small Steps', 'Big Conversations', 'Learn Your Way'];

const WHY_ITEMS = [
  { step: '01 / MORE FOCUSED', title: 'Materials become steps, not a pile.', desc: 'Build a learning journey from the materials you want to master.' },
  { step: '02 / MORE STICKY', title: 'Not just read and forget.', desc: 'Ask questions, check understanding, and revisit what needs practice.' },
  { step: '03 / MORE TOGETHER', title: 'Independent does not mean alone.', desc: 'Find new perspectives through discussions and shared learning paths.' },
];

const STEP_IMAGES = [imgStep1, imgStep2, imgStep3, imgStep4];

// Harga & fitur di bawah ini masih contoh. Sesuaikan dengan paket asli Re:Learn.
const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Everything you need to start learning from your own materials.',
    features: [
      'Up to 3 learning paths',
      'Upload your own materials',
      'AI Chat Bot with daily limit',
      'Join community discussions',
      'Personal progress and tokens',
    ],
    cta: 'Start for free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$5',
    period: 'per month',
    desc: 'More room to learn, ask, and build without limits.',
    features: [
      'Unlimited learning paths',
      'Larger material uploads',
      'Unlimited AI Chat Bot questions',
      'Share paths with the community',
      'All achievements and bonus tokens',
    ],
    cta: 'Go Pro',
    featured: true,
  },
];

/* ---------- Komponen kecil yang dipakai berulang ---------- */

function CtaLink({ to, children, tone = 'dark', size = 'lg', className = '' }) {
  const tones = {
    dark: 'bg-[#181916] text-[#F8F6EF] hover:bg-black',
    lime: 'bg-[#D5F35B] text-[#181916] hover:bg-[#c2e04e]',
  };
  const sizes = {
    md: 'h-[44px] md:h-[46px] px-5 md:px-6 text-[13px] md:text-[14px]',
    lg: 'h-[54px] md:h-[60px] px-6 md:px-8 text-[15px] md:text-[16px]',
  };
  // Warna panah mengikuti tone tombol (lime di tombol gelap, gelap di tombol lime)
  const arrowColor = tone === 'lime' ? 'bg-[#181916]' : 'bg-[#D5F35B]';
  return (
    <Link
      to={to}
      className={`scribble-trigger group w-fit max-w-full rounded-full font-semibold flex items-center gap-4 md:gap-6 transition-colors ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`w-6 h-6 shrink-0 ${arrowColor}`}
        style={{
          WebkitMaskImage: 'url(/Arrow.svg)',
          maskImage: 'url(/Arrow.svg)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    </Link>
  );
}

function FeatureHeader({ num, label, tagline }) {
  return (
    <div data-reveal className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-[#181916] flex items-center justify-center font-semibold text-[12px]">{num}</div>
        <span className="text-[13px] font-semibold uppercase">{label}</span>
      </div>
      <span className="text-[11px] md:text-[12px] opacity-70 tracking-wider">{tagline}</span>
    </div>
  );
}

// Garis bawah yang menyapu saat hover, mengecil sedikit saat ditekan
const NAV_LINK_CLASS =
  'relative inline-block transition-transform duration-150 active:scale-95 ' +
  "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full " +
  'after:bg-[#181916] after:origin-left after:scale-x-0 hover:after:scale-x-100 ' +
  'after:transition-transform after:duration-300';

const SECTION = 'py-14 md:py-20 lg:py-24 px-5 sm:px-8 lg:px-16';

/* ---------- Halaman ---------- */

export default function LandingPage() {
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'ReLearn · Self-learning, your way.'
  }, []);

  // Klik link navbar: efek "pop" pada link + scroll halus ke section tujuan
  const handleNavClick = (e, href) => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    setMenuOpen(false);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      gsap.fromTo(
        e.currentTarget,
        { scale: 0.88 },
        { scale: 1, duration: 0.5, ease: 'back.out(3)', overwrite: 'auto' }
      );
    }
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 0 },
      duration: reduce ? 0 : 1.1,
      ease: 'power3.inOut',
    });
  };

  // Animasi menu mobile
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [menuOpen]);

  // Tutup menu kalau layar dibesarkan ke desktop
  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Semua animasi halaman
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    // Animasi umum (dimatikan otomatis kalau user pilih "reduce motion")
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // --- Hero: baris judul naik satu per satu ---
      const heroTl = gsap.timeline({ delay: HERO_DELAY });
      heroTl
        .from('[data-hero-line]', { yPercent: 115, duration: 1, stagger: 0.12, ease: 'power4.out' })
        .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.55')
        .from('[data-hero-img]', { y: 60, opacity: 0, rotate: -3, scale: 0.94, duration: 1.1, ease: 'power3.out' }, 0.15);

      // Gambar hero melayang pelan
      gsap.to('[data-float]', {
        y: -12,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: HERO_DELAY + 1.2,
      });

      // --- Marquee berjalan terus ---
      gsap.to('[data-marquee]', { xPercent: -50, duration: 24, ease: 'none', repeat: -1 });

      // --- Reveal saat scroll ---
      root.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      // --- Grup yang muncul berurutan (kartu, tag, langkah) ---
      root.querySelectorAll('[data-stagger]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-item]'), {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        });
      });

      // --- Sticker "Keep learning" bergoyang ---
      gsap.fromTo(
        '[data-sticker]',
        { rotation: -12 },
        { rotation: -4, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }
      );

      // --- Wordmark raksasa naik dari bawah ---
      gsap.from('[data-wordmark]', {
        yPercent: 100,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: '[data-wordmark-wrap]', start: 'top 95%', once: true },
      });
    });

    // Parallax halus hanya di desktop
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll('[data-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: 3 },
          {
            yPercent: -3,
            ease: 'none',
            scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    });

    // Gambar yang telat dimuat mengubah tinggi halaman -> hitung ulang trigger
    const refresh = () => ScrollTrigger.refresh();
    root.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="w-full bg-[#F8F6EF] overflow-x-hidden flex flex-col font-['Inter'] text-[#181916] relative"
    >
      {/* Panggil komponen animasi scribble di sini */}
      <TransitionScribble />

      {/* --- NAVBAR --- */}
      <nav className="h-[72px] md:h-[100px] px-5 sm:px-8 lg:px-16 border-b border-[#181916] flex justify-between items-center relative z-10 bg-[#F8F6EF]">
        <div className="flex items-center cursor-pointer scribble-trigger">
          <img src={imgLogo} alt="Re:Learn" className="h-10 md:h-15 w-auto object-contain" />
        </div>

        <div className="hidden lg:flex items-center gap-7 text-[14px]">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className={NAV_LINK_CLASS}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <Link to="/login" className="hidden sm:block text-[14px] font-semibold hover:underline">Sign in</Link>
          {/* Class 'scribble-trigger' memicu animasi transisi coretan */}
          <CtaLink to="/register" size="md">Start learning</CtaLink>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden w-11 h-11 rounded-full border border-[#181916] flex flex-col items-center justify-center gap-[5px]"
          >
            <span className={`block w-5 h-[2px] bg-[#181916] transition-transform duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[2px] bg-[#181916] transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-[#181916] transition-transform duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div
            ref={menuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#F8F6EF] border-b border-[#181916] px-5 sm:px-8 py-6 flex flex-col gap-5 text-[18px] font-semibold shadow-xl"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className={`${NAV_LINK_CLASS} w-fit`}
              >
                {l.label}
              </a>
            ))}
            <Link to="/login" className="sm:hidden hover:underline">Sign in</Link>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="py-12 md:py-[70px] px-5 sm:px-8 lg:px-16 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-12">
        <div className="w-full lg:w-[55%] flex flex-col gap-6 md:gap-7">
          <div data-hero-fade className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#181916]" />
            <span className="text-[13px] uppercase tracking-wider">Self-learning, your way.</span>
          </div>
          <h1 className="text-[clamp(2.75rem,8vw,6.75rem)] font-black leading-[1.05] tracking-tight">
            {['Not just', 'learning.', 'Getting it.'].map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span data-hero-line className="block">{line}</span>
              </span>
            ))}
          </h1>
          <p data-hero-fade className="max-w-[500px] text-[17px] md:text-[19px] leading-relaxed text-[#181916]/80">
            Turn a pile of materials into a clear path. Learn independently without feeling alone.
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-2 md:mt-4">
            <CtaLink to="/register">Start from your materials</CtaLink>
            <a href="#how" className="text-[15px] font-semibold underline">See how it works ↓</a>
          </div>
          <p data-hero-fade className="text-[11px] md:text-[12px] font-medium tracking-wide mt-2 opacity-70">
            YOUR MATERIALS. YOUR PACE. STILL GOT A STUDY BUDDY.
          </p>
        </div>
        <div data-hero-img className="w-full lg:w-[45%] relative">
          <img
            data-float
            src={imgLearningWorkspace}
            alt="Learning Workspace"
            className="w-full max-w-[584px] mx-auto lg:mx-0 object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="h-[48px] md:h-[60px] bg-[#181916] overflow-hidden flex items-center text-[#D5F35B] text-[13px] md:text-[16px] font-semibold tracking-widest uppercase">
        <div data-marquee className="flex w-max whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-6 md:gap-9 pr-6 md:pr-9" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-6 md:gap-9">
                  <span>{item}</span>
                  <span>✱</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* --- WHY Re:Learn --- */}
      <section className={`${SECTION} flex flex-col gap-8 md:gap-10`}>
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-20">
          <div data-reveal className="lg:w-[220px] lg:shrink-0 flex flex-col gap-5 lg:gap-7">
            <span className="text-[13px] font-semibold uppercase">Why Re:Learn?</span>
            <h2 className="text-[20px] md:text-[22px] font-medium leading-snug -rotate-3 origin-left">Lots of tabs open.<br />But not much sticks.</h2>
          </div>
          <h2 data-reveal className="flex-1 text-[clamp(1.75rem,4vw,3.6rem)] font-extrabold leading-tight">
            Your materials have direction.<br className="hidden md:block" /> Your curiosity has room.
          </h2>
        </div>
        <hr className="border-[#181916] my-2 md:my-4" />
        <div data-stagger className="flex flex-col md:flex-row gap-8 md:gap-10">
          {WHY_ITEMS.map((item) => (
            <div key={item.step} data-item className="flex-1 flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-[#62645A]">{item.step}</span>
              <h3 className="text-[19px] md:text-[21px] font-bold">{item.title}</h3>
              <p className="text-[15px] text-[#62645A] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURE 1: COMMUNITY --- */}
      <section id="community" className={`${SECTION} flex flex-col gap-8 md:gap-12 border-t border-[#DCDDD2]`}>
        <FeatureHeader num="01" label="Community" tagline="A SPACE TO ASK, SHARE, AND KEEP GOING." />
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 xl:gap-20">
          <div data-reveal className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-7">
            <h2 className="text-[clamp(2.5rem,5vw,4.75rem)] font-black leading-none">Alone is okay.<br />Quiet is not.</h2>
            <p className="text-[16px] md:text-[18px] leading-relaxed opacity-80 mt-1 md:mt-2">
              Stuck on the same concept? Throw a question, swap notes, or peek at how others structure their learning path.
            </p>
            <ul className="flex flex-col gap-3.5 mt-1 md:mt-2">
              <li className="flex items-start gap-3 text-[15px]"><span className="text-[18px] leading-none">↗</span> Topic-based discussions for what you are learning</li>
              <li className="flex items-start gap-3 text-[15px]"><span className="text-[18px] leading-none">↗</span> Share the learning path you built</li>
              <li className="flex items-start gap-3 text-[15px]"><span className="text-[18px] leading-none">↗</span> Save ideas from fresh perspectives</li>
            </ul>
            <CtaLink to="/register" className="mt-2 md:mt-4">Find your study buddy</CtaLink>
          </div>
          <div data-reveal className="w-full lg:w-1/2">
            <img data-parallax src={imgCommunityWorkspace} alt="Community workspace" className="w-full object-contain" />
          </div>
        </div>
      </section>

      {/* --- FEATURE 2: LEARNING PATH --- */}
      <section id="path" className={`${SECTION} flex flex-col gap-8 md:gap-12 border-t border-[#DCDDD2]`}>
        <FeatureHeader num="02" label="Learning Path" tagline="ONE GOAL. A PATH YOU CAN FOLLOW." />
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 xl:gap-20">
          <div data-reveal className="order-2 lg:order-1 w-full lg:w-[55%]">
            <img data-parallax src={imgLearningRoute} alt="Learning Path" className="w-full object-contain" />
          </div>
          <div data-reveal className="order-1 lg:order-2 w-full lg:flex-1 flex flex-col gap-6 md:gap-7">
            <h2 className="text-[clamp(2.25rem,4.6vw,4.5rem)] font-black leading-[0.95]">From “where do I start?”<br />to “oh, I get it!”</h2>
            <p className="text-[16px] md:text-[18px] leading-relaxed opacity-80 mt-1 md:mt-2">
              Upload your materials, then turn them into a structured path. Break big topics into small steps with material and quizzes to check understanding.
            </p>
            <div data-stagger className="flex flex-wrap gap-2 mt-1 md:mt-2">
              {['Your materials', 'Structured steps', 'Quiz'].map((tag) => (
                <span key={tag} data-item className="px-4 py-2 bg-white rounded-full border border-[#181916] text-[12px] font-medium">{tag}</span>
              ))}
            </div>
            <CtaLink to="/register" className="mt-2 md:mt-4">Build your learning path</CtaLink>
          </div>
        </div>
      </section>

      {/* --- FEATURE 3: AI CHAT BOT --- */}
      <section id="ai" className={`${SECTION} flex flex-col gap-8 md:gap-12 border-t border-[#DCDDD2]`}>
        <FeatureHeader num="03" label="AI Chat Bot" tagline="FROM CONFUSION TO CLARITY." />
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 xl:gap-20">
          <div data-reveal className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-7">
            <h2 className="text-[clamp(2.5rem,5vw,4.75rem)] font-black leading-none">Ask again.<br />Until it clicks.</h2>
            <p className="text-[16px] md:text-[18px] leading-relaxed opacity-80 mt-1 md:mt-2">
              Got a concept that still does not make sense? Ask the AI Chat Bot about your materials. Ask for a simpler explanation, another example, or a quick practice question.
            </p>
            <p className="flex gap-3 text-[15px] opacity-80 bg-white/50 p-4 rounded-xl border border-[#181916]/20">
              <span className="text-[18px]">💡</span> A thinking companion, not a shortcut. You stay in control of your learning.
            </p>
            <CtaLink to="/register" className="mt-2 md:mt-4">Meet your AI Chat Bot</CtaLink>
            <span className="text-[12px] text-[#62645A] mt-1 md:mt-2">AI can be wrong. Always check answers against your source materials.</span>
          </div>
          <div data-reveal className="w-full lg:w-1/2">
            <img data-parallax src={imgAIConversation} alt="AI Conversation" className="w-full object-contain drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how" className={`${SECTION} flex flex-col gap-8 md:gap-10 border-t border-[#DCDDD2]`}>
        <span data-reveal className="text-[13px] font-semibold uppercase">How It Works</span>
        <div data-reveal className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-20 mb-2 md:mb-10">
          <h2 className="text-[clamp(2.5rem,6vw,5.4rem)] font-black leading-none">From materials.<br />To understanding.</h2>
          <p className="lg:flex-1 text-[16px] md:text-[18px] leading-relaxed lg:pb-4">
            You do not have to be great right away. Start with one material, then follow these four steps.
          </p>
        </div>
        <div data-stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STEP_IMAGES.map((src, i) => (
            <div key={i} data-item>
              <img
                src={src}
                alt={`Step ${i + 1}`}
                className="w-full hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </section>

      {/* --- PROGRESS & REWARDS --- */}
      <section className={`${SECTION} flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-24 border-t border-[#DCDDD2]`}>
        <div data-reveal className="w-full lg:w-[45%] flex flex-col gap-6 md:gap-7">
          <span className="text-[13px] font-semibold uppercase">Progress & Rewards</span>
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1]">Slowly.<br />You are moving.</h2>
          <p className="text-[16px] md:text-[18px] leading-relaxed opacity-80">
            One path finished is one reason to feel proud. See your progress, collect tokens, and unlock achievements from the steps you complete.
          </p>
          <p className="text-[16px] font-semibold">It is not about who is fastest. It is about you keeping momentum.</p>
          <div data-stagger className="flex flex-wrap gap-2 mt-1 md:mt-2">
            {['Personal progress', 'Tokens', 'Achievements'].map((tag) => (
              <span key={tag} data-item className="px-4 py-2 bg-[#ABE0F2] rounded-full border border-[#181916] text-[12px] font-medium">{tag}</span>
            ))}
          </div>
        </div>

        <div data-reveal className="w-full lg:flex-1">
          <img data-parallax src={imgAchievementWorkspace} alt="Achievement Workspace" className="w-full object-contain" />
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className={`${SECTION} flex flex-col gap-8 md:gap-12 border-t border-[#DCDDD2]`}>
        <div data-reveal className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-20">
          <div className="flex flex-col gap-5 md:gap-7">
            <span className="text-[13px] font-semibold uppercase">Pricing</span>
            <h2 className="text-[clamp(2.5rem,6vw,5.4rem)] font-black leading-none">Start free.<br />Go further later.</h2>
          </div>
          <p className="lg:flex-1 max-w-[520px] text-[16px] md:text-[18px] leading-relaxed lg:pb-4">
            Begin with one material and no card. Upgrade only when you want more paths and more questions.
          </p>
        </div>

        <div data-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-[1000px]">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              data-item
              className={`flex flex-col gap-6 p-6 md:p-10 rounded-3xl border border-[#181916] ${
                plan.featured ? 'bg-[#181916] text-[#F8F6EF]' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[22px] font-extrabold">{plan.name}</span>
                {plan.featured && (
                  <span className="px-3 py-1 rounded-full bg-[#D5F35B] text-[#181916] text-[11px] font-semibold">
                    Most popular
                  </span>
                )}
              </div>

              <div className="flex items-end gap-2">
                <span className="text-[clamp(3rem,5vw,4.5rem)] font-black leading-none">{plan.price}</span>
                <span className="pb-1 text-[14px] opacity-70">{plan.period}</span>
              </div>

              <p className="text-[15px] leading-relaxed opacity-80">{plan.desc}</p>

              <hr className={plan.featured ? 'border-[#3A3D33]' : 'border-[#DCDDD2]'} />

              <ul className="flex flex-col gap-3.5 text-[15px]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`font-bold ${plan.featured ? 'text-[#D5F35B]' : 'text-[#27644B]'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <CtaLink to="/register" tone={plan.featured ? 'lime' : 'dark'} className="mt-auto">
                {plan.cta}
              </CtaLink>
            </div>
          ))}
        </div>

        <p data-reveal className="text-[12px] text-[#62645A]">Cancel anytime. Your materials and progress stay yours.</p>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-14 md:pt-24 pb-8 px-5 sm:px-8 lg:px-16 bg-[#181916] flex flex-col gap-10 md:gap-14 text-[#F8F6EF]">
        <div className="flex flex-col gap-8">
          <span data-reveal className="text-[#D5F35B] text-[12px] md:text-[13px] font-semibold tracking-wider">ONE MATERIAL. MANY POSSIBILITIES.</span>
          <div data-reveal className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-8 md:gap-12">
            <h2 className="flex-1 text-[clamp(2.5rem,6.5vw,6.1rem)] font-black leading-none text-white">Start now.<br />Understanding follows.</h2>
            <img
              data-sticker
              src={imgKeepLearning}
              alt="Keep Learning"
              className="w-[110px] h-[110px] md:w-[158px] md:h-[158px] object-contain shrink-0"
            />
          </div>
          <div data-reveal className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-10 mt-2 md:mt-4">
            <p className="max-w-[570px] text-[16px] md:text-[18px] opacity-80 leading-relaxed">
              Bring your curiosity. Upload your first material, build your path, and find a space to keep learning.
            </p>
            <CtaLink to="/register" tone="lime">Start your learning journey</CtaLink>
          </div>
        </div>

        <hr className="border-[#3A3D33] my-2 md:my-4" />

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10">
          <div className="max-w-[380px] flex flex-col gap-4">
            <span className="text-[#D5F35B] text-[24px] font-extrabold">Re:Learn</span>
            <p className="text-[14px] opacity-80 leading-relaxed">
              A space for curiosity to have direction. Learn independently, grow together.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-8 lg:gap-x-20">
            <div className="flex flex-col gap-4">
              <span className="text-[#D5F35B] text-[10px] font-bold tracking-widest">EXPLORE</span>
              <a href="#community" className="text-[13px] hover:text-[#D5F35B] transition-colors">Community</a>
              <a href="#path" className="text-[13px] hover:text-[#D5F35B] transition-colors">Learning Path</a>
              <a href="#ai" className="text-[13px] hover:text-[#D5F35B] transition-colors">AI Chat Bot</a>
              <a href="#pricing" className="text-[13px] hover:text-[#D5F35B] transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#D5F35B] text-[10px] font-bold tracking-widest">GET STARTED</span>
              <a href="#how" className="text-[13px] hover:text-[#D5F35B] transition-colors">How it works</a>
              <Link to="/login" className="text-[13px] hover:text-[#D5F35B] transition-colors">Sign in</Link>
              <Link to="/register" className="text-[13px] hover:text-[#D5F35B] transition-colors">Start learning</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#D5F35B] text-[10px] font-bold tracking-widest">ABOUT</span>
              <a href="#" className="text-[13px] hover:text-[#D5F35B] transition-colors">About Re:Learn</a>
              <a href="#" className="text-[13px] hover:text-[#D5F35B] transition-colors">Privacy policy</a>
              <a href="#" className="text-[13px] hover:text-[#D5F35B] transition-colors">Terms of use</a>
            </div>
          </div>
        </div>

        <div data-wordmark-wrap className="overflow-hidden mt-4 md:mt-10">
          <h1 data-wordmark className="text-[#D5F35B] text-[clamp(3.5rem,17vw,10rem)] font-black leading-[1.05]">Re:Learn</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-2 md:mt-6 text-[11px] opacity-60 text-center sm:text-left">
          <span>© 2026 Re:Learn. Stay curious, keep learning.</span>
          <button onClick={() => window.scrollTo(0, 0)} className="text-[#D5F35B] hover:underline">Back to top ↑</button>
          <span>English / EN</span>
        </div>
      </footer>
    </div>
  );
}