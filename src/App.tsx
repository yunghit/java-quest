import { useEffect, useState } from "react"; import { Link, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; import { auth, db } from "./firebase"; import type { Profile } from "./types"; import { BADGES } from "./game";
import Boss from "./pages/Boss"; import Exam from "./pages/Exam"; import Home from "./pages/Home"; import Lesson from "./pages/Lesson"; import Admin from "./pages/Admin"; import Leaderboard from "./pages/Leaderboard"; import History from "./pages/History";
function Login() {
  const [e, setE] = useState(""), [p, setP] = useState(""), [err, setErr] = useState("");
  const go = (up: boolean) => (up ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, e, p).catch(x => setErr(x.message));
  return <div style={{ minHeight: "100vh", background: "url(./splash.png) center/cover" }}><main><div className="card" style={{ textAlign: "center", opacity: 0.95 }}><img src="./mascot.png" width="140" /><h2>Java Quest</h2><input placeholder="Email" value={e} onChange={x => setE(x.target.value)} /><input type="password" placeholder="Password" value={p} onChange={x => setP(x.target.value)} />
    <button onClick={() => go(false)}>Log in</button><button onClick={() => go(true)}>Sign up</button><p>{err}</p></div></main></div>;
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
  if (user === undefined || (user && !prof)) return <main>Loading…</main>; if (!user || !prof) return <Login />;
  return <main><div className="card"><img src="./icon.png" width="28" style={{ verticalAlign: "middle", borderRadius: 6 }} /> <Link to="/">🏠 Home</Link> <Link to="/boss">⚔️ Boss</Link> <Link to="/leaderboard">🏆 Ranks</Link> <Link to="/history">🕘 History</Link> {prof.role === "admin" && <Link to="/admin">🛠️ Admin</Link>} <button onClick={() => signOut(auth)}>Log out</button>
    <div>Level {Math.floor(prof.xp / 100) + 1} · {prof.xp} XP · 🔥 {prof.streak ?? 0}-day streak</div><div className="bar"><i style={{ width: `${prof.xp % 100}%` }} /></div>
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>{BADGES.map(b => <img key={b.name} title={b.name} src={`./${b.img}`} width="44" style={{ opacity: b.ok(prof) ? 1 : 0.25, filter: b.ok(prof) ? "none" : "grayscale(1)" }} />)}</div></div>
    <Routes><Route path="/" element={<Home prof={prof} />} /><Route path="/lesson/:id" element={<Lesson uid={user.uid} prof={prof} />} /><Route path="/boss" element={<Boss uid={user.uid} prof={prof} />} /><Route path="/exam/:id" element={<Exam uid={user.uid} prof={prof} />} /><Route path="/leaderboard" element={<Leaderboard uid={user.uid} />} /><Route path="/history" element={<History uid={user.uid} />} />{prof.role === "admin" && <Route path="/admin" element={<Admin />} />}</Routes></main>;
}
