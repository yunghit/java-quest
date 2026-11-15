import { useEffect, useState } from "react"; import { collection, getDocs, orderBy, query } from "firebase/firestore"; import { db } from "../firebase";
export default function History({ uid }: { uid: string }) {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { getDocs(query(collection(db, "users", uid, "attempts"), orderBy("at", "desc"))).then(s => setRows(s.docs.map(d => d.data()))); }, [uid]);
  return <div className="card"><h2>🕘 My exam history</h2>{rows.map((r, i) => <div key={i} style={{ padding: "4px 0" }}>{new Date(r.at).toLocaleString()} · {r.title} · auto-marked {r.score}/{r.total}</div>)}{!rows.length && <p>No attempts yet.</p>}</div>;
}
