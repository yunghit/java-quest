import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { Profile } from "./types";
import { BADGES } from "./game";
import Boss from "./pages/Boss";
import Exam from "./pages/Exam";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";

type IconName =
  | "home"
  | "book"
  | "trophy"
  | "chart"
  | "clock"
  | "shield"
  | "logout"
  | "sparkles"
  | "arrow";

const ICONS: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9ZM9 21v-6h6v6",
  book: "M4.5 5.5A2.5 2.5 0 0 1 7 3h11.5v16H7a2.5 2.5 0 0 0-2.5 2.5v-16ZM4.5 5.5v16A2.5 2.5 0 0 1 7 19h11.5",
  trophy: "m8.5 8-1-4h9l-1 4M9 4H4v2a5 5 0 0 0 5 5m6-7h5v2a5 5 0 0 1-5 5M12 11v5m-4 4h8M10 16h4",
  chart: "M4 19V5m0 14h17M8 15v-4m4 4V7m4 8V4m4 11v-6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
  shield: "M12 3 20 6v5c0 5.25-3.35 9.05-8 10-4.65-.95-8-4.75-8-10V6l8-3Zm-3 9 2 2 4-4",
  logout: "M10 17l5-5-5-5m5 5H3m13-8h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3",
  sparkles: "m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2L12 3ZM19 15l.6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15ZM5 14l.5 2L7.5 16l-2 .5L5 18l-.5-1.5-2-.5 2-.5L5 14Z",
  arrow: "M5 12h13m-5-5 5 5-5 5",
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d={ICONS[name]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const isSignup = mode === "signup";

  const submit = async () => {
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (nextError: any) {
      setError(nextError?.message || "We could not complete that request.");
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link className="brand" to="/">
          <img alt="Java Quest logo" className="brand-mark" src="/icon.png" />
          <span className="brand-word">
            Java<span>Quest</span>
          </span>
        </Link>
        <div className="auth-header-status">
          <span className="live-dot" />
          <span>Learn by doing</span>
        </div>
      </header>

      <main className="auth-layout">
        <section className="auth-visual">
          <div className="auth-kicker">
            <Icon name="sparkles" size={15} />
            <span>THE JAVA LEARNING ARENA</span>
          </div>
          <h1 className="auth-title">
            Turn practice
            <br />
            into <span>progress.</span>
          </h1>
          <p className="auth-lede">
            Build real Java fluency through short lessons, focused challenges,
            and a streak that keeps you moving.
          </p>
          <div className="auth-highlights">
            <div>
              <strong>05</strong>
              <span>achievement badges</span>
            </div>
            <div>
              <strong>+XP</strong>
              <span>for every win</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>practice on demand</span>
            </div>
          </div>
          <div className="auth-art-card">
            <div className="auth-art-glow" />
            <img alt="Java Quest mascot" src="/mascot.png" />
            <div className="auth-art-caption">
              <span className="eyebrow">NEXT MISSION</span>
              <strong>Ship your next breakthrough</strong>
            </div>
            <Icon name="arrow" size={19} />
          </div>
        </section>

        <section aria-label="Account access" className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-card-icon">
              <Icon name="shield" size={21} />
            </span>
            <div>
              <p className="eyebrow">PLAYER ACCESS</p>
              <h2>{isSignup ? "Create your account" : "Welcome back"}</h2>
            </div>
          </div>
          <p className="auth-card-copy">
            {isSignup
              ? "Start your Java journey and save your progress in the cloud."
              : "Pick up where you left off and keep your streak alive."}
          </p>

          <div aria-label="Account mode" className="auth-switch" role="tablist">
            <button
              aria-selected={!isSignup}
              className={!isSignup ? "auth-switch-option is-active" : "auth-switch-option"}
              onClick={() => setMode("signin")}
              role="tab"
              type="button"
            >
              Sign in
            </button>
            <button
              aria-selected={isSignup}
              className={isSignup ? "auth-switch-option is-active" : "auth-switch-option"}
              onClick={() => setMode("signup")}
              role="tab"
              type="button"
            >
              Sign up
            </button>
          </div>

          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <label>
              <span>Email address</span>
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                required
                type="password"
                value={password}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-primary button-wide" type="submit">
              <span>{isSignup ? "Create player account" : "Enter the arena"}</span>
              <Icon name="arrow" size={17} />
            </button>
          </form>
          <p className="auth-footnote">
            Your progress, badges, and streak are synced automatically.
          </p>
        </section>
      </main>
    </div>
  );
}

const navigation: Array<{ to: string; label: string; icon: IconName; end?: boolean }> = [
  { to: "/", label: "Play", icon: "home", end: true },
  { to: "/boss", label: "Boss fight", icon: "shield" },
  { to: "/leaderboard", label: "Ranks", icon: "trophy" },
  { to: "/history", label: "History", icon: "clock" },
];

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => setUser(nextUser));
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileRef = doc(db, "users", user.uid);
    getDoc(profileRef).then((snapshot) => {
      if (!snapshot.exists()) {
        setDoc(profileRef, {
          xp: 0,
          done: {},
          role: "student",
          email: user.email ?? "",
        });
      }
    });
    return onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) setProfile(snapshot.data() as Profile);
    });
  }, [user]);

  if (user === undefined || (user && !profile)) {
    return (
      <main className="loading-screen">
        <div className="loading-mark">
          <img alt="" src="/icon.png" />
        </div>
        <p>Loading your quest…</p>
      </main>
    );
  }

  if (!user || !profile) return <Login />;

  const progress = Math.min(100, Math.max(0, (profile.xp ?? 0) % 100));
  const initials = (profile.email || "P").trim().charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <header className="app-nav">
        <Link className="brand" to="/">
          <img alt="Java Quest logo" className="brand-mark" src="/icon.png" />
          <span className="brand-word">
            Java<span>Quest</span>
          </span>
          <span className="brand-tag">LEARNING ARENA</span>
        </Link>

        <nav aria-label="Primary navigation" className="nav-links">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
              end={item.end}
              key={item.to}
              to={item.to}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="streak-chip" title="Current streak">
            <span className="streak-flame">✦</span>
            <span>
              <strong>{profile.streak ?? 0}</strong> day streak
            </span>
          </div>
          <div aria-label={`Signed in as ${profile.email}`} className="avatar">
            {initials}
          </div>
          <button
            aria-label="Log out"
            className="icon-button"
            onClick={() => void signOut(auth)}
            title="Log out"
            type="button"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route element={<Home prof={profile} />} path="/" />
          <Route element={<Lesson uid={user.uid} prof={profile} />} path="/lesson/:id" />
          <Route element={<Boss uid={user.uid} prof={profile} />} path="/boss" />
          <Route element={<Exam uid={user.uid} prof={profile} />} path="/exam/:id" />
          <Route element={<Leaderboard uid={user.uid} />} path="/leaderboard" />
          <Route element={<History uid={user.uid} />} path="/history" />
          {profile.role === "admin" && <Route element={<Admin />} path="/admin" />}
        </Routes>

        <section aria-label="Player progress" className="progress-dock">
          <div className="progress-dock-heading">
            <div>
              <p className="eyebrow">YOUR PROGRESS</p>
              <strong>Level {Math.floor((profile.xp ?? 0) / 100) + 1}</strong>
            </div>
            <span>{profile.xp ?? 0} XP total</span>
          </div>
          <div className="bar">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="badge-row">
            {BADGES.map((badge) => (
              <img
                alt={badge.name}
                className={badge.ok(profile) ? "badge-icon is-earned" : "badge-icon"}
                key={badge.name}
                src={`/${badge.img}`}
                title={badge.name}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
