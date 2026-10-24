import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const SCRIBBLE_PATH =
  'M299.654 453.865C505.574 319.225 711.494 184.585 836.054 109.945C960.614 35.3048 997.574 24.7448 944.014 110.385C890.454 196.025 745.254 378.185 571.454 634.385C397.654 890.585 199.654 1215.3 110.854 1382.58C22.0544 1549.86 48.4544 1549.86 77.8944 1540.62C107.334 1531.38 139.014 1512.9 367.854 1319.9C596.694 1126.9 1021.73 759.945 1255.21 555.065C1488.69 350.185 1517.73 318.505 1527.41 306.145C1537.09 293.785 1526.53 301.705 1346.85 618.625C1167.17 935.545 818.694 1561.22 635.214 1896.74C451.734 2232.26 443.814 2258.66 447.654 2268.3C451.494 2277.94 467.334 2270.02 511.134 2236.9C554.934 2203.78 626.214 2145.7 966.534 1817.46C1306.85 1489.22 1914.05 892.585 2263.81 557.505C2613.57 222.425 2687.49 166.985 2741.41 129.185C2795.33 91.3848 2827.01 72.9048 2843.33 67.3448C2859.65 61.7848 2859.65 69.7048 2849.09 96.2248C2838.53 122.745 2817.41 167.625 2584.77 544.505C2352.13 921.385 1370.37 2165.43 1139.25 2537.83C908.134 2910.23 902.854 2926.07 902.774 2939.51C902.694 2952.95 907.974 2963.51 1255.21 2613.87C1602.45 2264.23 2829.73 1017.54 2903.53 1071.46C2977.33 1125.38 2176.12 2817.04 2128 3037C2079.88 3256.96 2911.24 2018.56 3172 1793';

// Warna coretan + apakah warna itu "terang" (menentukan warna pill logo)
const COLORS = [
  { value: '#27644B', light: false },
  { value: '#ABE0F2', light: true },
  { value: '#181916', light: false },
  { value: '#D5F35B', light: true },
  { value: '#F4B8D2', light: true },
  { value: '#A53932', light: false },
  { value: '#C6B7F2', light: true },
];

// Ketebalan stroke dalam satuan viewBox (angka, bukan persen)
const STROKE_START = 250;
const STROKE_MAX = 800;
const DUR_IN = 0.8;
const DUR_OUT = 1.5;

// true  = intro hanya sekali per sesi browser
// false = intro tampil setiap landing page dibuka / di-refresh
const INTRO_ONCE_PER_SESSION = false;

