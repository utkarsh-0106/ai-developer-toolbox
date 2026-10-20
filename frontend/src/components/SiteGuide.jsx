import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./site-guide.css";

const TOUR_STEPS = [
  { path: "/", selector: "#home", title: "Welcome to your AI workbench", body: "AI Developer Toolbox helps you understand, explore, review, and debug code with AI. This guide will show you the main workflows." },
  { path: "/", selector: "#repository", title: "Connect a GitHub repository", body: "Paste a repository URL and choose Analyze to preview its metadata. Sign in to index it, then explore files, architecture, grounded AI chat, and retrieval insights." },
  { path: "/", selector: "#workspace", title: "Ask general engineering questions", body: "Use the AI Workspace for questions that do not require an indexed repository. Your generated answer appears beside the prompt form." },
  { path: "/history", selector: "[data-guide='history-title']", title: "Revisit prompt history", body: "Prompt history lists previous questions and responses. You can review past work and delete an entry when needed." },
];

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};
const writeStored = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ }
};

function HologramBot() {
  return (
    <svg className="adt-bot-svg" viewBox="0 0 160 210" role="img" aria-label="Gold armored holographic AI companion">
      <defs>
        <linearGradient id="adtArmor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff4c4"/><stop offset=".18" stopColor="#e9c76c"/><stop offset=".46" stopColor="#76531c"/><stop offset=".7" stopColor="#171611"/><stop offset="1" stopColor="#d9b45a"/></linearGradient>
        <linearGradient id="adtArmorLight" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stopColor="#fff6cc"/><stop offset=".42" stopColor="#c9a34b"/><stop offset="1" stopColor="#4b3615"/></linearGradient>
        <linearGradient id="adtVisor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#080a0c"/><stop offset=".65" stopColor="#17170f"/><stop offset="1" stopColor="#4a3514"/></linearGradient>
        <radialGradient id="adtReactor"><stop offset="0" stopColor="#fffde4"/><stop offset=".28" stopColor="#fff0a0"/><stop offset=".58" stopColor="#f5c94f" stopOpacity=".85"/><stop offset="1" stopColor="#d99c20" stopOpacity="0"/></radialGradient>
        <filter id="adtArmorGlow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* projection field */}
      <ellipse cx="80" cy="198" rx="40" ry="5" fill="#f2cb61" opacity=".13"/>
      <ellipse cx="80" cy="196" rx="28" ry="2.5" fill="#ffe9a0" opacity=".78" filter="url(#adtArmorGlow)"/>
      <path d="M34 165 Q80 145 126 165 L117 188 Q80 201 43 188 Z" fill="#c7a34b" opacity=".09" stroke="#d8b65a" strokeOpacity=".55"/>
      {/* shoulder armour */}
      <path d="M44 95 Q27 91 20 107 L12 130 Q19 143 39 138 L53 119 Z" fill="url(#adtArmor)" stroke="#f2d47c" strokeWidth="1.5"/>
      <path d="M116 95 Q133 91 140 107 L148 130 Q141 143 121 138 L107 119 Z" fill="url(#adtArmor)" stroke="#f2d47c" strokeWidth="1.5"/>
      <path d="M21 117 L34 111 L40 129 M139 117 L126 111 L120 129" fill="none" stroke="#ffe9a0" strokeWidth="2" opacity=".8"/>
      {/* arms */}
      <path d="M28 133 L20 153 Q22 164 34 165 L45 148 L43 136 Z M132 133 L140 153 Q138 164 126 165 L115 148 L117 136 Z" fill="url(#adtArmorLight)" stroke="#b9923a" strokeWidth="1.4"/>
      <path d="M24 151 L36 155 M136 151 L124 155" stroke="#fff0ad" strokeWidth="2"/>
      {/* torso */}
      <path d="M48 103 L112 103 L125 158 Q106 176 80 177 Q54 176 35 158 Z" fill="url(#adtArmor)" stroke="#f0d17a" strokeWidth="1.8"/>
      <path d="M51 111 L63 118 L57 150 L44 155 L40 143 Z M109 111 L97 118 L103 150 L116 155 L120 143 Z" fill="#17150e" stroke="#b38b34" strokeWidth="1.1"/>
      <path d="M63 117 L80 125 L97 117 L103 151 Q80 164 57 151 Z" fill="#17160f" stroke="#d6b45b" strokeWidth="1.4"/>
      <circle cx="80" cy="140" r="19" fill="url(#adtReactor)" filter="url(#adtArmorGlow)"/>
      <circle cx="80" cy="140" r="11" fill="#fff0a2" stroke="#fff6c8" strokeWidth="1.6"/>
      <circle cx="80" cy="140" r="5" fill="#fffef1"/>
      <path d="M51 160 L62 166 M109 160 L98 166" stroke="#f7dc89" strokeWidth="2" strokeLinecap="round"/>
      {/* neck and helmet */}
      <path d="M67 84 L67 99 Q80 108 93 99 L93 84 Z" fill="url(#adtArmorLight)" stroke="#d8b65a" strokeWidth="1.3"/>
      <path d="M48 31 Q53 12 80 10 Q107 12 112 31 L109 66 Q106 84 80 94 Q54 84 51 66 Z" fill="url(#adtArmor)" stroke="#f8df8d" strokeWidth="1.8"/>
      <path d="M54 32 L66 19 L80 17 L94 19 L106 32 L101 43 L59 43 Z" fill="#161711" stroke="#caa74e" strokeWidth="1.2"/>
      <path d="M57 45 Q80 37 103 45 L100 64 Q80 78 60 64 Z" fill="url(#adtVisor)" stroke="#e6c465" strokeWidth="1.4"/>
      <path d="M61 51 L74 48 L70 56 L61 59 Z M99 51 L86 48 L90 56 L99 59 Z" fill="#fff0a0" filter="url(#adtArmorGlow)"/>
      <path d="M68 69 L80 74 L92 69 L88 80 L80 84 L72 80 Z" fill="#241d10" stroke="#d5b253" strokeWidth="1.1"/>
      <path d="M49 36 L42 48 L46 65 L54 69 M111 36 L118 48 L114 65 L106 69" fill="url(#adtArmorLight)" stroke="#f0d17a" strokeWidth="1.5"/>
      <circle cx="46" cy="54" r="5" fill="#1b180f" stroke="#f3d47c" strokeWidth="1.5"/><circle cx="114" cy="54" r="5" fill="#1b180f" stroke="#f3d47c" strokeWidth="1.5"/>
      {/* crown and fine holographic marks */}
      <path d="M80 10 L80 4 M74 5 L86 5" stroke="#fff0a5" strokeWidth="1.7" strokeLinecap="round"/><circle cx="80" cy="3" r="2.3" fill="#fff6bf" filter="url(#adtArmorGlow)"/>
      <path d="M45 79 L39 91 M115 79 L121 91 M61 95 L61 101 M99 95 L99 101" stroke="#ffe7a0" strokeWidth="1.3" opacity=".8"/>
    </svg>
  );
}
function SiteGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => readStored("adt_guide_dismissed", false) !== true);
  const [minimized, setMinimized] = useState(() => readStored("adt_guide_minimized", false));
  const [tourActive, setTourActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(() => Math.min(Math.max(readStored("adt_guide_step", 0), 0), TOUR_STEPS.length - 1));
  const [targetMissing, setTargetMissing] = useState(false);
  const [completed, setCompleted] = useState(() => readStored("adt_guide_completed", false));
  const targetRef = useRef(null);
  const currentStep = tourActive ? TOUR_STEPS[stepIndex] : null;
  const isCurrentRoute = currentStep?.path === location.pathname;
  const pageContext = useMemo(() => {
    if (location.pathname === "/history") return { title: "Prompt history", body: "Review previous prompts and responses here. Use the workspace link to return to your tools." };
    return { title: "Your AI developer companion", body: "Choose a tour step, or start the full tour to explore repository intelligence, the AI workspace, and supporting pages." };
  }, [location.pathname]);

  const focusCurrentTarget = useCallback(() => {
    document.querySelectorAll(".adt-guide-target").forEach((node) => node.classList.remove("adt-guide-target"));
    targetRef.current = null;
    if (!tourActive || !currentStep || currentStep.path !== location.pathname) {
      setTargetMissing(false);
      return;
    }
    const target = document.querySelector(currentStep.selector);
    if (!target) {
      setTargetMissing(true);
      return;
    }
    setTargetMissing(false);
    target.classList.add("adt-guide-target");
    targetRef.current = target;
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center", inline: "nearest" });
  }, [currentStep, location.pathname, tourActive]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(focusCurrentTarget);
    const onResize = () => focusCurrentTarget();
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      targetRef.current?.classList.remove("adt-guide-target");
    };
  }, [focusCurrentTarget]);

  useEffect(() => {
    if (tourActive) writeStored("adt_guide_step", stepIndex);
  }, [stepIndex, tourActive]);

  useEffect(() => {
    if (open) {
      writeStored("adt_guide_seen", true);
      writeStored("adt_guide_dismissed", false);
    }
  }, [open]);

  const startTour = () => {
    setStepIndex(0);
    setTourActive(true);
    setOpen(true);
    setMinimized(false);
    navigate("/");
  };
  const moveToStep = (nextIndex) => {
    if (nextIndex >= TOUR_STEPS.length) {
      setTourActive(false);
      setCompleted(true);
      setOpen(true);
      setMinimized(false);
      writeStored("adt_guide_completed", true);
      writeStored("adt_guide_dismissed", false);
      return;
    }
    if (nextIndex < 0) return;
    setStepIndex(nextIndex);
    const nextStep = TOUR_STEPS[nextIndex];
    if (nextStep.path !== location.pathname) navigate(nextStep.path);
  };
  const closeGuide = () => {
    setOpen(false);
    setTourActive(false);
    setMinimized(false);
    writeStored("adt_guide_dismissed", true);
    document.querySelectorAll(".adt-guide-target").forEach((node) => node.classList.remove("adt-guide-target"));
  };
  const resumeTour = () => {
    setTourActive(true);
    setOpen(true);
    setMinimized(false);
    writeStored("adt_guide_dismissed", false);
    navigate(TOUR_STEPS[stepIndex]?.path || "/");
  };
  const toggleOpen = () => {
    setOpen(true);
    setMinimized(false);
    writeStored("adt_guide_dismissed", false);
    writeStored("adt_guide_minimized", false);
  };

  return (
    <div className="adt-site-guide" aria-label="AI site guide">
      <button className={`adt-hologram-bot${open && !minimized ? " adt-hologram-bot-active" : ""}`} type="button" onClick={toggleOpen} aria-label="Open AI hologram companion" title="Talk to your AI site guide">
        <span className="adt-bot-aura" /><span className="adt-bot-orbit adt-bot-orbit-one" /><span className="adt-bot-orbit adt-bot-orbit-two" />
        <HologramBot />
        <span className="adt-bot-label"><i /> AI GUIDE</span>
      </button>
      {open && minimized ? (
        <button className="adt-guide-minimized" type="button" onClick={() => setMinimized(false)} aria-label="Expand site guide">✦ <span>Site guide</span> <span aria-hidden="true">⌃</span></button>
      ) : open ? (
        <section className="adt-guide-board" role="dialog" aria-modal="false" aria-labelledby="adt-guide-title">
          <div className="adt-guide-topline"><span className="adt-guide-status"><i /> AI GUIDE · READY</span><div className="adt-guide-window-actions">
            <button type="button" onClick={() => { setMinimized(true); writeStored("adt_guide_minimized", true); }} aria-label="Minimize guide" title="Minimize">−</button>
            <button type="button" onClick={closeGuide} aria-label="Close guide" title="Close">×</button>
          </div></div>
          <div className="adt-guide-heading"><span className="adt-guide-emblem">✦</span><div><p>{tourActive ? `GUIDED TOUR · STEP ${stepIndex + 1} OF ${TOUR_STEPS.length}` : "YOUR PRODUCT COMPANION"}</p><h2 id="adt-guide-title">{tourActive ? currentStep.title : completed ? "Tour complete — you're ready" : pageContext.title}</h2></div></div>
          <p className="adt-guide-copy">{tourActive ? currentStep.body : completed ? "You have seen the main areas of AI Developer Toolbox. The guide will stay available here whenever you want a refresher or need to replay the tour." : pageContext.body}</p>
          {tourActive && <div className="adt-guide-progress" aria-label={`Step ${stepIndex + 1} of ${TOUR_STEPS.length}`}><span style={{ width: `${((stepIndex + 1) / TOUR_STEPS.length) * 100}%` }} /></div>}
          {tourActive && targetMissing && isCurrentRoute && <p className="adt-guide-note">This section is not available on this view. You can continue the tour safely.</p>}
          {!tourActive && !completed && <div className="adt-guide-shortcuts"><span>01 <b>Repository intelligence</b></span><span>02 <b>AI workspace</b></span><span>03 <b>History &amp; policies</b></span></div>}
          <div className="adt-guide-actions">
            {tourActive ? <>
              <button type="button" className="adt-guide-quiet" onClick={() => { setTourActive(false); document.querySelectorAll(".adt-guide-target").forEach((node) => node.classList.remove("adt-guide-target")); }}>Skip tour</button>
              <div className="adt-guide-step-actions"><button type="button" className="adt-guide-secondary" onClick={() => moveToStep(stepIndex - 1)} disabled={stepIndex === 0}>Back</button><button type="button" className="adt-guide-primary" onClick={() => moveToStep(stepIndex + 1)}>{stepIndex === TOUR_STEPS.length - 1 ? "Finish tour" : "Next step"} <span aria-hidden="true">→</span></button></div>
            </> : <>
              <button type="button" className="adt-guide-quiet" onClick={closeGuide}>Not now</button>
              <button type="button" className="adt-guide-primary" onClick={stepIndex > 0 && !completed ? resumeTour : startTour}>{stepIndex > 0 && !completed ? "Resume tour" : "Start full tour"} <span aria-hidden="true">→</span></button>
            </>}
          </div>
          <div className="adt-guide-foot"><span><i /> Floating help, whenever you need it</span><button type="button" onClick={startTour}>{tourActive ? "Restart" : "Replay tour"}</button></div>
        </section>
      ) : null}
    </div>
  );
}

export default SiteGuide;
