# Java Quest: Setup Guide (from zero to running on your phone)

You will end up with:
- a **web app** at a Cloudflare address (works on any phone or laptop),
- an **Android APK** built by GitHub that you can send to classmates,
- an **admin page** where you import lessons, labs, question banks and exams.

Everything below is free. Allow about 60 to 90 minutes the first time.

Note: this project was written without being built or run, so the first build may show a small error. Section 9 explains what to do.

---

## 0. What you need installed

| Tool | Why | Get it |
|---|---|---|
| Node.js 20 or newer | runs and builds the app | nodejs.org (choose LTS) |
| Git | pushes your code to GitHub | git-scm.com |
| A code editor (VS Code) | edit files | code.visualstudio.com |

Accounts (all free): **Google** (for Firebase), **GitHub**, **Cloudflare**, **Cloudinary**.

Check the installs by opening a terminal and typing `node -v` and `git --version`. Both should print a version number.

---

## 1. Put the project files in order

1. Unzip `java-quest.zip`. You get a folder called `jq`. This is the **project root**.
2. Apply the later changes from the `patches` folder, as written in `patches/PLACE_ME.md`:
   - **Replace** these files in `jq`: `src/types.ts`, `src/game.ts`, `src/App.tsx`, `src/pages/Lesson.tsx`, and `firestore.rules`.
   - **Add** `src/pages/Leaderboard.tsx`, `src/pages/History.tsx`, and the five images `public/badge-1.png` to `public/badge-5.png`.
   - **Make the two small find and replace edits** in `src/pages/Exam.tsx` and `src/pages/Admin.tsx` that `PLACE_ME.md` lists.
3. Keep the other `content` files (lessons, labs, banks, exams) somewhere easy to find. You will import them later from the admin page.

Your folder should now contain, among others: `package.json`, `index.html`, `capacitor.config.ts`, `firestore.rules`, `.github/workflows/` (two files), `public/` (images), `resources/icon.png`, `seed/`, `src/`.

---

## 2. Firebase (login and database)

1. Go to **console.firebase.google.com** and click **Add project**. Name it `java-quest`. You can switch Google Analytics off.
2. **Turn on login:** left menu **Build, Authentication, Get started, Sign-in method, Email/Password, Enable, Save**.
3. **Create the database:** **Build, Firestore Database, Create database**. Choose **production mode**, pick a location near you (for example `europe-west` or `africa-south1` if offered), then **Enable**.
4. **Paste the rules:** Firestore, **Rules** tab. Delete what is there, paste the full contents of `jq/firestore.rules`, and click **Publish**.
5. **Get your app keys:** click the gear icon, **Project settings**, scroll to **Your apps**, click the **web icon `</>`**, name it `web`, click **Register app** (do not tick Firebase Hosting). Copy these four values from the code shown: `apiKey`, `authDomain`, `projectId`, `appId`.

Keep that browser tab or a note open. You need these values twice (local and GitHub).

---

## 3. Cloudinary (image uploads for lessons)

1. Sign up at **cloudinary.com**. On the dashboard note your **Cloud name**.
2. **Settings (gear), Upload, Upload presets, Add upload preset.**
3. Set **Signing mode** to **Unsigned**. Name it, for example, `javaquest`. Save.
4. Note the preset name.

If you skip this, everything works except uploading lesson images in the admin page.

---

## 4. Run it on your computer first

1. In the `jq` folder, copy `.env.example` to a new file named `.env`.
2. Fill it in:

```
VITE_FB_API_KEY=your apiKey
VITE_FB_AUTH_DOMAIN=your authDomain
VITE_FB_PROJECT_ID=your projectId
VITE_FB_APP_ID=your appId
VITE_CLD_CLOUD=your Cloudinary cloud name
VITE_CLD_PRESET=javaquest
```

3. In a terminal inside `jq`:

```
npm install
npm run dev
```

4. Open the address it prints (usually `http://localhost:5173`).
5. Click **Sign up** with your own email and a password of at least 6 characters. You should land on the home screen (empty for now).

If the page is blank, press F12 and read the red error. See Section 9.

---

## 5. Make yourself the admin

1. Firebase console, **Firestore Database, Data**.
2. Open the **users** collection and click your document (its ID is your user ID, and the `email` field shows your address).
3. Change the field `role` from `student` to `admin` and save.
4. Refresh the app. A **🛠️ Admin** link now appears in the top bar.

Do this only for yourself. Everyone else stays `student`.

---

## 6. Load the content (admin page)

Open **Admin**. Import files in this order. After each file, wait for the "Imported" message before choosing the next one.

1. Press **⚡ Load all built-in lessons and exams** **once**. This loads lessons 5, 9, 11, 12 and Mock Exam 1 from the `seed` folder. Do not press it a second time (it would duplicate the exam).
2. **Import JSON** for each lesson file: lessons 1, 2, 3, 4, 6, 7, 8 and 10.
3. **Import JSON** for each file in `content/labs` (13 files).
4. **Import JSON** for each file in `content/bank` (12 files).
5. **Import exam JSON** for the three exam files: `exam.past1-theory-test-oct2024`, `exam.past2-test-50marks`, `exam.mock2-lecturer-hints`.

