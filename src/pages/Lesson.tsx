import { useEffect, useState } from "react"; import { useParams } from "react-router-dom"; import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; import { bump } from "../game"; import type { BankQ, Module, Profile } from "../types";
export default function Lesson({ uid, prof }: { uid: string; prof: Profile }) {
  const { id } = useParams(); const [m, setM] = useState<Module | null>(null), [bank, setBank] = useState<BankQ[]>([]);
  const [pick, setPick] = useState<Record<string, number>>({}), [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => { getDoc(doc(db, "modules", id!)).then(s => { const d = s.data() as Module; setM(d); getDocs(query(collection(db, "questions"), where("topic", "==", d.order))).then(b => setBank(b.docs.map(x => ({ ...(x.data() as BankQ), id: x.id })))); }); }, [id]);
  if (!m) return <p>Loading…</p>;
  const choose = async (k: string, i: number, ans: number, quiz: boolean) => {
    if (pick[k] !== undefined) return; const next = { ...pick, [k]: i }; setPick(next);
    const n = Object.keys(next).filter(x => x.startsWith("q")).length, fin = quiz && n === m.quiz.length && !prof.done[id!];
    await bump(uid, prof, (i === ans ? (quiz ? 10 : 5) : 0) + (fin ? 30 : 0), fin ? { [`done.${id}`]: true } : {});
  };
  const mcView = (k: string, q: string, o: string[], a: number, why: string, quiz: boolean) => <div key={k}><b>{q}</b>{o.map((t, i) => <button key={i} className={"o " + (pick[k] === undefined ? "" : i === a ? "r" : pick[k] === i ? "w" : "")} onClick={() => choose(k, i, a, quiz)}>{t}</button>)}{pick[k] !== undefined && <p>{why}</p>}</div>;
  const reveal = (k: string, text?: string) => text ? (open[k] ? <pre>{text}</pre> : <button onClick={() => setOpen({ ...open, [k]: true })}>Reveal answer</button>) : null;
  const mc = bank.filter(b => b.type === "mc"), sh = bank.filter(b => b.type === "short"), pr = bank.filter(b => b.type === "project");
  return <div><div className="card"><h2>{m.emoji} {m.title}</h2>{m.imageUrl && <img src={m.imageUrl} style={{ maxWidth: "100%" }} />}<div dangerouslySetInnerHTML={{ __html: m.learn }} />{m.code && <pre>{m.code}</pre>}</div>
    {m.quiz.length > 0 && <div className="card"><h3>🎯 Quiz</h3>{m.quiz.map((q, i) => mcView("q" + i, q.q, q.options, q.answer, q.why, true))}</div>}
    {m.lab && <div className="card"><h3>🧪 Mini lab</h3><p>{m.lab.task}</p>{reveal("lab", m.lab.solution)}</div>}
    {m.projects?.length ? <div className="card"><h3>🛠️ Project steps</h3>{m.projects.map((s, i) => { const k = `${id}_${i}`, d = prof.steps?.[k]; return <div key={k} style={{ marginBottom: 10 }}><b>{d ? "✅ " : ""}{s.title}</b> {s.marks ? `[${s.marks}]` : ""}<p>{s.brief}</p>{reveal("s" + k, s.solution)}{!d && <button onClick={() => bump(uid, prof, 10, { [`steps.${k}`]: true })}>Mark done (+10 XP)</button>}</div>; })}</div> : null}
    {mc.length > 0 && <div className="card"><h3>📝 Practice questions (+5 XP each)</h3>{mc.map(b => mcView("b" + b.id, b.q!, b.options!, b.answer!, b.why ?? "", false))}</div>}
    {sh.length > 0 && <div className="card"><h3>✍️ Short answer</h3>{sh.map(b => <div key={b.id}><b>{b.q}</b> [{b.marks}]<textarea rows={3} placeholder="Write your answer first…" />{reveal("m" + b.id, b.model)}</div>)}</div>}
    {pr.length > 0 && <div className="card"><h3>🚀 Mini projects</h3>{pr.map(b => <div key={b.id}><b>{b.title}</b><p>{b.brief}</p>{reveal("p" + b.id, b.solution)}</div>)}</div>}</div>;
}
