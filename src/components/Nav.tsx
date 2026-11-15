import { NavLink } from "react-router-dom"; import { signOut } from "firebase/auth"; import { auth } from "../firebase"; import { BADGES } from "../game"; import type { Profile } from "../types";
const items: [string, string, string][] = [["/", "🏠", "Home"], ["/boss", "⚔️", "Boss"], ["/materials", "📎", "Files"], ["/leaderboard", "🏆", "Ranks"], ["/history", "🕘", "History"]];
export default function Nav({ prof }: { prof: Profile }) {
  return <header className="top">
    <div className="brand"><img src="./icon.png" /><div><b>Java Quest</b><small>COMP 311</small></div><button className="ghost" onClick={() => signOut(auth)}>Log out</button></div>
    <div className="xp"><span>Lv {Math.floor(prof.xp / 100) + 1}</span><div className="bar"><i style={{ width: `${prof.xp % 100}%` }} /></div><span>{prof.xp} XP · 🔥 {prof.streak ?? 0}</span></div>
    <nav>{items.map(([to, ic, t]) => <NavLink key={to} to={to} end={to === "/"}>{ic} {t}</NavLink>)}{prof.role === "admin" && <NavLink to="/admin">🛠️ Admin</NavLink>}</nav>
    <div className="badges">{BADGES.map(b => <img key={b.name} title={b.name} src={`./${b.img}`} style={{ opacity: b.ok(prof) ? 1 : 0.22, filter: b.ok(prof) ? "none" : "grayscale(1)" }} />)}</div>
  </header>;
}
