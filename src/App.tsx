import { useEffect, useState } from "react"; import { Route, Routes } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; import { auth, db } from "./firebase"; import type { Profile } from "./types";
import Nav from "./components/Nav"; import Boss from "./pages/Boss"; import Exam from "./pages/Exam"; import Home from "./pages/Home"; import Lesson from "./pages/Lesson"; import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard"; import History from "./pages/History"; import Materials from "./pages/Materials";
const MSG: Record<string, string> = {
  "auth/network-request-failed": "Can't reach Google's servers. Check your connection, turn off VPN, data saver and private DNS, open this page in Chrome (not inside WhatsApp or another app), then try again.",
  "auth/email-already-in-use": "That email already has an account. Use Log in instead.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/invalid-credential": "Wrong email or password.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again." };
function Login() {
  const [e, setE] = useState(""), [p, setP] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const go = async (up: boolean) => {
    setErr(""); setBusy(true);
    const run = () => (up ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, e.trim(), p);
    try { try { await run(); } catch (x: any) { if (x.code === "auth/network-request-failed") { await new Promise(r => setTimeout(r, 1500)); await run(); } else throw x; } }
    catch (x: any) { setErr(MSG[x.code] ?? `${x.code ?? ""} ${x.message ?? ""}`); }
    setBusy(false);
  };
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(#0d0f18cc,#0d0f18cc),url(./splash.png) center/cover" }}><main><div className="card" style={{ textAlign: "center", maxWidth: 380, margin: "auto" }}>
    <img src="./mascot.png" width="130" /><h2>Java Quest</h2><p className="mu">Learn Java. Earn XP. Beat the exam.</p><input placeholder="Email" value={e} onChange={x => setE(x.target.value)} /><input type="password" placeholder="Password" value={p} onChange={x => setP(x.target.value)} />
    <button disabled={busy} onClick={() => go(false)}>{busy ? "Please wait…" : "Log in"}</button><button className="ghost" disabled={busy} onClick={() => go(true)}>Sign up</button><p style={{ color: "var(--bad)" }}>{err}</p></div></main></div>;
}
export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined); const [prof, setProf] = useState<Profile | null>(null);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    if (!user) { setProf(null); return; }
    const r = doc(db, "users", user.uid);
    getDoc(r).then(s => { if (!s.exists()) setDoc(r, { xp: 0, done: {}, role: "student", email: user.email ?? "" }); });
    return onSnapshot(r, s => s.exists() && setProf(s.data() as Profile));
  }, [user]);
  if (user === undefined || (user && !prof)) return <main><p className="mu">Loading…</p></main>; if (!user || !prof) return <Login />;
  return <main><Nav prof={prof} /><Routes><Route path="/" element={<Home prof={prof} />} /><Route path="/lesson/:id" element={<Lesson uid={user.uid} prof={prof} />} /><Route path="/boss" element={<Boss uid={user.uid} prof={prof} />} /><Route path="/exam/:id" element={<Exam uid={user.uid} prof={prof} />} /><Route path="/materials" element={<Materials />} /><Route path="/leaderboard" element={<Leaderboard uid={user.uid} />} /><Route path="/history" element={<History uid={user.uid} />} />{prof.role === "admin" && <Route path="/admin" element={<Admin />} />}</Routes></main>;
}