export default function TransitionScribble() {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const logoRef = useRef(null);
  const logoTextRef = useRef(null);
  const tlRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    const pathEl = pathRef.current;
    const logoEl = logoRef.current;
    const logoText = logoTextRef.current;
    if (!svgEl || !pathEl || !logoEl || !logoText) return;

    const hideAll = () => {
      gsap.set(svgEl, { opacity: 0, pointerEvents: 'none' });
      gsap.set(pathEl, { strokeWidth: 0 });
      gsap.set(logoEl, { autoAlpha: 0 });
      gsap.set(logoText, { rotation: 0 });
    };
    hideAll();

    // Satu fungsi untuk intro DAN transisi klik.
    // href = undefined -> hanya animasi (intro). href terisi -> navigasi di puncak.
    const play = (href) => {
      if (busyRef.current) return;
      busyRef.current = true;

      let length;
      try {
        length = pathEl.getTotalLength() || 12000;
      } catch {
        length = 12000;
      }
      const l = length + 5;

      const pick = COLORS[Math.floor(Math.random() * COLORS.length)];
      svgEl.style.color = pick.value;

      // Pill logo kontras dengan warna coretan
      gsap.set(logoText, {
        backgroundColor: pick.light ? '#181916' : '#F8F6EF',
        color: pick.light ? '#F8F6EF' : '#181916',
        rotation: 0,
      });

      gsap.set(pathEl, {
        strokeDasharray: l,
        strokeDashoffset: l,
        strokeWidth: STROKE_START,
      });
      gsap.set(svgEl, { opacity: 1, pointerEvents: 'auto' });
      gsap.set(logoEl, { autoAlpha: 0 });

      document.body.classList.add('is-transitioning');

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.killTweensOf(logoText);
          hideAll();
          document.body.classList.remove('is-transitioning');
          busyRef.current = false;
        },
      });
      tlRef.current = tl;

      // Fase 1: coretan digambar & menebal sampai menutup layar
      tl.to(pathEl, { strokeDashoffset: 0, duration: DUR_IN, ease: 'power1.inOut' }, 0);
      tl.to(pathEl, { strokeWidth: STROKE_MAX, duration: DUR_IN, ease: 'power2.inOut' }, 0);

      // Logo muncul sambil bergoyang (efek stop-motion)
      tl.to(
        logoEl,
        {
          autoAlpha: 1,
          duration: DUR_IN * 0.5,
          ease: 'power2.out',
          onStart: () => {
            gsap.to(logoText, {
              rotation: 5,
              duration: 0.15,
              repeat: -1,
              yoyo: true,
              ease: 'steps(1)',
              overwrite: 'auto',
            });
          },
        },
        DUR_IN * 0.5
      );

      // Puncak: layar tertutup penuh
      tl.call(
        () => {
          if (!href) {
            window.scrollTo(0, 0);
          } else if (href.startsWith('#')) {
            window.scrollTo(0, 0);
            document.querySelector(href)?.scrollIntoView({ behavior: 'auto' });
          } else if (href.startsWith('/')) {
            navigate(href);
            window.scrollTo(0, 0);
          } else {
            window.location.href = href;
          }
        },
        null,
        DUR_IN
      );

      // Fase 2: coretan menyapu keluar, memperlihatkan halaman
      tl.to(pathEl, { strokeDashoffset: -l, duration: DUR_OUT, ease: 'power2.inOut' }, DUR_IN);
      tl.to(pathEl, { strokeWidth: STROKE_START, duration: DUR_OUT, ease: 'power2.inOut' }, DUR_IN);

      // Logo hilang di tengah fase keluar
      tl.to(logoEl, { autoAlpha: 0, duration: 0.2 }, DUR_IN + DUR_OUT * 0.48);
    };

    const handleClick = (e) => {
      const trigger = e.target.closest('.scribble-trigger');
      if (!trigger) return;
      e.preventDefault();
      const href = trigger.closest('a')?.getAttribute('href') || undefined;
      play(href);
    };
    document.addEventListener('click', handleClick);

    // --- INTRO saat halaman pertama kali dibuka ---
    let introTimer;
    const alreadyPlayed =
      INTRO_ONCE_PER_SESSION && sessionStorage.getItem('relearn-intro') === '1';
    if (!alreadyPlayed) {
      introTimer = setTimeout(() => {
        if (INTRO_ONCE_PER_SESSION) sessionStorage.setItem('relearn-intro', '1');
        play(undefined);
      }, 100);
    }

    return () => {
      clearTimeout(introTimer);
      document.removeEventListener('click', handleClick);
      tlRef.current?.kill();
      gsap.killTweensOf(logoText);
      document.body.classList.remove('is-transitioning');
      busyRef.current = false;
    };
  }, [navigate]);

  return createPortal(
    <>
      <div
        ref={logoRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex justify-center items-center select-none"
        style={{ zIndex: 10000, opacity: 0, visibility: 'hidden' }}
      >
        <span
          ref={logoTextRef}
          className="text-[40px] font-black px-6 py-2.5 rounded-full shadow-2xl"
          style={{ backgroundColor: '#181916', color: '#F8F6EF' }}
        >
          Re:Learn
        </span>
      </div>

      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3222 3114"
        fill="none"
        preserveAspectRatio="none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0,
          color: '#181916',
        }}
      >
        <path
          ref={pathRef}
          d={SCRIBBLE_PATH}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeWidth: 0 }}
        />
      </svg>
    </>,
    document.body
  );
}