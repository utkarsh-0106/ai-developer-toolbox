import { useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import PromptForm from "../components/PromptForm";
import ResponseCard from "../components/ResponseCard";
import { getAIResponse } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Home() {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const heroRotateX = useTransform(smoothMouseY, [-18, 18], [3, -3]);
  const heroRotateY = useTransform(smoothMouseX, [-18, 18], [-3, 3]);

  const handleHeroMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x * 18);
    mouseY.set(y * 18);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const heroLightX = useTransform(smoothMouseX, [-18, 18], ["15%", "85%"]);
  const heroLightY = useTransform(smoothMouseY, [-18, 18], ["15%", "85%"]);

  const heroDepthX = useTransform(smoothMouseX, [-18, 18], [-10, 10]);
  const heroDepthY = useTransform(smoothMouseY, [-18, 18], [-10, 10]);
  const heroCameraScale = useTransform(scrollYProgress, [0, 0.75], [1, 1.08]);
  const heroDepthOpacity = useTransform(scrollYProgress, [0, 0.45, 0.8], [1, 0.96, 0.82]);

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const darkMode = true;
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  const handleSubmit = async (prompt) => {
    try {
      setLoading(true);
      setError("");
      setResponse("");

      const aiResponse = await getAIResponse(prompt);
      setResponse(aiResponse.response);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="ai-surface min-h-screen bg-[#08090b] text-white"
    >
      <header
        className={`border-b ${
          darkMode
            ? "border-white/10 bg-[#0b0d10]"
            : "border-black/10 bg-white"
        }`}
      className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#08090b]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 text-[15px] font-semibold tracking-tight"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-white/15 bg-white/[0.04] text-[10px] font-mono text-white/80 transition-colors group-hover:border-white/30 group-hover:bg-white/[0.08]">
              AI
            </span>
            AI Developer Toolbox
            <span>Developer Toolbox</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/history"
              className="text-white/55 transition-colors hover:text-white"
            >
              History
            </Link>

            {user ? (
              <>
                <span
                  className={darkMode ? "text-gray-300" : "text-gray-600"}
                >
                  {user.name}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`border px-3 py-2 text-sm font-medium transition-colors ${
                    darkMode
                      ? "border-white/15 text-gray-200 hover:bg-white/5"
                      : "border-black/10 text-gray-700 hover:bg-black/[0.03]"
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-in failed")}
              />
            )}

          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`relative min-h-[680px] lg:min-h-[760px] mb-20 overflow-hidden rounded-[2rem] border ${
            darkMode
              ? "border-white/10 bg-[#080a0d]"
              : "border-black/[0.08] bg-[#e9ecef]"
          }`}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Cinematic background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              x: heroDepthX,
              y: heroDepthY,
              opacity: darkMode ? 1 : 0,
              background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.13), transparent 38%)",
            }}
          />

          <motion.div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              opacity: darkMode ? 1 : 0,
              background: `radial-gradient(circle at ${heroLightX} ${heroLightY}, rgba(255,255,255,0.10), transparent 24%)`,
            }}
          />

          {/* Hero artwork */}
          <motion.div
            className="absolute inset-0 flex items-end justify-end p-5 md:p-8 lg:p-10"
            style={{
              x: smoothMouseX,
              y: smoothMouseY,
              rotateX: heroRotateX,
              rotateY: heroRotateY,
              scale: heroCameraScale,
              transformPerspective: 1200,
            }}
          >
            <motion.img
              src="/src/assets/hero.png"
              alt="Developer workspace visualization"
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
              className="w-[78%] md:w-[72%] lg:w-[68%] h-auto object-cover rounded-[1.5rem] shadow-2xl translate-x-2 md:translate-x-6 lg:translate-x-10 translate-y-2 md:translate-y-4 lg:translate-y-6"
            />
          </motion.div>

          {/* Editorial headline */}
          <div className="relative z-10 flex min-h-[680px] lg:min-h-[760px] flex-col justify-between p-7 md:p-10 lg:p-14 pointer-events-none">
            <div className="flex items-start justify-between">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  darkMode ? "text-white/40" : "text-black/45"
                }`}
              >
                Developer productivity
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className={`hidden md:block text-right ${
                  darkMode ? "text-white/40" : "text-black/40"
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.18em]">
                  AI Developer Toolbox
                </p>
                <p className="mt-1 text-xs opacity-70">
                  Debug / Explain / Review
                </p>
              </motion.div>
            </div>

            <div className="max-w-2xl pt-16 md:pt-20 lg:pt-24">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className={`mb-5 text-xs uppercase tracking-[0.2em] ${
                  darkMode ? "text-white/35" : "text-black/40"
                }`}
              >
                Engineering intelligence
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
                className={`max-w-3xl text-[clamp(3.2rem,7vw,7rem)] font-semibold leading-[0.88] tracking-[-0.065em] ${
                  darkMode ? "text-white" : "text-[#111318]"
                }`}
              >
                Debug,
                <br />
                explain,
                <br />
                review.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className={`mt-7 max-w-md text-sm md:text-base leading-7 ${
                  darkMode ? "text-white/50" : "text-black/55"
                }`}
              >
                A focused workspace for developers. Submit an error, coding
                question, API problem, or engineering issue and get a
                structured technical response.
              </motion.p>
            </div>
          </div>

          {/* Glass information card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className={`absolute bottom-7 right-7 z-20 hidden w-64 rounded-2xl border p-5 shadow-xl backdrop-blur-xl md:block ${
              darkMode
                ? "border-white/15 bg-white/[0.06]"
                : "border-black/[0.08] bg-white/55"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                darkMode ? "text-white/40" : "text-black/45"
              }`}>
                Workspace
              </span>
              <span className={`h-2 w-2 rounded-full ${
                  darkMode ? "bg-white/70" : "bg-black/70"
                }`} />
            </div>
            <p className={`text-sm font-medium leading-6 ${
                darkMode ? "text-white/70" : "text-black/75"
              }`}>
              Turn complex software problems into clear technical answers.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.16,
              },
            },
          }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 items-start"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <PromptForm
              onSubmit={handleSubmit}
              loading={loading}
              darkMode={darkMode}
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 32 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ResponseCard response={response} darkMode={darkMode} />
          </motion.div>
        </motion.section>

        {error && (
          <div
            className={`mt-6 border px-4 py-3 text-sm ${
              darkMode
                ? "border-red-400/30 bg-red-400/5 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <footer
          className={`mt-16 pt-6 border-t flex flex-col sm:flex-row justify-between gap-4 text-sm ${
            darkMode
              ? "border-white/10 text-gray-500"
              : "border-black/10 text-gray-500"
          }`}
        >
          <p>AI Developer Toolbox</p>

          <div className="flex gap-5">
            <Link
              to="/privacy"
              className="hover:text-current hover:underline underline-offset-4"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="hover:text-current hover:underline underline-offset-4"
            >
              Terms
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;
