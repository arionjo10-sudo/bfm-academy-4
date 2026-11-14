# Deploy and maintain the BFM Academy (for the developer or tech volunteer)

This guide is for whoever hosts and looks after the site. The Academy is a static website, so there is no server to run.

## 1. What is in the folder
| File | What it does |
|---|---|
| `index.html` | Page shell and script tags |
| `css/styles.css` | All styling |
| `js/courses.js` | Every course, ministry manual, packet, and question bank |
| `js/app.js` | The app: progress, unlocks, grading, teaching manuals, PDFs, certificates, staff portal |
| `js/config.js` | Your Firebase values (see SETUP-SHARED-RECORDS.md) |
| `js/backend.js` | Sign-in and shared-records code (do not edit) |
| `firebase-rules.json` | Database rules that keep student records private |
| `tools/make-passcodes.js` | Creates director access codes |

## 2. Go live in 20 minutes
1. Follow **SETUP-SHARED-RECORDS.md** to fill in `js/config.js` and paste the rules into Firebase.
2. Host the folder. Any of these work: **Firebase Hosting** (`firebase init hosting`, public folder = this one, single-page app = No, then `firebase deploy`), **Netlify Drop**, **Cloudflare Pages**, or **GitHub Pages**.
3. In `index.html` leave `window.BFM_VERIFY_BASE = location.href.split('#')[0]` as it is, or set it to your final address so certificate QR codes point to the live site.
4. Add your site's domain in Firebase > Authentication > Settings > Authorized domains.
5. Open the site, then sign in as a director (Student / Director switch on the sign-in page) and open **Staff > System**. Every line should say OK, except "Backend file loaded", which only shows OK on your own site.

## 3. Daily and monthly care
- **Check the System tab** (Staff > System) after any change. It shows whether the backend, shared records, and accounts are connected.
- **Back up records.** On the System tab choose **Download all student records**. Do it monthly and before big changes. Keep the file private, since it contains student information.
- **Firebase backup.** In the Firebase console, Realtime Database > the three dots > **Export JSON** gives a full copy as well.
- **Students can back up themselves.** In their profile, Settings has **Back up my progress** and **Restore**. Tell students to do this before changing phones.

## 4. Making changes
- **Change course text, questions, or case studies:** edit `js/courses.js`. Each course is a `C({...})` entry. Lessons use `L(title, scriptureRefs, summary, keyIdeas, practice, reflectionQuestions, activity)`. Questions use `Q(question, rightAnswer, wrong1, wrong2, wrong3)`. Always put the right answer first.
- **Tracks 1 and 2:** the courses keep their questions in a bank (`bank`) that feeds the 30-question final exam. Their assessments are case studies.
- **Administrative track:** same, with the capstone case study (ADM 417) and the final exam (ADM 418).
- **Teaching manuals:** they are built from the course content automatically (`teachDocFor`, `tmTrackDoc`, `tmCourseSection` in `js/app.js`). There is one manual per track, and each course is a chapter. When you edit a course, its chapter updates the next time the manual is opened. To change the wording that all chapters share (the grading rubric and tips), edit `tmCase` and `TEACH_FLAVOR` in `js/app.js`.
- **Who can open teaching manuals:** `canTeach()` in `js/app.js`. Today that is directors, anyone with the Teacher Certification, and people whose profile role is Pastor, Minister, Clergy, Ministry Director, Assistant Ministry Director, or Administrative.
- **Contact details and policies:** search for `BFM_CONTACT` and the policy text in `js/app.js`. Have church leadership read the policies before going live.
- **Colors and fonts:** the variables at the top of `css/styles.css`.
- After any edit, reload the page and check the browser console (F12) for red errors.

## 5. Test checklist before you tell people the site is live
- [ ] Create a student account, finish one lesson, and reload. Progress is still there.
- [ ] Sign in on a second device. Progress follows the account.
- [ ] Send a chat question as a student, then reply from Staff > Messages.
- [ ] Submit a case study as a student, then grade it in Staff > Review and grade.
- [ ] Finish a short class and download the certificate. Scan its QR code.
- [ ] Open a study guide and a teaching manual as PDF.
- [ ] Open Staff > System and download a backup.

## 6. Troubleshooting
| Problem | Likely cause | Fix |
|---|---|---|
| Blank page | A JavaScript error | Open the browser console (F12) and read the first red line |
| "Permission denied" | Rules not published or wrong director email | Re-paste `firebase-rules.json`, and check the director email in config and rules match |
| Director sees no students | Shared records password not entered | Sign out, sign in as director, and type the shared records password |
| Google button missing or fails | Missing client ID or domain not authorized | See SETUP-SHARED-RECORDS.md, optional Google section |
| PDFs do not download | The page cannot reach the PDF libraries (jsPDF, ExcelJS, QR) | Check the internet connection and that the domain is not blocked, or host the libraries yourself |
| Students lose progress | They cleared browser data without an account | Use accounts, or have them restore from their backup file |
| Teaching manuals do not show | The signed-in person is not a teacher or staff | Set their role, or have them finish the Teacher Certification |

