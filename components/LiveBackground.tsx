
import React from 'react';

const LiveBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* تأثير المطر الخفيف (Raindrops) */}
      <div className="absolute inset-0 z-[1]">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="rain-drop absolute bg-gradient-to-b from-transparent to-blue-200/40 w-[1px] h-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* تأثير الشاطئ والأمواج المتداخلة (Beach Waves) */}
      <div className="absolute inset-0 z-[0] opacity-40">
        <svg
          className="waves absolute bottom-0 w-full h-[35vh] min-h-[200px]"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(59, 130, 246, 0.05)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(59, 130, 246, 0.1)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(99, 102, 241, 0.05)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="url(#wave-gradient)" />
          </g>
        </svg>
      </div>

      {/* توهج ضوئي خافت (Ambient Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-200/20 blur-[100px] rounded-full animate-pulse [animation-delay:2s]"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* تحريك الأمواج */
        .parallax > use {
          animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }
        .parallax > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 12s;
        }
        .parallax > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 15s;
        }
        .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 20s;
        }
        .parallax > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 25s;
        }

        @keyframes move-forever {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }

        /* تحريك المطر */
        .rain-drop {
          animation: rain-fall linear infinite;
        }

        @keyframes rain-fall {
          0% {
            transform: translateY(0vh) rotate(15deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(15deg);
            opacity: 0;
          }
        }

        /* تحسين استهلاك المعالج */
        @media (prefers-reduced-motion: reduce) {
          .parallax > use, .rain-drop {
            animation: none;
          }
        }
      `}} />
    </div>
  );
};

export default LiveBackground;
