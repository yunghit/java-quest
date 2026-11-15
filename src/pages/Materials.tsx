import { useEffect, useState } from "react"; import { collection, getDocs, orderBy, query } from "firebase/firestore"; import { db } from "../firebase";
export default function Materials() {
  const [rows, setRows] = useState<{ id: string; title: string; url: string; note?: string }[]>([]);
  useEffect(() => { getDocs(query(collection(db, "materials"), orderBy("ts", "desc"))).then(s => setRows(s.docs.map(d => ({ id: d.id, ...(d.data() as any) })))); }, []);
  return <div className="card"><h2>📎 Course files</h2>{rows.map(r => <div className="row" key={r.id}><a href={r.url} target="_blank" rel="noreferrer"><b>{r.title}</b>{r.note && <div className="mu">{r.note}</div>}</a><a href={r.url} target="_blank" rel="noreferrer">Open ↗</a></div>)}{!rows.length && <p className="mu">Nothing uploaded yet.</p>}</div>;
}
