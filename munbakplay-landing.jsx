import { useState, useEffect, useRef } from "react";

const BRAND = {
  primary: "#FF5E1A",
  primaryLight: "#FF8A50",
  accent: "#00E676",
  dark: "#0A0A0A",
  darkCard: "#141414",
  darkSurface: "#1A1A1A",
  gray: "#888888",
  lightGray: "#CCCCCC",
  white: "#F5F5F5",
};

// Countdown Intro Component
function CountdownIntro({ onComplete }) {
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState("counting"); // counting, start, fadeout
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (phase === "counting") {
      if (count > 0) {
        setScale(1.5);
        const shrink = setTimeout(() => setScale(0.8), 400);
        const next = setTimeout(() => {
          setCount(count - 1);
          setScale(1);
        }, 900);
        return () => { clearTimeout(shrink); clearTimeout(next); };
      } else {
        setPhase("start");
      }
    }
    if (phase === "start") {
      const t = setTimeout(() => setPhase("fadeout"), 1200);
      return () => clearTimeout(t);
    }
    if (phase === "fadeout") {
      const t = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(t);
    }
  }, [count, phase, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(180deg, #0A0A0A 0%, #1a0800 50%, #0A0A0A 100%)`,
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {/* Track lines */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.15 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: 0, right: 0,
            top: `${12 + i * 10}%`,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${BRAND.primary} 20%, ${BRAND.primary} 80%, transparent 100%)`,
          }} />
        ))}
      </div>

      {/* Particle dots */}
      {phase === "start" && [...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: i % 2 === 0 ? BRAND.primary : BRAND.accent,
          left: `${50 + (Math.random() - 0.5) * 60}%`,
          top: `${50 + (Math.random() - 0.5) * 60}%`,
          animation: `particle ${0.5 + Math.random() * 0.5}s ease-out forwards`,
          opacity: 0.8,
        }} />
      ))}

      <div style={{ textAlign: "center", position: "relative" }}>
        {/* Runner silhouette hint */}
        <div style={{
          position: "absolute",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "80px",
          opacity: phase === "counting" && count > 0 ? 0.08 : 0,
          transition: "opacity 0.5s",
          filter: "blur(1px)",
        }}>
          🏃
        </div>

        {phase === "counting" && count > 0 && (
          <div style={{
            fontSize: "clamp(120px, 25vw, 200px)",
            fontFamily: "'Do Hyeon', sans-serif",
            fontWeight: 900,
            color: BRAND.white,
            transform: `scale(${scale})`,
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            textShadow: `0 0 60px ${BRAND.primary}66, 0 0 120px ${BRAND.primary}33`,
            lineHeight: 1,
          }}>
            {count}
          </div>
        )}

        {phase === "counting" && count === 0 && null}

        {(phase === "start" || phase === "fadeout") && (
          <div style={{
            animation: "startBurst 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}>
            <div style={{
              fontSize: "clamp(60px, 15vw, 120px)",
              fontFamily: "'Do Hyeon', sans-serif",
              fontWeight: 900,
              background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.15em",
              lineHeight: 1,
            }}>
              START
            </div>
            <div style={{
              marginTop: "16px",
              fontSize: "14px",
              color: BRAND.gray,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0,
              animation: "fadeUp 0.4s 0.3s forwards",
            }}>
              문밖플레이
            </div>
          </div>
        )}

        {/* Progress bar */}
        {phase === "counting" && (
          <div style={{
            position: "absolute",
            bottom: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120px",
            height: "3px",
            background: BRAND.darkSurface,
            borderRadius: "2px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent})`,
              width: `${((3 - count) / 3) * 100}%`,
              transition: "width 0.9s linear",
              borderRadius: "2px",
            }} />
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        @keyframes startBurst {
          0% { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes particle {
          0% { transform: scale(1) translate(0, 0); opacity: 0.8; }
          100% { transform: scale(0) translate(${Math.random()*100-50}px, ${Math.random()*100-50}px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Animated number counter
function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(interval); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

// Event Card Component
function EventCard({ event, index }) {
  const [hovered, setHovered] = useState(false);
  
  const difficultyColors = {
    "초급": BRAND.accent,
    "중급": "#FFD600",
    "상급": BRAND.primary,
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: BRAND.darkCard,
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${hovered ? BRAND.primary + "44" : "#ffffff08"}`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        cursor: "pointer",
        opacity: 0,
        animation: `cardIn 0.6s ${0.1 * index}s forwards`,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: "180px",
        background: `linear-gradient(135deg, ${BRAND.darkSurface}, ${BRAND.primary}15)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ fontSize: "48px", opacity: 0.6 }}>{event.emoji}</div>
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: difficultyColors[event.difficulty] + "22",
          color: difficultyColors[event.difficulty],
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
          border: `1px solid ${difficultyColors[event.difficulty]}44`,
        }}>
          {event.difficulty}
        </div>
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          background: BRAND.primary,
          color: BRAND.white,
          padding: "4px 10px",
          borderRadius: "8px",
          fontSize: "11px",
          fontWeight: 700,
        }}>
          {event.category}
        </div>
      </div>
      
      {/* Info */}
      <div style={{ padding: "20px" }}>
        <h3 style={{
          fontFamily: "'Noto Sans KR', sans-serif",
          fontWeight: 700,
          fontSize: "17px",
          color: BRAND.white,
          marginBottom: "12px",
          lineHeight: 1.4,
        }}>
          {event.title}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>📅</span>
            <span style={{ color: BRAND.lightGray, fontSize: "13px" }}>{event.date}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>📍</span>
            <span style={{ color: BRAND.lightGray, fontSize: "13px" }}>{event.location}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>👥</span>
            <span style={{ color: BRAND.lightGray, fontSize: "13px" }}>{event.participants}</span>
          </div>
        </div>
        <button style={{
          width: "100%",
          marginTop: "16px",
          padding: "12px",
          background: hovered ? BRAND.primary : "transparent",
          border: `1px solid ${BRAND.primary}`,
          borderRadius: "10px",
          color: hovered ? BRAND.white : BRAND.primary,
          fontFamily: "'Noto Sans KR', sans-serif",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.3s",
        }}>
          자세히 보기 →
        </button>
      </div>
    </div>
  );
}