Import each file only once. If you import something twice by mistake, delete the duplicate in Firestore (collections `modules`, `exams` or `questions`).

Check on the home screen: you should see the lessons in order with the labs after their lessons, and an **Exams and tests** section.

---

## 7. Put the code on GitHub and set the secrets

1. On github.com, click **New repository**, name it `java-quest`, keep it **Private** if you like, and create it. Do not add a README.
2. In a terminal inside `jq`:

```
git init
git add .
git commit -m "first version"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/java-quest.git
git push -u origin main
```

Make sure `.env` is **not** pushed (add a `.gitignore` file containing `.env` and `node_modules` before `git add .`, or the push will contain your keys).

3. In the repo, **Settings, Secrets and variables, Actions, New repository secret**. Add all of these (names exactly as written):

| Secret name | Value |
|---|---|
| `VITE_FB_API_KEY` | Firebase apiKey |
| `VITE_FB_AUTH_DOMAIN` | Firebase authDomain |
| `VITE_FB_PROJECT_ID` | Firebase projectId |
| `VITE_FB_APP_ID` | Firebase appId |
| `VITE_CLD_CLOUD` | Cloudinary cloud name |
| `VITE_CLD_PRESET` | Cloudinary preset name |
| `CLOUDFLARE_API_TOKEN` | from Section 8 |
| `CLOUDFLARE_ACCOUNT_ID` | from Section 8 |

---

## 8. Cloudflare Pages (the web version)

1. Sign in at **dash.cloudflare.com**.
2. **Workers and Pages, Create, Pages, Upload assets**. Name the project exactly `java-quest`. Upload any small placeholder file to create it, then continue.
3. **Account ID:** shown on the right of the Workers and Pages overview page. Copy it into the `CLOUDFLARE_ACCOUNT_ID` secret.
4. **API token:** **My Profile, API Tokens, Create Token, Create Custom Token.** Permission: **Account, Cloudflare Pages, Edit**. Create it and copy it into the `CLOUDFLARE_API_TOKEN` secret.
5. Back in GitHub, open the **Actions** tab. The workflow **Deploy Web to Cloudflare Pages** runs on every push to `main`. You can also click **Run workflow** to start it.
6. When it turns green, your site is at `https://java-quest.pages.dev`.

Open that address on your phone and sign in. It uses the same accounts and data as your local copy.

To use it like an app on Android: in Chrome, **menu, Add to Home screen**. On iPhone: Safari, **Share, Add to Home Screen**.

---

## 9. The Android APK

1. In GitHub, open the **Actions** tab and choose **Build Android APK** (it also runs on every push; you can click **Run workflow**).
2. Wait about 5 to 10 minutes. Open the finished run, scroll to **Artifacts** and download **java-quest-apk** (a zip). Unzip it to get `app-debug.apk`.
3. Send the APK to your phone (WhatsApp to yourself, Google Drive, USB).
4. Open it on the phone. If Android blocks it, allow **Install unknown apps** for the app you opened it from (Files, Chrome or WhatsApp). If Play Protect warns, choose **Install anyway** (it is a debug build that you made yourself).
5. Sign in with the same account you use on the web.

For classmates: send them the same `app-debug.apk`. They sign up themselves, and their accounts stay `student`. The APK works on Android only; iPhone users use the web address.

When you add lessons or exams in the admin page, **nobody needs a new APK**. The content comes from Firebase. You only need a new APK when you change code.

---

## 10. If something goes wrong

| Problem | Fix |
|---|---|
| `npm install` fails | Update Node to version 20 or newer, then retry |
| White screen locally | F12 and read the red error. Usually a missing `.env` value |
| "Missing or insufficient permissions" | Firestore Rules were not published (Section 2, step 4), or you are not admin yet |
| "auth/operation-not-allowed" | Enable Email/Password under Authentication |
| Image upload fails | The Cloudinary preset must be **Unsigned**; check the cloud name |
| Build error in GitHub Actions | Open the run, click the red step, copy the last 30 lines and send them to me, along with the file name |
| Cloudflare deploy fails with "project not found" | The project name must be exactly `java-quest` (Section 8, step 2) |
| APK build fails at `cap add android` | Send me the log; it is usually a Gradle or Java version message |
| Lessons show but no practice questions | Bank files not imported, or `Lesson.tsx` not replaced |
| Leaderboard or history empty | New rules not published, or no XP earned yet |
| Duplicate lessons | Delete the extra documents in Firestore, collection `modules` |

---

## 11. Quick checklist

- [ ] Node, Git, VS Code installed
- [ ] Patch files applied in `jq`
- [ ] Firebase: Email login on, Firestore created, rules published, four keys copied
- [ ] Cloudinary: unsigned preset created
- [ ] `.env` filled in, `npm run dev` works, signed up
- [ ] Your user set to `role = admin`
- [ ] Content imported (built-in button once, then lessons, labs, banks, exams)
- [ ] GitHub repo pushed, 8 secrets added
- [ ] Cloudflare project `java-quest` created, token and account ID added
- [ ] Web address opens on your phone
- [ ] APK downloaded from Actions and installed

Never share your `.env` file or your Cloudflare token publicly.
