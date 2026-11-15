import { addDoc, collection, doc, increment, setDoc, updateDoc } from "firebase/firestore"; import { db } from "./firebase"; import type { Profile } from "./types";
export async function bump(uid: string, p: Profile, gain: number, extra: Record<string, unknown> = {}) {
  const today = new Date().toDateString(), y = new Date(Date.now() - 864e5).toDateString();
  const streak = p.last === today ? p.streak ?? 1 : p.last === y ? (p.streak ?? 0) + 1 : 1;
  await updateDoc(doc(db, "users", uid), { xp: increment(gain), streak, last: today, ...extra });
  await setDoc(doc(db, "leaderboard", uid), { name: p.email.split("@")[0], xp: p.xp + gain, streak }, { merge: true });
}
export const saveAttempt = (uid: string, examId: string, title: string, score: number, total: number) =>
  addDoc(collection(db, "users", uid, "attempts"), { examId, title, score, total, at: Date.now() });
export const BADGES = [
  { img: "badge-1.png", name: "First Steps", ok: (p: Profile) => Object.keys(p.done).length >= 1 },
  { img: "badge-2.png", name: "Halfway Hero", ok: (p: Profile) => Object.keys(p.done).length >= 6 },
  { img: "badge-3.png", name: "Course Clear", ok: (p: Profile) => Object.keys(p.done).length >= 12 },
  { img: "badge-4.png", name: "XP Hunter", ok: (p: Profile) => p.xp >= 500 },
  { img: "badge-5.png", name: "On Fire", ok: (p: Profile) => (p.streak ?? 0) >= 3 }];
