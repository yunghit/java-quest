import { useEffect, useState } from "react"; import { collection, getDocs } from "firebase/firestore"; import { db } from "../firebase"; import { bump } from "../game"; import type { Module, Profile, Quiz } from "../types";
export default function Boss({ uid, prof }: { uid: string; prof: Profile }) {
  const [qs, setQs] = useState<Quiz[]>([]), [i, setI] = useState(0), [sc, setSc] = useState(0), [saved, setSaved] = useState(false);
  useEffect(() => { getDocs(collection(db, "modules")).then(s => setQs(s.docs.flatMap(d => (d.data() as Module).quiz).sort(() => Math.random() - .5).slice(0, 10))); }, []);
  useEffect(() => { if (qs.length && i >= qs.length && !saved) { setSaved(true); bump(uid, prof, sc * 5); } }, [i]);
  if (!qs.length) return <p>Loading the boss…</p>;
  if (i >= qs.length) return <div className="card"><h2>🏁 Boss defeated!</h2><p>{sc}/{qs.length} correct · +{sc * 5} XP</p></div>;
  const q = qs[i]; return <div className="card"><h3>Question {i + 1}/{qs.length}</h3><b>{q.q}</b>{q.options.map((o, k) => <button key={k} className="o" onClick={() => { if (k === q.answer) setSc(sc + 1); setI(i + 1); }}>{o}</button>)}</div>;
}
