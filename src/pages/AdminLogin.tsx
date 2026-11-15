import { useState } from "react"; import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth"; import { doc, getDoc } from "firebase/firestore"; import { auth, db } from "../firebase"; import AuthShell from "../components/AuthShell"; import { nice } from "./Login";
export default function AdminLogin() {
  const [reset, setReset] = useState(false), [e, setE] = useState(""), [p, setP] = useState(""), [show, setShow] = useState(false), [err, setErr] = useState(""), [ok, setOk] = useState(""), [busy, setBusy] = useState(false), [n, setN] = useState(0);
  const go = async () => {
    setErr(""); setOk(""); setBusy(true);
    try {
      if (reset) { await sendPasswordResetEmail(auth, e.trim()); setOk("If that email has an account, a reset link is on its way. Check spam too."); }
      else { const c = await signInWithEmailAndPassword(auth, e.trim(), p); const s = await getDoc(doc(db, "users", c.user.uid));
        if (s.data()?.role !== "admin") { await signOut(auth); setErr("This account is not an admin. Use the student sign-in instead."); setN(v => v + 1); } }
    } catch (x: any) { setErr(nice(x)); setN(v => v + 1); }
    setBusy(false);
  };
  const key = (ev: React.KeyboardEvent) => ev.key === "Enter" && go();
  return <AuthShell admin>
    <p className="mu">{reset ? "We’ll email you a link to set a new password." : "Teachers and editors only. You’ll go straight to your dashboard."}</p>
    <input placeholder="Admin email" type="email" value={e} onChange={x => setE(x.target.value)} onKeyDown={key} />
    {!reset && <div className="pw"><input placeholder="Password" type={show ? "text" : "password"} value={p} onChange={x => setP(x.target.value)} onKeyDown={key} /><button className="eye" onClick={() => setShow(!show)}>{show ? "🙈" : "👁️"}</button></div>}
    <button className="go" disabled={busy} onClick={go}>{busy ? "Checking…" : reset ? "Send reset link 📧" : "Enter dashboard 🛠️"}</button>
    {err && <p key={n} className="shake" style={{ color: "var(--bad)" }}>{err}</p>}{ok && <p className="okmsg">{ok}</p>}
    <button className="lnk" onClick={() => { setReset(!reset); setErr(""); setOk(""); }}>{reset ? "← Back to sign-in" : "Forgot password?"}</button>
    <a className="lnk" href="#/">← Student sign-in</a>
  </AuthShell>;
}
