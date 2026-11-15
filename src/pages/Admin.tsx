import { useEffect, useState } from "react"; import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { db, uploadImage } from "../firebase"; import type { Module } from "../types";
const seeds = import.meta.glob("../../seed/*.json", { eager: true }) as Record<string, { default: any }>;
const blank = { order: 99, emoji: "📘", title: "", learn: "", code: "", quiz: [] as Module["quiz"], lab: undefined as Module["lab"], imageUrl: "" };
export default function Admin() {
  const [list, setList] = useState<Module[]>([]); const [f, setF] = useState<Module>(blank); const [quiz, setQuiz] = useState("[]"); const [msg, setMsg] = useState("");
  const load = () => getDocs(query(collection(db, "modules"), orderBy("order"))).then(s => setList(s.docs.map(d => ({ ...(d.data() as Module), id: d.id }))));
  useEffect(() => { load(); }, []);
  const save = async () => { try { const data = { ...f, quiz: JSON.parse(quiz) }; delete (data as any).id; f.id ? await setDoc(doc(db, "modules", f.id), data) : await addDoc(collection(db, "modules"), data); setF(blank); setQuiz("[]"); setMsg("Saved ✅"); load(); } catch (e: any) { setMsg(e.message); } };
  const importJson = async (file: File) => { const d = JSON.parse(await file.text()); if (d.bank) { for (const b of d.bank) await addDoc(collection(db, "questions"), b); setMsg(`Imported ${d.bank.length} questions`); return; } const arr: Module[] = d; for (const m of arr) await addDoc(collection(db, "modules"), m); setMsg(`Imported ${arr.length}`); load(); };
  const loadBuiltIn = async () => { const have = new Set(list.map(m => m.title)); let n = 0; for (const [path, mod] of Object.entries(seeds)) { const d = mod.default; if (Array.isArray(d)) { for (const m of d) if (!have.has(m.title)) { await addDoc(collection(db, "modules"), m); n++; } } else { await addDoc(collection(db, "exams"), d); n++; } } setMsg(`Loaded ${n} built-in item(s)`); load(); };
  const set = (k: keyof Module) => (e: any) => setF({ ...f, [k]: k === "order" ? +e.target.value : e.target.value });
  return <div><div className="card"><button onClick={loadBuiltIn}>⚡ Load all built-in lessons and exams</button><p>{msg}</p></div><div className="card"><h3>{f.id ? "Edit" : "New"} lesson</h3><input placeholder="Title" value={f.title} onChange={set("title")} /><input placeholder="Emoji" value={f.emoji} onChange={set("emoji")} /><input type="number" placeholder="Order" value={f.order} onChange={set("order")} />
    <textarea rows={4} placeholder="Lesson (HTML)" value={f.learn} onChange={set("learn")} /><textarea rows={4} placeholder="Code" value={f.code} onChange={set("code")} />
    <textarea rows={4} placeholder='Quiz JSON: [{"q":"","options":["a","b"],"answer":0,"why":""}]' value={quiz} onChange={e => setQuiz(e.target.value)} />
    <input type="file" accept="image/*" onChange={async e => e.target.files?.[0] && setF({ ...f, imageUrl: await uploadImage(e.target.files[0]) })} />{f.imageUrl && <small>Image uploaded ✅</small>}
    <button onClick={save}>Save</button><label> Import JSON <input type="file" accept=".json" onChange={e => e.target.files?.[0] && importJson(e.target.files[0])} /></label><label> Import exam JSON <input type="file" accept=".json" onChange={async e => { const f2 = e.target.files?.[0]; if (f2) { await addDoc(collection(db, "exams"), JSON.parse(await f2.text())); setMsg("Exam imported"); } }} /></label><p>{msg}</p></div>
    {list.map(m => <div className="card" key={m.id}>{m.emoji} {m.title}<button onClick={() => { setF(m); setQuiz(JSON.stringify(m.quiz)); }}>Edit</button><button onClick={async () => { await deleteDoc(doc(db, "modules", m.id!)); load(); }}>Delete</button></div>)}</div>;
}
