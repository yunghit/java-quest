import { NavLink } from "react-router-dom"; import { signOut } from "firebase/auth"; import { auth } from "../firebase"; import { BADGES } from "../game"; import type { Profile } from "../types";
const student: [string, string, string][] = [["/", "🏠", "Home"], ["/boss", "⚔️", "Boss"], ["/materials", "📎", "Files"], ["/leaderboard", "🏆", "Ranks"], ["/history", "🕘", "History"]];
const admin: [string, string, string][] = [["/admin", "🛠️", "Dashboard"], ["/learn", "📚", "Student view"], ["/materials", "📎", "Files"], ["/leaderboard", "🏆", "Ranks"]];
export default function Nav({ prof }: { prof: Profile }) {
  const isAdmin = prof.role === "admin"; const items = isAdmin ? admin : student;
  return <header className="top">
    <div className="brand"><img src="./icon.png" /><div><b>Java Quest {isAdmin && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "var(--a1)", color: "#fff", marginLeft: 6 }}>ADMIN</span>}</b><small>{isAdmin ? prof.email : "COMP 311"}</small></div><button className="ghost" onClick={() => signOut(auth)}>Log out</button></div>
    {!isAdmin && <div className="xp"><span>Lv {Math.floor(prof.xp / 100) + 1}</span><div className="bar"><i style={{ width: `${prof.xp % 100}%` }} /></div><span>{prof.xp} XP · 🔥 {prof.streak ?? 0}</span></div>}
    <nav>{items.map(([to, ic, t]) => <NavLink key={to} to={to} end>{ic} {t}</NavLink>)}</nav>
    {!isAdmin && <div className="badges">{BADGES.map(b => <img key={b.name} title={b.name} src={`./${b.img}`} style={{ opacity: b.ok(prof) ? 1 : 0.22, filter: b.ok(prof) ? "none" : "grayscale(1)" }} />)}</div>}
  </header>;
}
