# Making messages, notifications and approvals work outside Claude

Inside Claude (the published link) the shared records are built in. In VS Code or on your own web hosting there is no shared place yet, so student messages, director notifications, approvals, grades, announcements and events only live in each person's own browser.

This guide connects the Academy to a **free Firebase Realtime Database** so every student's browser and the director's browser share the same records. It takes about 15 minutes and needs no coding.

## Before you start
- Students must reach the site over the internet. VS Code "Live Server" only runs on your own computer. To let others use it, put the folder on free hosting (Netlify Drop, GitHub Pages, Cloudflare Pages, or your church website host).
- The shared records need a Google account (for Firebase).

## Steps
1. Go to https://console.firebase.google.com and choose **Add project**. Name it `bfm-academy`. You can turn off Google Analytics.
2. **Authentication** > **Get started** > **Sign-in method**. Turn on **Email/Password**. You only need **Anonymous** if you set `studentAccounts:false`.
3. **Authentication** > **Users** > **Add user**. Use an email you control (it does not need to be a real inbox, for example `director@bfm-academy.org`) and a long password. This is the **shared records password** that directors type when they unlock the staff tools. Share it only with directors.
4. **Build** > **Realtime Database** > **Create database**. Pick the closest region and start in **locked mode**.
5. Open the **Rules** tab, paste the contents of `firebase-rules.json` from this folder, change `director@bfm-academy.org` to the email from step 3 (it appears 5 times). The rules also include a `state` section: leave it as is. It holds each student's saved progress and only that student can open it, and press **Publish**.
6. **Project settings** (gear icon) > **General** > **Your apps** > add a **Web app** (name it anything). Copy the `apiKey`. In **Realtime Database** copy the database URL at the top of the Data tab (it looks like `https://bfm-academy-default-rtdb.firebaseio.com`).
7. Open `js/config.js` in VS Code and fill in the three values:
   ```js
   window.BFM_CONFIG={
     apiKey:'AIza...your key...',
     databaseURL:'https://bfm-academy-default-rtdb.firebaseio.com',
     directorEmail:'director@bfm-academy.org',
     studentAccounts:true
   };
   ```
8. Save, then open `index.html` (or upload the folder to your hosting).

## Optional: Continue with Google
1. Firebase console > **Authentication** > **Sign-in method** > **Add new provider** > **Google** > **Enable**. Pick a support email and **Save**.
2. Open the Google provider again and expand **Web SDK configuration**. Copy the **Web client ID** (it ends in `.apps.googleusercontent.com`).
3. Paste it into `js/config.js` as `googleClientId:'...apps.googleusercontent.com'`.
4. Go to https://console.cloud.google.com, pick the same project, then **APIs & Services** > **Credentials** > the OAuth client named "Web client (auto created by Google Service)". Under **Authorized JavaScript origins** add your site address (for example `https://academy.bushwickfamcogop.org`) and, for testing, `http://localhost` and `http://localhost:5500` (or whatever port VS Code Live Server uses). Save. Changes can take a few minutes.
5. In Firebase > **Authentication** > **Settings** > **Authorized domains**, add your site's domain (`localhost` is already there).
6. Google sign-in does not work when you double-click `index.html` (a `file://` page). Use VS Code's Live Server extension or your real hosting.

How it behaves:
- A new Google user gets an Academy account, their Google name fills in their profile, and they go through the tour and the profile step like everyone else.
- If someone already made an Academy account with a password for that same Gmail address, Firebase decides what happens. With Firebase's default setting (one account per email) a Google sign-in for that address normally takes over the same account and the old password may stop working. If Firebase asks to confirm instead, the Academy tells the student to sign in with their email and password. Test this once with your own email before you announce it.

## How it works for people
- **Students** create an account with their email and a password, then log in on any device. Each one can only read and write their own record, and a full copy of their progress is saved to the account so it follows them.
- **Directors** unlock the staff tools with their personal access code and also type the shared records password. Without it the staff portal opens but shows no student data.
- Messages, requests and replies update within a few seconds (the app checks about every 6 seconds while the page is open).

## Good to know
- The Firebase `apiKey` is not a secret. The rules in `firebase-rules.json` are what keep student records private, so do not skip step 5.
- If a student clears their browser data or uses a new device, they log in and their progress loads from their account. If two devices are used at once, the one saved last wins.
- A student who forgets their password uses **Forgot your password?** on the sign-in screen and Firebase emails them a reset link (you can edit the email text under Authentication > Templates).
- Passwords are handled and scrambled by Firebase. They never appear in this site's files or in the Academy's records. Accounts use email and password only.
- Before this update, students were anonymous and their progress lives under a different ID. Start new accounts fresh, or have early testers re-enter their name.
- Records are stored as one text block per student, so only the Academy can read them. Delete a student from the staff portal to remove their shared record.
- This has been tested against a simulated Firebase, not against your real project. After setup, test with one student browser and one director browser (send a chat question, then reply from the Messages tab).
- If you change the director email later, update both `js/config.js` and the rules.


## Certificate registry (added in Round 1)

If you use the Firebase setup, `firebase-rules.json` now also has `cert` (students record their own certificate IDs) and `certok` (only the director writes; this is the confirmed registry). Paste the updated rules and change the director email in both new places. In the artifact version these are the database paths `cert` (read: view, write: interact) and `certok` (read: view, write: admin).