## 7. Privacy
- Student records contain names, email addresses, ministry, progress, written answers, and messages. Treat backups like any private church record.
- Do not post the `staff-passcodes.txt` file, the Firebase password, or backups in any public place.
- Delete a student from the staff portal to remove their shared record.

## 8. How the Academy works inside (architecture)
- **One page, no server.** `index.html` loads `js/courses.js` (content) and `js/app.js` (behavior). Everything runs in the browser.
- **Content versus behavior.** Courses, manuals, and question banks live in `courses.js`. Rules (unlocking, grading, certificates, PDFs, the staff portal) live in `app.js`.
- **Student data.** Each student's progress, answers, notes, and settings are one object saved in the browser (localStorage). With accounts on, a copy is saved to Firebase under that student, and the director reads a summary copy.
- **Teaching manuals** are not stored anywhere. They are generated when opened, from the course data.
- **Static libraries from a CDN.** jsPDF (PDFs), ExcelJS (Excel reports), and a QR code library load from jsDelivr. If you need the site to work with no internet, download them and change the script tags in `index.html`.

## 9. Add things
- **A course:** add a `C({id, code, track, grp, title, goal, lessons:[L(...)], quiz:[Q(...)], proj:P(...)})` entry. Use a unique `id` and a unique `code`. For Tracks 1, 2, and Administrative, put the questions in the track bank the way the other courses do, and write a case study as the project.
- **A ministry manual:** add a `MN('key',{...})` entry in the manuals files, a row in `MTPL`, and the key in `MANUAL_ORDER`. The volunteer packet appears automatically. Media and Communications are one manual (`communications`). A new manual also needs a matching key in the Track 3 `SPECS` list if it belongs to a Track 3 course.
- **A teaching manual:** nothing to add. A new course in Tracks 1, 2, or A becomes a new chapter automatically.
- **A director:** run `node tools/make-passcodes.js 10`, paste the printed `ADMIN_KEYS`, give each person one code, and delete `staff-passcodes.txt`.
- **A policy page or contact detail:** edit `BFM_CONTACT` and the policy text in `js/app.js`.

## 10. Releasing a change safely
1. Keep a copy of the current folder (zip it with the date).
2. Make the change and reload locally with Live Server.
3. Open the console (F12). No red errors.
4. Walk through the test checklist in section 5, at least one student path and one director path.
5. Download a backup from Staff > System.
6. Upload to hosting. If something breaks, upload the earlier zip.

## 11. Security notes
- The Firebase `apiKey` is public by design. The database rules protect the data, so keep `firebase-rules.json` published and never switch the database to test mode.
- Director codes are stored only as salted hashes. A lost code is replaced by generating a new set.
- Teaching manuals include exam answer keys. The access check hides them from regular members, but anyone who can read the site's code can find them. Do not rely on it for high-stakes exams. Use a fresh question set when exams matter.
- Review who has the Firebase console login. Remove anyone who no longer serves.

## 12. Performance and accessibility
- The site is large, so the first load can take a moment on slow data. Hosting with compression (Firebase Hosting, Netlify, and Cloudflare do this by default) makes it much smaller.
- Students can change text size, dark mode, a dyslexia-friendly font, line spacing, and high contrast in Settings. Keep those working when you change styles.
- Test on a phone. Most students will use one.

## 13. Common questions from tech volunteers
- **Can I use a different database?** Not without rewriting `backend.js`. Keep Firebase unless you have a strong reason.
- **Can I translate the Academy?** The text is in the course files. Translating means copying the files and replacing the text, keeping the same `id` values.
- **Where is the version history?** The README lists changes by round. Add a line each time you release.
- **A student cannot sign in.** Check Authentication > Users in Firebase. Use Forgot your password on the sign-in page to send a reset email.
- **I deleted a student by mistake.** The all-records backup is a reference copy that you can read, not something the Academy can import. Ask the student to sign in again and, if their progress is gone, to use Restore with their own backup file. Their grades and answers can be read from your backup and entered again if needed.


## Named directors and the activity log

Each director signs in with their own personal access code. Under **Staff portal > System** a director can:

- **Name each code** (Director 1, Director 2, and so on) with a full name and title. After that, the portal says "Signed in as <name>", grades show who gave them, and every action is recorded.
- **See the Activity log**: sign-ins and sign-outs, grades, unlocks, approvals and declines, replies, announcements and events, and profile edits or deletions.
- **Turn a director off** (and back on). A turned-off director is refused at sign-in and is signed out when their session next checks in. At least one director always stays active, and you cannot turn off the account you are using.

With shared records connected (Claude shared records or Firebase), the roster and log are shared by all directors. Without them, they live in that browser only. If you use Firebase, publish the updated `firebase-rules.json` so the `staff` and `audit` areas are director-only.

Honest limit: the codes are checked inside the app, so turning a director off is enforced by the app, not by the server. To fully end a code that may be in the wrong hands, also create replacement codes with `node tools/make-passcodes.js` and publish the update.
