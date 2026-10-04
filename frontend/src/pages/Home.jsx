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
  const [darkMode, setDarkMode] = useState(false);
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
      className={`min-h-screen ${
        darkMode ? "bg-[#0b0d10] text-white" : "bg-[#f6f7f9] text-[#111318]"
      }`}
    >
      <header
        className={`border-b ${
          darkMode
            ? "border-white/10 bg-[#0b0d10]"
            : "border-black/10 bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            AI Developer Toolbox
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link
              to="/history"
              className={`hover:underline underline-offset-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
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

            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className={`border px-3 py-2 text-sm font-medium transition-colors ${
                darkMode
                  ? "border-white/15 text-gray-200 hover:bg-white/5"
                  : "border-black/10 text-gray-700 hover:bg-black/[0.03]"
              }`}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity, scale: heroDepthOpacity }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-16 items-center mb-16"
        >
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-4 text-gray-500"
            >
              Developer productivity
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className={`text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] ${
                darkMode ? "text-white" : "text-[#111318]"
              }`}
            >
              Debug, explain, and review software problems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className={`mt-5 max-w-2xl text-base md:text-lg leading-7 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              A focused workspace for developers. Submit an error, coding
              question, API problem, or engineering issue and get a structured
              technical response.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="relative hero-visual"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                x: smoothMouseX,
                y: smoothMouseY,
                rotateX: heroRotateX,
                rotateY: heroRotateY,
                scale: heroCameraScale,
                transformPerspective: 900,
              }}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
            >
            <motion.div
              className="pointer-events-none absolute -inset-12 z-0"
              style={{
                x: heroDepthX,
                y: heroDepthY,
                background: darkMode
                  ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07), transparent 55%)"
                  : "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.06), transparent 55%)",
              }}
            />

            <motion.div
              className="pointer-events-none absolute z-0 h-56 w-56 rounded-full blur-3xl"
              style={{
                left: heroLightX,
                top: heroLightY,
                x: "-50%",
                y: "-50%",
                background: darkMode
                  ? "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)"
                  : "radial-gradient(circle, rgba(0,0,0,0.08), transparent 70%)",
              }}
            />
            <div
              className={`absolute inset-4 blur-3xl opacity-10 ${
                darkMode ? "bg-white" : "bg-black"
              }`}
            />
            <img
              src="/src/assets/hero.png"
              alt="Developer workspace visualization"
              className="relative w-full h-auto object-cover"
            />
            </motion.div>
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
