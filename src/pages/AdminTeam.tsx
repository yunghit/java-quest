import { useEffect, useState } from "react"; import { collection, doc, getDocs, updateDoc } from "firebase/firestore"; import { auth, db } from "../firebase";
type U = { id: string; email: string; role: string; xp: number };
export default function AdminTeam() {
  const [rows, setRows] = useState<U[]>([]), [q, setQ] = useState(""), [msg, setMsg] = useState("");
  const load = () => getDocs(collection(db, "users")).then(s => setRows(s.docs.map(d => ({ id: d.id, ...(d.data() as any) }))));
  useEffect(() => { load(); }, []);
  const setRole = async (r: U, role: string) => {
    if (!confirm(`${role === "admin" ? "Give admin access to" : "Remove admin access from"} ${r.email}?`)) return;
    try { await updateDoc(doc(db, "users", r.id), { role }); setMsg(`${r.email} is now ${role}.`); load(); } catch { setMsg("Could not change the role. Check that the new Firestore rules are published."); }
  };
  const me = auth.currentUser?.uid;
  const list = rows.filter(r => r.email?.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (a.role === b.role ? 0 : a.role === "admin" ? -1 : 1));
  return <div className="card"><h3>👥 Team and roles</h3><p className="mu">Search a signed-up user and make them an admin. Admins can add lessons, exams and files. You can’t change your own role, so there is always at least one admin.</p>
    <input placeholder="Search by email…" value={q} onChange={e => setQ(e.target.value)} />
    {list.slice(0, 25).map(r => <div className="row" key={r.id}><span>{r.email} {r.role === "admin" && "🛡️"}</span>
      {r.id === me ? <span className="mu">you</span> : r.role === "admin" ? <button className="ghost" onClick={() => setRole(r, "student")}>Remove admin</button> : <button onClick={() => setRole(r, "admin")}>Make admin</button>}</div>)}
    <p className="mu">{msg}</p></div>;
}
