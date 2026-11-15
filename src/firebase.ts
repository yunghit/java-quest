import { initializeApp } from "firebase/app"; import { getAuth } from "firebase/auth"; import { getFirestore } from "firebase/firestore";
const app = initializeApp({ apiKey: import.meta.env.VITE_FB_API_KEY, authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN, projectId: import.meta.env.VITE_FB_PROJECT_ID, appId: import.meta.env.VITE_FB_APP_ID });
export const auth = getAuth(app); export const db = getFirestore(app);
export async function uploadImage(f: File): Promise<string> {
  const fd = new FormData(); fd.append("file", f); fd.append("upload_preset", import.meta.env.VITE_CLD_PRESET);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLD_CLOUD}/image/upload`, { method: "POST", body: fd });
  return (await r.json()).secure_url as string;
}
