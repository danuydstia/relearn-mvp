import { Link } from 'react-router-dom';
import TransitionScribble from '../components/TransitionScribble.jsx';

// 1. Import semua gambar dari folder assets/materials
import imgLearningWorkspace from '../assets/materials/Learning workspace collage.png';
import imgCommunityWorkspace from '../assets/materials/Community workspace collage.png';
import imgLearningRoute from '../assets/materials/Learning route preview.png';
import imgAIConversation from '../assets/materials/AI conversation collage.png';
import imgStep1 from '../assets/materials/Learning step card (1).png';
import imgStep2 from '../assets/materials/Learning step card (2).png';
import imgStep3 from '../assets/materials/Learning step card (3).png';
import imgStep4 from '../assets/materials/Learning step card.png';
import imgKeepLearning from '../assets/materials/Keep learning sticker.png';
import imgAchievementWorkspace from '../assets/materials/Achievement workspace.png'; 

export default function LandingPage() {
  return (
    <div className="w-full bg-[#F8F6EF] overflow-hidden flex flex-col font-['Inter'] text-[#181916] relative">
      
      {/* Panggil komponen animasi scribble di sini */}
      <TransitionScribble />

      {/* --- NAVBAR --- */}
      <nav className="h-[100px] px-16 border-b border-[#181916] flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2.5 cursor-pointer scribble-trigger">
          <div className="w-8 h-[34px] bg-[#181916]" />
          <div className="text-[25px] font-extrabold">ReLearn</div>
          <div className="text-[15px]">✱</div>
        </div>
        <div className="flex items-center gap-7 text-[14px]">
          <a href="#community" className="hover:underline">Community</a>
          <a href="#path" className="hover:underline">Learning Path</a>
          <a href="#ai" className="hover:underline">AI Chat Bot</a>
          <a href="#how" className="hover:underline">How it works</a>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-[14px] font-semibold hover:underline">Sign in</Link>
          {/* Tambahkan class 'scribble-trigger' agar tombol ini memicu animasi transisi coretan */}
          <Link to="/register" className="scribble-trigger h-[46px] px-6 bg-[#181916] text-[#F8F6EF] rounded-full text-[14px] font-semibold flex items-center gap-6 hover:bg-black transition-colors">
            Start learning
            <div className="w-5 h-5 border-2 border-[#D5F35B]" />
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="py-[70px] px-16 flex items-center gap-12">
        <div className="w-[680px] flex flex-col gap-7">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#181916]" />
            <span className="text-[13px] uppercase tracking-wider">Self-learning, your way.</span>
          </div>
          <h1 className="text-[108px] font-black leading-[1.05] tracking-tight">
            Not just<br />learning.<br />Getting it.
          </h1>
          <p className="w-[500px] text-[19px] leading-relaxed text-[#181916]/80">
            Turn a pile of materials into a clear path. Learn independently without feeling alone.
          </p>
          <div className="flex items-center gap-6 mt-4">
            <Link to="/register" className="scribble-trigger h-[60px] px-8 bg-[#181916] text-[#F8F6EF] rounded-full text-[16px] font-semibold flex items-center gap-6 hover:bg-black transition-colors">
              Start from your materials
              <div className="w-5 h-5 border-2 border-[#D5F35B]" />
            </Link>
            <a href="#how" className="text-[15px] font-semibold underline">See how it works ↓</a>
          </div>
          <p className="text-[12px] font-medium tracking-wide mt-2 opacity-70">
            YOUR MATERIALS. YOUR PACE. STILL GOT A STUDY BUDDY.
          </p>
        </div>
        <div className="flex-1 relative">
          {/* Gunakan variabel import untuk src */}
          <img 
            src={imgLearningWorkspace} 
            alt="Learning Workspace" 
            className="w-full max-w-[584px] object-contain drop-shadow-xl" 
          />
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="h-[60px] bg-[#181916] flex items-center justify-center gap-9 text-[#D5F35B] text-[16px] font-semibold tracking-widest uppercase">
        <span>Curiosity</span> <span>✱</span>
        <span>Small Steps</span> <span>✱</span>
        <span>Big Conversations</span> <span>✱</span>
        <span>Learn Your Way</span> <span>✱</span>
      </div>

      {/* --- WHY RELEARN --- */}
      <section className="py-24 px-16 flex flex-col gap-10">
        <div className="flex items-start gap-20">
          <div className="w-[220px] flex flex-col gap-7">
            <span className="text-[13px] font-semibold uppercase">Why ReLearn?</span>
            <h2 className="text-[22px] font-medium leading-snug -rotate-3">Lots of tabs open.<br/>But not much sticks.</h2>
          </div>
          <h2 className="flex-1 text-[58px] font-extrabold leading-tight">
            Your materials have direction.<br/>Your curiosity has room.
          </h2>
        </div>
        <hr className="border-[#181916] my-4" />
        <div className="flex gap-10">
          {[
            { step: '01 / MORE FOCUSED', title: 'Materials become steps, not a pile.', desc: 'Build a learning journey from the materials you want to master.' },
            { step: '02 / MORE STICKY', title: 'Not just read and forget.', desc: 'Ask questions, check understanding, and revisit what needs practice.' },
            { step: '03 / MORE TOGETHER', title: 'Independent does not mean alone.', desc: 'Find new perspectives through discussions and shared learning paths.' }
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-[#62645A]">{item.step}</span>
              <h3 className="text-[21px] font-bold">{item.title}</h3>
              <p className="text-[15px] text-[#62645A] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURE 1: COMMUNITY --- */}
      <section id="community" className="py-24 px-16 flex flex-col gap-12 border-t border-[#DCDDD2]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#181916] flex items-center justify-center font-semibold text-[12px]">01</div>
            <span className="text-[13px] font-semibold uppercase">Community</span>
          </div>
          <span className="text-[12px] opacity-70 tracking-wider">A SPACE TO ASK, SHARE, AND KEEP GOING.</span>
        </div>
        <div className="flex items-center gap-20">
          <div className="w-[510px] flex flex-col gap-7">
            <h2 className="text-[76px] font-black leading-none">Alone is okay.<br/>Quiet is not.</h2>
            <p className="text-[18px] leading-relaxed opacity-80 mt-2">
              Stuck on the same concept? Throw a question, swap notes, or peek at how others structure their learning path.
            </p>
            <ul className="flex flex-col gap-3.5 mt-2">
              <li className="flex items-center gap-3 text-[15px]"><span className="text-[18px]">↗</span> Topic-based discussions for what you are learning</li>
              <li className="flex items-center gap-3 text-[15px]"><span className="text-[18px]">↗</span> Share the learning path you built</li>
              <li className="flex items-center gap-3 text-[15px]"><span className="text-[18px]">↗</span> Save ideas from fresh perspectives</li>
            </ul>
            <Link to="/register" className="scribble-trigger h-[60px] w-fit px-8 mt-4 bg-[#181916] text-[#F8F6EF] rounded-full text-[16px] font-semibold flex items-center gap-6 hover:bg-black transition-colors">
              Find your study buddy
              <div className="w-5 h-5 border-2 border-[#D5F35B]" />
            </Link>
          </div>
          <div className="flex-1">
            <img src={imgCommunityWorkspace} alt="Community workspace" className="w-full object-contain" />
          </div>
        </div>
      </section>

      {/* --- FEATURE 2: LEARNING PATH --- */}
      <section id="path" className="py-24 px-16 flex flex-col gap-12 border-t border-[#DCDDD2]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#181916] flex items-center justify-center font-semibold text-[12px]">02</div>
            <span className="text-[13px] font-semibold uppercase">Learning Path</span>
          </div>
          <span className="text-[12px] opacity-70 tracking-wider">ONE GOAL. A PATH YOU CAN FOLLOW.</span>
        </div>
        <div className="flex items-center gap-20">
          <div className="w-[674px]">
            <img src={imgLearningRoute} alt="Learning Path" className="w-full object-contain" />
          </div>
          <div className="flex-1 flex flex-col gap-7">
            <h2 className="text-[73px] font-black leading-[0.95]">From “where do I start?”<br/>to “oh, I get it!”</h2>
            <p className="text-[18px] leading-relaxed opacity-80 mt-2">
              Upload your materials, then turn them into a structured path. Break big topics into small steps with material and quizzes to check understanding.
            </p>
            <div className="flex gap-2 mt-2">
              <span className="px-4 py-2 bg-white rounded-full border border-[#181916] text-[12px] font-medium">Your materials</span>
              <span className="px-4 py-2 bg-white rounded-full border border-[#181916] text-[12px] font-medium">Structured steps</span>
              <span className="px-4 py-2 bg-white rounded-full border border-[#181916] text-[12px] font-medium">Quiz</span>
            </div>
            <Link to="/register" className="scribble-trigger h-[60px] w-fit px-8 mt-4 bg-[#181916] text-[#F8F6EF] rounded-full text-[16px] font-semibold flex items-center gap-6 hover:bg-black transition-colors">
              Build your learning path
              <div className="w-5 h-5 border-2 border-[#D5F35B]" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURE 3: AI CHAT BOT --- */}
      <section id="ai" className="py-24 px-16 flex flex-col gap-12 border-t border-[#DCDDD2]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#181916] flex items-center justify-center font-semibold text-[12px]">03</div>
            <span className="text-[13px] font-semibold uppercase">AI Chat Bot</span>
          </div>
          <span className="text-[12px] opacity-70 tracking-wider">FROM CONFUSION TO CLARITY.</span>
        </div>
        <div className="flex items-center gap-20">
          <div className="w-[510px] flex flex-col gap-7">
            <h2 className="text-[76px] font-black leading-none">Ask again.<br/>Until it clicks.</h2>
            <p className="text-[18px] leading-relaxed opacity-80 mt-2">
              Got a concept that still does not make sense? Ask the AI Chat Bot about your materials. Ask for a simpler explanation, another example, or a quick practice question.
            </p>
            <p className="flex gap-3 text-[15px] opacity-80 bg-white/50 p-4 rounded-xl border border-[#181916]/20">
              <span className="text-[18px]">💡</span> A thinking companion, not a shortcut. You stay in control of your learning.
            </p>
            <Link to="/register" className="scribble-trigger h-[60px] w-fit px-8 mt-4 bg-[#181916] text-[#F8F6EF] rounded-full text-[16px] font-semibold flex items-center gap-6 hover:bg-black transition-colors">
              Meet your AI Chat Bot
              <div className="w-5 h-5 border-2 border-[#D5F35B]" />
            </Link>
            <span className="text-[12px] text-[#62645A] mt-2">AI can be wrong. Always check answers against your source materials.</span>
          </div>
          <div className="flex-1">
            <img src={imgAIConversation} alt="AI Conversation" className="w-full object-contain drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how" className="py-24 px-16 flex flex-col gap-10 border-t border-[#DCDDD2]">
        <span className="text-[13px] font-semibold uppercase">How It Works</span>
        <div className="flex items-end gap-20 mb-10">
          <h2 className="text-[86px] font-black leading-none">From materials.<br/>To understanding.</h2>
          <p className="flex-1 text-[18px] leading-relaxed pb-4">
            You do not have to be great right away. Start with one material, then follow these four steps.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <img src={imgStep1} alt="Step 1" className="w-full hover:-translate-y-2 transition-transform cursor-pointer" />
          <img src={imgStep2} alt="Step 2" className="w-full hover:-translate-y-2 transition-transform cursor-pointer" />
          <img src={imgStep3} alt="Step 3" className="w-full hover:-translate-y-2 transition-transform cursor-pointer" />
          <img src={imgStep4} alt="Step 4" className="w-full hover:-translate-y-2 transition-transform cursor-pointer" />
        </div>
      </section>

      {/* --- PROGRESS & REWARDS --- */}
      <section className="py-24 px-16 flex items-center gap-24 border-t border-[#DCDDD2]">
        <div className="w-[550px] flex flex-col gap-7">
          <span className="text-[13px] font-semibold uppercase">Progress & Rewards</span>
          <h2 className="text-[72px] font-black leading-[1]">Slowly.<br/>You are moving.</h2>
          <p className="text-[18px] leading-relaxed opacity-80">
            One path finished is one reason to feel proud. See your progress, collect tokens, and unlock achievements from the steps you complete.
          </p>
          <p className="text-[16px] font-semibold">It is not about who is fastest. It is about you keeping momentum.</p>
          <div className="flex gap-2 mt-2">
            {['Personal progress', 'Tokens', 'Achievements'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-[#ABE0F2] rounded-full border border-[#181916] text-[12px] font-medium">{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
           <img 
             src={imgAchievementWorkspace} 
             alt="Achievement Workspace" 
             className="w-full object-contain" 
           />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-24 pb-8 px-16 bg-[#181916] flex flex-col gap-14 text-[#F8F6EF]">
        <div className="flex flex-col gap-8">
          <span className="text-[#D5F35B] text-[13px] font-semibold tracking-wider">ONE MATERIAL. MANY POSSIBILITIES.</span>
          <div className="flex justify-between items-center gap-12">
            <h2 className="flex-1 text-[98px] font-black leading-none text-white">Start now.<br/>Understanding follows.</h2>
            <img src={imgKeepLearning} alt="Keep Learning" className="w-[158px] h-[158px] object-contain -rotate-12" />
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="w-[570px] text-[18px] opacity-80 leading-relaxed">
              Bring your curiosity. Upload your first material, build your path, and find a space to keep learning.
            </p>
            <Link to="/register" className="scribble-trigger h-[60px] px-8 bg-[#D5F35B] text-[#181916] rounded-full text-[16px] font-semibold flex items-center gap-6 hover:bg-[#c2e04e] transition-colors">
              Start your learning journey
              <div className="w-5 h-5 border-2 border-[#181916]" />
            </Link>
          </div>
        </div>

        <hr className="border-[#3A3D33] my-4" />

        <div className="flex justify-between items-start">
          <div className="w-[380px] flex flex-col gap-4">
            <span className="text-[#D5F35B] text-[24px] font-extrabold">ReLearn ✱</span>
            <p className="text-[14px] opacity-80 leading-relaxed">
              A space for curiosity to have direction. Learn independently, grow together.
            </p>
          </div>
          <div className="flex gap-20">
            <div className="flex flex-col gap-4">
              <span className="text-[#D5F35B] text-[10px] font-bold tracking-widest">EXPLORE</span>
              <a href="#community" className="text-[13px] hover:text-[#D5F35B] transition-colors">Community</a>
              <a href="#path" className="text-[13px] hover:text-[#D5F35B] transition-colors">Learning Path</a>
              <a href="#ai" className="text-[13px] hover:text-[#D5F35B] transition-colors">AI Chat Bot</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#D5F35B] text-[10px] font-bold tracking-widest">GET STARTED</span>
              <a href="#how" className="text-[13px] hover:text-[#D5F35B] transition-colors">How it works</a>
              <Link to="/login" className="text-[13px] hover:text-[#D5F35B] transition-colors">Sign in</Link>
              <Link to="/register" className="text-[13px] hover:text-[#D5F35B] transition-colors">Start learning</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#D5F35B] text-[10px] font-bold tracking-widest">ABOUT</span>
              <a href="#" className="text-[13px] hover:text-[#D5F35B] transition-colors">About ReLearn</a>
              <a href="#" className="text-[13px] hover:text-[#D5F35B] transition-colors">Privacy policy</a>
              <a href="#" className="text-[13px] hover:text-[#D5F35B] transition-colors">Terms of use</a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-10">
          <h1 className="flex-1 text-[#D5F35B] text-[161px] font-black leading-none">ReLearn</h1>
        </div>

        <div className="flex justify-between items-center mt-6 text-[11px] opacity-60">
          <span>© 2026 ReLearn. Stay curious, keep learning.</span>
          <button onClick={() => window.scrollTo(0,0)} className="text-[#D5F35B] hover:underline">Back to top ↑</button>
          <span>English / EN</span>
        </div>
      </footer>
    </div>
  );
}