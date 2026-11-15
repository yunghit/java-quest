import { initializeApp } from "firebase/app";
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
const app = initializeApp({ apiKey: import.meta.env.VITE_FB_API_KEY, authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN, projectId: import.meta.env.VITE_FB_PROJECT_ID, appId: import.meta.env.VITE_FB_APP_ID });
// Fallback list: some phone browsers block IndexedDB, so try the next storage type instead of failing.
export const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence] });
// Auto-switch to long polling when a mobile network blocks Firestore's streaming connection.
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
export async function uploadImage(f: File): Promise<string> {
  const fd = new FormData(); fd.append("file", f); fd.append("upload_preset", import.meta.env.VITE_CLD_PRESET);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLD_CLOUD}/image/upload`, { method: "POST", body: fd });
  return (await r.json()).secure_url as string;
}
export async function uploadFile(f: File): Promise<string> {
  const fd = new FormData(); fd.append("file", f); fd.append("upload_preset", import.meta.env.VITE_CLD_PRESET);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLD_CLOUD}/auto/upload`, { method: "POST", body: fd });
  const j = await r.json(); if (!j.secure_url) throw new Error(j.error?.message ?? "upload failed"); return j.secure_url as string;
}
