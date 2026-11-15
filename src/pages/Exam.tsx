import { useEffect, useState } from "react"; import { useParams } from "react-router-dom"; import { doc, getDoc } from "firebase/firestore"; import { db } from "../firebase"; import { bump, saveAttempt } from "../game"; import type { Profile } from "../types";
export default function Exam({ uid, prof }: { uid: string; prof: Profile }) {
  const { id } = useParams(); const [x, setX] = useState<any>(null), [a, setA] = useState<Record<string, any>>({}), [done, setDone] = useState(false), [left, setLeft] = useState(0);
  useEffect(() => { getDoc(doc(db, "exams", id!)).then(s => { setX(s.data()); setLeft((s.data()?.minutes ?? 120) * 60); }); }, [id]);
  useEffect(() => { if (!x || done) return; const t = setInterval(() => setLeft(l => { if (l <= 1) { finish(); return 0; } return l - 1; }), 1000); return () => clearInterval(t); }, [x, done]);
  if (!x) return <p>Loading…</p>;
  const mcScore = () => x.sections.reduce((t: number, s: any, si: number) => t + (s.type === "mc" ? s.questions.reduce((u: number, q: any, qi: number) => u + (a[`${si}-${qi}`] === q.answer ? q.marks : 0), 0) : 0), 0);
  const finish = () => { if (done) return; setDone(true); bump(uid, prof, mcScore() * 3); saveAttempt(uid, id!, x.title, mcScore(), x.sections.reduce((t: number, s: any) => t + (s.type === "mc" ? s.questions.reduce((u: number, q: any) => u + q.marks, 0) : 0), 0)); };
  return <div><div className="card"><h2>📝 {x.title}</h2><b>⏱ {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</b> {done && <b> · Auto-marked score: {mcScore()}</b>}</div>
    {x.sections.map((s: any, si: number) => <div className="card" key={si}><h3>{s.name}</h3>{s.note && <i>{s.note}</i>}{s.questions.map((q: any, qi: number) => { const k = `${si}-${qi}`; return <div key={k}><p><b>{qi + 1}. {q.q}</b> [{q.marks}]</p>
      {s.type === "mc" ? q.options.map((o: string, oi: number) => <button key={oi} className={"o " + (!done ? (a[k] === oi ? "r" : "") : oi === q.answer ? "r" : a[k] === oi ? "w" : "")} onClick={() => !done && setA({ ...a, [k]: oi })}>{o}</button>)
      : <><textarea rows={4} placeholder="Write your answer…" onChange={e => setA({ ...a, [k]: e.target.value })} />{done && <pre>{q.model}</pre>}</>}</div>; })}</div>)}
    {!done && <button onClick={finish}>Submit exam</button>}{done && <p>Mark Sections B and C yourself against the model answers.</p>}</div>;
}
