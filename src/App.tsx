import { useEffect, useState } from "react"; import { Navigate, Route, Routes, useLocation } from "react-router-dom"; import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; import { auth, db } from "./firebase"; import type { Profile } from "./types";
import Nav from "./components/Nav"; import Boss from "./pages/Boss"; import Exam from "./pages/Exam"; import Home from "./pages/Home"; import Lesson from "./pages/Lesson"; import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard"; import History from "./pages/History"; import Materials from "./pages/Materials"; import AdminLogin from "./pages/AdminLogin"; import Login from "./pages/Login";
export default function App() {
  const loc = useLocation(); const [user, setUser] = useState<User | null | undefined>(undefined); const [prof, setProf] = useState<Profile | null>(null);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    if (!user) { setProf(null); return; }
    const r = doc(db, "users", user.uid);
    getDoc(r).then(s => { if (!s.exists()) setDoc(r, { xp: 0, done: {}, role: "student", email: user.email ?? "" }); });
    return onSnapshot(r, s => s.exists() && setProf(s.data() as Profile));
  }, [user]);
  if (user === undefined || (user && !prof)) return <main><p className="mu">Loading…</p></main>;
  if (!user || !prof) return loc.pathname === "/admin-login" ? <AdminLogin /> : <Login />;
  const admin = prof.role === "admin";
  return <main><Nav prof={prof} /><Routes>
    <Route path="/" element={admin ? <Navigate to="/admin" replace /> : <Home prof={prof} />} /><Route path="/learn" element={<Home prof={prof} />} />
    <Route path="/lesson/:id" element={<Lesson uid={user.uid} prof={prof} />} /><Route path="/boss" element={<Boss uid={user.uid} prof={prof} />} />
    <Route path="/exam/:id" element={<Exam uid={user.uid} prof={prof} />} /><Route path="/materials" element={<Materials />} />
    <Route path="/leaderboard" element={<Leaderboard uid={user.uid} />} /><Route path="/history" element={<History uid={user.uid} />} />
    {admin && <Route path="/admin" element={<Admin />} />}<Route path="*" element={<Navigate to="/" replace />} /></Routes></main>;
}