// Feature Item
function FeatureItem({ icon, title, desc, index }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "32px 24px",
      background: BRAND.darkCard,
      borderRadius: "16px",
      border: `1px solid #ffffff08`,
      opacity: 0,
      animation: `cardIn 0.6s ${0.15 * index}s forwards`,
      transition: "border-color 0.3s",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = BRAND.primary + "33"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "#ffffff08"}
    >
      <div style={{
        width: "64px",
        height: "64px",
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${BRAND.primary}22, ${BRAND.accent}11)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        fontSize: "28px",
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: 700,
        fontSize: "18px",
        color: BRAND.white,
        marginBottom: "10px",
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: 300,
        fontSize: "14px",
        color: BRAND.gray,
        lineHeight: 1.7,
      }}>
        {desc}
      </p>
    </div>
  );
}

// Main Landing Page
export default function MunbakPlayLanding() {
  const [showIntro, setShowIntro] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const events = [
    {
      title: "2026 춘천 마라톤 대회",
      date: "2026.04.12 (일)",
      location: "강원도 춘천시",
      category: "마라톤",
      difficulty: "중급",
      participants: "3,000명 모집",
      emoji: "🏃",
    },
    {
      title: "지리산 트레일러닝 챌린지",
      date: "2026.05.03 (토)",
      location: "전남 구례군",
      category: "트레일러닝",
      difficulty: "상급",
      participants: "500명 모집",
      emoji: "⛰️",
    },
    {
      title: "한강 선셋 러닝 페스티벌",
      date: "2026.03.22 (토)",
      location: "서울 여의도",
      category: "러닝",
      difficulty: "초급",
      participants: "2,000명 모집",
      emoji: "🌅",
    },
  ];

  const features = [
    { icon: "🔍", title: "한눈에 찾기", desc: "전국 아웃도어 대회를 종목별, 지역별, 난이도별로 한 번에 검색하세요." },
    { icon: "📱", title: "간편 신청", desc: "복잡한 절차 없이 몇 번의 탭으로 대회 참가 신청을 완료하세요." },
    { icon: "🗺️", title: "GPX 코스 확인", desc: "대회 코스를 미리 확인하고, 나만의 훈련 계획을 세워보세요." },
    { icon: "🔔", title: "맞춤 알림", desc: "관심 종목의 새 대회가 등록되면 가장 먼저 알려드립니다." },
  ];

  if (showIntro) {
    return <CountdownIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div style={{
      background: BRAND.dark,
      color: BRAND.white,
      minHeight: "100vh",
      fontFamily: "'Noto Sans KR', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${BRAND.primary}44; color: ${BRAND.white}; }
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroIn {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideRight {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: `${BRAND.dark}CC`,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid #ffffff08`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Do Hyeon', sans-serif",
            fontWeight: 900,
            fontSize: "16px",
            color: BRAND.white,
          }}>
            M
          </div>
          <span style={{
            fontFamily: "'Do Hyeon', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            letterSpacing: "0.05em",
          }}>
            MUNBAK<span style={{ color: BRAND.primary }}>PLAY</span>
          </span>
        </div>
        <button style={{
          padding: "10px 24px",
          background: "transparent",
          border: `1px solid ${BRAND.primary}`,
          borderRadius: "8px",
          color: BRAND.primary,
          fontFamily: "'Noto Sans KR', sans-serif",
          fontWeight: 700,
          fontSize: "13px",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={e => { e.target.style.background = BRAND.primary; e.target.style.color = BRAND.white; }}
        onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = BRAND.primary; }}
        >
          사전 알림 신청
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}>
        {/* Background effects */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${BRAND.primary}12 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 80%, ${BRAND.accent}08 0%, transparent 50%)`,
        }} />
        
        {/* Grid pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(#ffffff04 1px, transparent 1px), linear-gradient(90deg, #ffffff04 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        <div style={{
          textAlign: "center",
          position: "relative",
          maxWidth: "800px",
          animation: "heroIn 1s ease-out",
        }}>
          <div style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "20px",
            background: `${BRAND.primary}15`,
            border: `1px solid ${BRAND.primary}33`,
            marginBottom: "28px",
            fontSize: "13px",
            fontWeight: 500,
            color: BRAND.primaryLight,
            letterSpacing: "0.05em",
          }}>
            🚀 2026년 상반기 런칭 예정
          </div>

          <h1 style={{
            fontFamily: "'Do Hyeon', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 8vw, 72px)",
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-0.02em",
          }}>
            문 밖을 나서면<br />
            <span style={{
              background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              대회가 시작된다
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2.5vw, 19px)",
            color: BRAND.gray,
            lineHeight: 1.8,
            marginBottom: "40px",
            fontWeight: 300,
            maxWidth: "560px",
            margin: "0 auto 40px",
          }}>
            전국의 러닝, 트레일러닝, 사이클, 등산 대회를<br />
            한곳에서 찾고, 한 번에 신청하세요.
          </p>

          {/* CTA */}
          {!submitted ? (
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              maxWidth: "480px",
              margin: "0 auto",
            }}>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "240px",
                  padding: "16px 20px",
                  background: BRAND.darkSurface,
                  border: `1px solid #ffffff15`,
                  borderRadius: "12px",
                  color: BRAND.white,
                  fontSize: "15px",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={e => e.target.style.borderColor = BRAND.primary}
                onBlur={e => e.target.style.borderColor = "#ffffff15"}
              />
              <button
                onClick={() => emailInput && setSubmitted(true)}
                style={{
                  padding: "16px 32px",
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
                  border: "none",
                  borderRadius: "12px",
                  color: BRAND.white,
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.3s",
                  boxShadow: `0 4px 24px ${BRAND.primary}44`,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
              >
                사전 알림 받기
              </button>
            </div>
          ) : (
            <div style={{
              padding: "20px 32px",
              background: `${BRAND.accent}15`,
              border: `1px solid ${BRAND.accent}33`,
              borderRadius: "12px",
              display: "inline-block",
            }}>
              <span style={{ color: BRAND.accent, fontWeight: 700 }}>✓ 등록 완료!</span>
              <span style={{ color: BRAND.lightGray, marginLeft: "8px" }}>런칭 소식을 가장 먼저 전해드릴게요.</span>
            </div>
          )}

          <p style={{
            marginTop: "16px",
            fontSize: "13px",
            color: "#555",
          }}>
            이미 <span style={{ color: BRAND.primary, fontWeight: 700 }}>400+</span>명이 사전 등록했습니다
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          animation: "pulse 2s infinite",
        }}>
          <span style={{ fontSize: "11px", color: BRAND.gray, letterSpacing: "0.2em" }}>SCROLL</span>
          <div style={{ width: "1px", height: "24px", background: `linear-gradient(to bottom, ${BRAND.gray}, transparent)` }} />
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: "60px 24px",
        borderTop: `1px solid #ffffff08`,
        borderBottom: `1px solid #ffffff08`,
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "32px",
          textAlign: "center",
        }}>
          {[
            { num: 1200, suffix: "+", label: "등록된 대회", icon: "🏆" },
            { num: 400, suffix: "+", label: "사전 등록자", icon: "👥" },
            { num: 25, suffix: "개", label: "종목 카테고리", icon: "🎯" },
            { num: 17, suffix: "개", label: "제휴 지자체", icon: "🤝" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "16px" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{
                fontFamily: "'Do Hyeon', sans-serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 900,
                background: `linear-gradient(135deg, ${BRAND.white}, ${BRAND.primary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                <AnimatedCounter target={stat.num} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: "14px", color: BRAND.gray, marginTop: "4px", fontWeight: 400 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem / Solution */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            fontSize: "13px",
            color: BRAND.primary,
            fontWeight: 700,
            letterSpacing: "0.15em",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}>
            WHY MUNBAKPLAY?
          </div>
          <h2 style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(24px, 5vw, 40px)",
            lineHeight: 1.4,
            marginBottom: "24px",
          }}>
            대회 정보, 아직도<br />
            <span style={{ color: BRAND.primary }}>여기저기 흩어져</span> 찾고 계신가요?
          </h2>
          <p style={{
            fontSize: "16px",
            color: BRAND.gray,
            lineHeight: 2,
            fontWeight: 300,
          }}>
            카페, 블로그, 각종 사이트에 흩어진 대회 정보를<br />
            하나하나 찾아다니는 건 이제 그만.<br />
            <span style={{ color: BRAND.lightGray, fontWeight: 500 }}>
              문밖플레이가 전국의 아웃도어 대회를 한곳에 모았습니다.
            </span>
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "40px 24px 100px" }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}>
          {features.map((f, i) => (
            <FeatureItem key={i} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* Events Preview */}
      <section style={{
        padding: "100px 24px",
        background: `linear-gradient(180deg, ${BRAND.dark} 0%, ${BRAND.darkSurface} 50%, ${BRAND.dark} 100%)`,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{
              fontSize: "13px",
              color: BRAND.accent,
              fontWeight: 700,
              letterSpacing: "0.15em",
              marginBottom: "16px",
            }}>
              UPCOMING EVENTS
            </div>
            <h2 style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(24px, 5vw, 36px)",
            }}>
              지금 주목할 대회
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}>
            {events.map((event, i) => (
              <EventCard key={i} event={event} index={i} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button style={{
              padding: "14px 40px",
              background: "transparent",
              border: `1px solid #ffffff20`,
              borderRadius: "10px",
              color: BRAND.lightGray,
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.target.style.borderColor = BRAND.primary; e.target.style.color = BRAND.primary; }}
            onMouseLeave={e => { e.target.style.borderColor = "#ffffff20"; e.target.style.color = BRAND.lightGray; }}
            >
              전체 대회 보기 →
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${BRAND.primary}10 0%, transparent 70%)`,
        }} />
        <div style={{ position: "relative" }}>
          <h2 style={{
            fontFamily: "'Do Hyeon', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px, 6vw, 52px)",
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}>
            문 밖으로 나갈 준비,<br />
            <span style={{ color: BRAND.primary }}>되셨나요?</span>
          </h2>
          <p style={{
            color: BRAND.gray,
            fontSize: "16px",
            marginBottom: "36px",
            fontWeight: 300,
          }}>
            런칭 알림을 받고, 가장 먼저 대회를 만나보세요.
          </p>
          <button
            style={{
              padding: "18px 48px",
              background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
              border: "none",
              borderRadius: "14px",
              color: BRAND.white,
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: "17px",
              cursor: "pointer",
              boxShadow: `0 8px 32px ${BRAND.primary}44`,
              transition: "transform 0.2s, box-shadow 0.3s",
            }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = `0 12px 40px ${BRAND.primary}66`; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = `0 8px 32px ${BRAND.primary}44`; }}
          >
            사전 알림 신청하기 →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "40px 24px",
        borderTop: `1px solid #ffffff08`,
        textAlign: "center",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "16px",
        }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Do Hyeon', sans-serif",
            fontWeight: 900,
            fontSize: "13px",
          }}>
            M
          </div>
          <span style={{
            fontFamily: "'Do Hyeon', sans-serif",
            fontWeight: 700,
            fontSize: "16px",
          }}>
            MUNBAK<span style={{ color: BRAND.primary }}>PLAY</span>
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "#444" }}>
          © 2026 MunbakPlay. All rights reserved.
        </p>
        <div style={{ marginTop: "12px", display: "flex", gap: "16px", justifyContent: "center" }}>
          {["Instagram", "Blog", "Contact"].map(item => (
            <span key={item} style={{
              fontSize: "12px",
              color: BRAND.gray,
              cursor: "pointer",
              transition: "color 0.3s",
            }}
            onMouseEnter={e => e.target.style.color = BRAND.primary}
            onMouseLeave={e => e.target.style.color = BRAND.gray}
            >
              {item}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
