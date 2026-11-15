import { useEffect, useState } from "react"; import { addDoc, collection, getDocs } from "firebase/firestore"; import { db, uploadFile } from "../firebase"; import type { Module, Profile } from "../types";
export default function AdminStats() {
  const [users, setUsers] = useState<Profile[]>([]), [mods, setMods] = useState<Module[]>([]), [title, setTitle] = useState(""), [note, setNote] = useState(""), [msg, setMsg] = useState("");
  useEffect(() => { getDocs(collection(db, "users")).then(s => setUsers(s.docs.map(d => d.data() as Profile))); getDocs(collection(db, "modules")).then(s => setMods(s.docs.map(d => ({ ...(d.data() as Module), id: d.id })))); }, []);
  const st = users.filter(u => u.role !== "admin"), week = Date.now() - 7 * 864e5;
  const active = st.filter(u => u.last && Date.parse(u.last) >= week).length, avg = st.length ? Math.round(st.reduce((t, u) => t + u.xp, 0) / st.length) : 0;
  const top = [...st].sort((a, b) => b.xp - a.xp).slice(0, 5);
  const up = async (f: File) => { setMsg("Uploading…"); try { const url = await uploadFile(f); await addDoc(collection(db, "materials"), { title: title || f.name, note, url, ts: Date.now() }); setMsg("Uploaded ✅"); setTitle(""); setNote(""); } catch { setMsg("Upload failed"); } };
  return <div><div className="card"><h2>📊 Dashboard</h2><div className="stats">
    <div className="stat"><b>{st.length}</b><span>Students</span></div><div className="stat"><b>{active}</b><span>Active (7 days)</span></div>
    <div className="stat"><b>{avg}</b><span>Average XP</span></div><div className="stat"><b>{mods.length}</b><span>Lessons</span></div></div>
    <h3 style={{ marginTop: 16 }}>Completion per lesson</h3>{[...mods].sort((a, b) => a.order - b.order).map(m => { const n = st.filter(u => u.done?.[m.id!]).length; return <div className="row" key={m.id}><span>{m.emoji} {m.title}</span><b>{n}/{st.length}</b></div>; })}
    <h3 style={{ marginTop: 16 }}>Top students</h3>{top.map((u, i) => <div className="row" key={i}><span>{i + 1}. {u.email}</span><b>{u.xp} XP</b></div>)}</div>
  <div className="card"><h3>📎 Upload material (PDF, slides, notes)</h3><input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /><input placeholder="Short note (optional)" value={note} onChange={e => setNote(e.target.value)} />
    <input type="file" onChange={e => e.target.files?.[0] && up(e.target.files[0])} /><p className="mu">{msg}</p></div></div>;
}
