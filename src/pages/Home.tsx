import { useEffect, useState } from "react"; import { Link } from "react-router-dom"; import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase"; import type { Module, Profile } from "../types";
export default function Home({ prof }: { prof: Profile }) {
  const [m, setM] = useState<Module[]>([]); const [ex, setEx] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => { getDocs(query(collection(db, "modules"), orderBy("order"))).then(s => setM(s.docs.map(d => ({ ...(d.data() as Module), id: d.id })))); getDocs(collection(db, "exams")).then(s => setEx(s.docs.map(d => ({ id: d.id, title: (d.data() as any).title }))));
  }, []);
  return <div><h3>📚 Lessons</h3><div className="grid">{m.map(x => <Link key={x.id} to={`/lesson/${x.id}`} className="card" style={{ textAlign: "center", textDecoration: "none", color: "inherit" }}>
    <div style={{ fontSize: 30 }}>{x.emoji}</div>{x.title}<div>{prof.done[x.id!] ? "✅ Complete" : "+60 XP"}</div></Link>)}{!m.length && <p>No lessons yet. An admin can add them.</p>}</div><h3>📝 Exams and tests</h3>{ex.map(e => <Link key={e.id} to={`/exam/${e.id}`}><button>{e.title}</button></Link>)}</div>;
}
