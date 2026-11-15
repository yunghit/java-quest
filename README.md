# Java Quest (COMP 311)
One React + TypeScript codebase: student app (web + Android APK via Capacitor) and `/#/admin` for editors.
Stack: Firebase Auth + Firestore, Cloudinary images, Cloudflare Pages hosting, GitHub Actions builds.
## Setup
1. Firebase: create project, enable Email/Password auth and Firestore, paste `firestore.rules`, copy web config into `.env` (see `.env.example`).
2. Cloudinary: create an UNSIGNED upload preset; set `VITE_CLD_CLOUD` and `VITE_CLD_PRESET`.
3. GitHub: add repo secrets: the 6 `VITE_*` values plus `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
4. Sign up in the app, then in Firestore set `users/<your uid>.role` to `admin`. Open `/#/admin` and import `seed/modules.sample.json`.
6. Import `seed/exam.mock1.json` via the exam importer, and the lesson seeds in `seed/`.
7. Push to `main`: the web deploys to Cloudflare; the APK appears under Actions > Artifacts.
Local: `npm install && npm run dev`.
