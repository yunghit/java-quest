import { useState } from "react"; import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"; import { auth } from "../firebase"; import AuthShell from "../components/AuthShell";
const MSG: Record<string, string> = {
  "auth/network-request-failed": "Can't reach Google's servers. Check your connection, turn off VPN, data saver and private DNS, open this page in Chrome (not inside WhatsApp), then try again.",
  "auth/email-already-in-use": "That email already has an account. Switch to Log in.", "auth/weak-password": "Password must be at least 6 characters.", "auth/invalid-email": "That email address doesn't look right.",
  "auth/invalid-credential": "Wrong email or password. Forgot it? Use the reset link below.", "auth/too-many-requests": "Too many attempts. Wait a minute and try again.", "auth/missing-password": "Enter your password." };
export const nice = (x: any) => MSG[x?.code] ?? `${x?.code ?? ""} ${x?.message ?? ""}`;
type Mode = "login" | "signup" | "reset";
export default function Login() {
  const [mode, setMode] = useState<Mode>("login"), [e, setE] = useState(""), [p, setP] = useState(""), [show, setShow] = useState(false), [err, setErr] = useState(""), [ok, setOk] = useState(""), [busy, setBusy] = useState(false), [n, setN] = useState(0);
  const pick = (m: Mode) => { setMode(m); setErr(""); setOk(""); };
  const go = async () => {
    setErr(""); setOk(""); setBusy(true);
    try {
      if (mode === "reset") { await sendPasswordResetEmail(auth, e.trim()); setOk("If that email has an account, a reset link is on its way. Check your spam folder too."); }
      else { const run = () => (mode === "signup" ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, e.trim(), p);
        try { await run(); } catch (x: any) { if (x.code === "auth/network-request-failed") { await new Promise(r => setTimeout(r, 1500)); await run(); } else throw x; } }
    } catch (x: any) { setErr(nice(x)); setN(v => v + 1); }
    setBusy(false);
  };
  const key = (ev: React.KeyboardEvent) => ev.key === "Enter" && go();
  return <AuthShell>
    {mode !== "reset" ? <div className="tabs"><button className={mode === "login" ? "on" : ""} onClick={() => pick("login")}>Log in</button><button className={mode === "signup" ? "on" : ""} onClick={() => pick("signup")}>Sign up</button></div> : <p className="mu">Enter your email and we’ll send a reset link.</p>}
    <input placeholder="Email" type="email" value={e} onChange={x => setE(x.target.value)} onKeyDown={key} />
    {mode !== "reset" && <div className="pw"><input placeholder="Password" type={show ? "text" : "password"} value={p} onChange={x => setP(x.target.value)} onKeyDown={key} /><button className="eye" onClick={() => setShow(!show)}>{show ? "🙈" : "👁️"}</button></div>}
    <button className="go" disabled={busy} onClick={go}>{busy ? "Please wait…" : mode === "login" ? "Let’s go 🚀" : mode === "signup" ? "Create my account ✨" : "Send reset link 📧"}</button>
    {err && <p key={n} className="shake" style={{ color: "var(--bad)" }}>{err}</p>}{ok && <p className="okmsg">{ok}</p>}
    {mode === "login" && <button className="lnk" onClick={() => pick("reset")}>Forgot password?</button>}{mode === "reset" && <button className="lnk" onClick={() => pick("login")}>← Back to log in</button>}
    <a className="lnk" href="#/admin-login">Admin sign-in →</a>
  </AuthShell>;
}
