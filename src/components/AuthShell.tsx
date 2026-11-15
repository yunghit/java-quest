import { ReactNode, useEffect, useMemo, useState } from "react"; import "../auth.css";
const TAGS = ["Learn Java.", "Earn XP.", "Beat the exam.", "Level up! 🚀"], SYMS = ["{ }", ";", "</>", "int", "( )", "[ ]", "new", "=>", "++", "class"];
export default function AuthShell({ admin, children }: { admin?: boolean; children: ReactNode }) {
  const [i, setI] = useState(0); useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % TAGS.length), 2600); return () => clearInterval(t); }, []);
  const syms = useMemo(() => Array.from({ length: 16 }, (_, k) => ({ s: SYMS[k % SYMS.length], l: Math.random() * 100, d: 10 + Math.random() * 14, dl: -Math.random() * 20, z: 18 + Math.random() * 22 })), []);
  return <div className="auth"><div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
    {syms.map((x, k) => <span key={k} className="sym" style={{ left: `${x.l}%`, animationDuration: `${x.d}s`, animationDelay: `${x.dl}s`, fontSize: x.z }}>{x.s}</span>)}
    <div className="card auth-card"><img className="bob" src={admin ? "./icon.png" : "./mascot.png"} width={admin ? 72 : 130} style={admin ? { borderRadius: 16 } : undefined} />
      <h2 className="grad" style={{ fontSize: 28, margin: "6px 0" }}>{admin ? "Admin Console" : "Java Quest"}</h2>
      <div key={i} className="tag">{admin ? "Teach. Track. Inspire." : TAGS[i]}</div>{children}</div></div>;
}
