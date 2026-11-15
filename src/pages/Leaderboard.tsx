import { useEffect, useState } from "react"; import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"; import { db } from "../firebase";
export default function Leaderboard({ uid }: { uid: string }) {
  const [rows, setRows] = useState<{ id: string; name: string; xp: number; streak?: number }[]>([]);
  useEffect(() => { getDocs(query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(20))).then(s => setRows(s.docs.map(d => ({ id: d.id, ...(d.data() as any) })))); }, []);
  return <div className="card"><h2>🏆 Leaderboard</h2>{rows.map((r, i) => <div key={r.id} style={{ fontWeight: r.id === uid ? 700 : 400, padding: "4px 0" }}>{["🥇", "🥈", "🥉"][i] ?? `${i + 1}.`} {r.name} · {r.xp} XP · 🔥 {r.streak ?? 0}</div>)}{!rows.length && <p>No scores yet.</p>}</div>;
}
