# BFM Academy

A static website (HTML, CSS, JavaScript). No build step and no server code.

## Open it in VS Code
1. Unzip the folder and open it in VS Code (File > Open Folder).
2. Install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.
   (Double-clicking `index.html` also works, but Live Server is smoother.)

## Folder layout
- `index.html` – page shell (header, footer, script tags)
- `css/styles.css` – all styling. Brand colors and fonts are the variables at the top (`--brand` is the gold #C6A75E).
- `js/courses.js` – every course, manual, packet, and question bank (lessons, quizzes, projects), tracks, ministries, readiness weights
- `js/app.js` – the app: progress, unlocks, grades, notifications, profile, readiness, transcript and certificate PDFs, verification

## Classes
The New Members Class (5 courses, `nmc-101` to `nmc-105`, plus the 15-question test `nmc-final`) and the Water Baptism Class (3 courses, `bap-101` to `bap-103`) are at the end of `js/courses.js` in the files marked NEW MEMBERS CLASS and WATER BAPTISM CLASS. Each course unlocks when the one before it is finished, and finishing a class earns a certificate.

## Common edits
- **Change or add a course:** edit `js/courses.js`. Each course is a `C({...})` entry. The files are grouped by track.
- **Change the colors/fonts:** edit the brand block near the bottom of `css/styles.css`.
- **Certificate QR address:** in `index.html`, set `window.BFM_VERIFY_BASE` to the address where you host the site.

## Admin mode (instructor preview)
Staff open the **Staff** link in the footer and enter their personal Director access code. Each director has a different code (10 characters, like `ABCDE-FGH23`). Codes are never stored in the site: `ADMIN_KEYS` in `js/app.js` holds only salted PBKDF2 hashes. To add, replace or revoke codes, run `node tools/make-passcodes.js 10`, paste the printed `ADMIN_KEYS` over the old one, give each person one code from `staff-passcodes.txt`, then delete that file. Sessions last 4 hours, lock after 30 idle minutes, and 5 wrong tries cause a waiting period.

## Tracks and manuals
- **Track 2** is general spiritual leadership for any ministry (12 courses, any order).
- **Track 3** is for specific ministries: Youth, Children's, Men's, Women's, Outreach, Communications, Christian Education, Dance, Deacon, Usher & Hospitality, Couples, and Nursery. To add one, add a `{k,n,f}` entry to `SPECS` in `js/courses.js`, two `C({...})` courses with the same `key`, and a row in `WS` (post.js section).
- Every study guide (screen, print, PDF) opens with "BUSHWICK FAMILY MINISTRIES" (large, bold), "CHURCH OF GOD OF PROPHECY" (smaller), then the ministry or program name. The name comes from `minName()` in `js/app.js`.

## Classes, registration and review
- BFM New Believers, New Members and Water Baptism open after the student presses **Register for this class**. The BFM Discipleship Class opens only by permission from the Academy director (students request it on the class page).
- Any locked course can be unlocked for a student: the student sends **Request unlock**, or the director opens it from the student's page (**Unlock courses**) in the Students tab.
- Lessons, assessments, projects and study guides stay locked until the above is done. Lessons, assessments, projects and study guides stay locked until then.
- Each class course has **Review my work and answers**: written answers open per lesson once it is completed, and assessment answers with the correct ones open once the assessment has been taken.
- **BFM Discipleship Class** joins Discipleship 101 and 201 (files `d14.js`).
- **Track 3** has one course per ministry (12 in all); `post.js` joins the lessons of each pair into a single course and drops the old core courses.

## Good to know
- Progress, the student profile, and certificates are saved in the browser's local storage, per device. Clearing site data erases them.
- Certificate verification checks that the ID matches the name, credential and date. A real "was this issued by BFM" check needs a shared database (for example Learning Station), which this version does not have.
- The PDF and QR features load two libraries from the jsDelivr CDN, so they need an internet connection.
- Fonts (Inter, Montserrat) load from Google Fonts.


## Latest changes
- **Logo**: gold BFM logo in the header (`img/logo-gold.png`, swap the file to change it).
- **New Believers Class** (4 courses, locked in order) added at the top of the Classes list.
- **Enroll without starting**: the course page has *Enroll in this course*; enrolled courses show an *Enrolled* badge and the button becomes *Continue*.
- **Hero Start learning** scrolls down to the Classes section.
- **Notifications** open as a small dropdown from the bell (*View all* opens the full page).
- **Back to Campus** button on every page except the home page.

## Admin tools, requests, profile, study guides (latest)
- **Admin > Students / Review & grade / Requests / Course activity / Certificates** (Staff link, personal access code).
- Students can request to skip a course (approved = "Waived") and request permission to start Track A (open to everyone, needs approval).
- Profile has a picture upload, **Save profile**, a live student profile card, a picture editor (crop, zoom, rotate), several ministries, interests and a favorite scripture, Settings (Light/Dark/Auto, larger text), and Delete profile.
- **Study guides**: Download PDF or Print from any unlocked course page.
- Required-course counts exclude the optional Track A (Administrative) and Teacher Certification.
- **Final test**: the Water Baptism Class ends with a final test course (BAP 190): a review lesson, a 15-question test (70% to pass, unlimited retakes) and a sign-off with the pastor. The class certificate is issued only after it. The other classes have no final test. Exam courses use `pass:0.7` and `exam:true` in `js/courses.js` (`d16`).
- **Teacher Certification** (track `T`, optional, by director permission): TCH 101, 102, 103, 201 and a practicum + final exam (TCH 202), covering Sunday school, discipleship, water baptism preparation, new believers and new members classes. Earns the BFM Certified Teacher certificate (`BFM-T-…`). Students request permission from the track page (`access_T`); the director approves under Requests or from a student's Unlock box.
- Sharing student records between devices needs a database. On claude.ai this uses the page's `db` capability (see `initShared`, `pushNow`, `watchAdmin` in js/app.js). In plain VS Code / GitHub Pages hosting there is no database, so Admin shows only the current browser. To use your own backend (Firebase, Supabase), replace those three functions.

## Dashboard additions
- Started courses, course search, and a large footer with the logo, Quick access, Events (links to the BFM events calendar) and site links. The daily streak was removed.
- Study guides redesigned for PDF and print (cover page with contents, running header and footer, ruled writing lines). Print styles are in `css/styles.css` under `/* study guide */`.

- Study guides now open with a cover page and a letter to the student (the gold logo for the PDF is embedded in js/logo data inside js/app.js). Started courses also appear at the top of the Catalog.

## Security notes
- A browser-only site cannot truly hide an admin screen: the real protection for student records is the database access rules (only the artifact owner and invited editors can read `inbox`). Treat the access code as a front door and the rules as the lock.
- For a public website, move sign-in and records to a real server (accounts, server-side checks) and keep this UI.

## Round 4 features
- **Settings (student):** text size slider, dyslexia-friendly font (Lexend), line spacing, high contrast, reduce motion, weekly study goal with a gentle reminder.
- **Course tools:** bookmark any lesson and keep private notes (Bookmarks and notes page, notes download).
- **Staff tabs:** Reports (monthly, quarterly, yearly grading reports as PDF or CSV), Announcements, Events.
- Announcements and events are stored in the shared documents `pub/announcements` and `pub/events` (everyone can read, only admins can write). If you move off the artifact database, replace `pubWatch` and `pubSet` in `js/app.js`.


## Latest round
- **Study guides page**: classes and tracks are separate sections with spacing, and every group starts collapsed.
- **Track 3 is "Ministry Specializations"**: every ministry has its own **Ministry manual** (screen and PDF) with no course code, course title or "Department". Resources lists them as "<Ministry> manual".
- **Ministry calling**: a student picks one ministry in Track 3 and only that course shows; other ministries are locked under "Other ministries" and need permission (Request to unlock). The director can set or reset a student's ministry under "Ministry calling" on the student page.
- **Logo on all PDFs**: study guides, ministry manuals, transcript, certificate and grading report.
- **Director notification bell** (new requests, updates, messages) and a **Messages** tab for student questions and replies.
- **FAQs and Privacy** pages, different for students and for the director (footer links).
- **Help chat** with the logo button in the corner: answers from the FAQs by keyword (not AI) and can send the question to the director.
- Director settings: the "Text and display" box is fixed.

## Ministry manuals and Nursery (latest)
- **Nursery Ministry** was added to Track 3 (course MIN 420, lessons from `js/courses.js` file section NURSERY MINISTRY). Track 3 now has 12 ministries.
- Every ministry has a **separate Ministry manual** from its study guide. It is on the course page as soon as the course opens (Open manual, Download PDF, Print) and in Study guides and resources. The manual text lives in `js/courses.js` under MINISTRY MANUALS (`MN('youth',{...})`). Edit the roles, rhythm, standards, safety and checklists there. Each manual is a template that the ministry leader and pastor confirm.
- The ministry study guide keeps the lessons; the manual is the working document for running the ministry.
- **Help chat** has an **End chat** button to start over, and the **Academy Director** portal has a small logo icon at the bottom right that opens Quick actions.

## Shared records in VS Code
Messages, notifications and approvals need a shared place. Follow `SETUP-SHARED-RECORDS.md` (Firebase, free, about 15 minutes) and fill in `js/config.js`. With `js/config.js` left empty, everything still works on one device only.

## Ministry manuals, previews and footers (latest)
- Each manual now covers: understanding the ministry (what it is and is not), purpose and Scripture, a typical service or meeting, team roles, **communication**, **consistency and faithfulness**, **character and integrity**, safety, checklists, what a healthy ministry looks like with common challenges, reporting, and a sign-off page. The text is different for every ministry. It lives in `js/courses.js` under MINISTRY MANUALS (`MN('youth',{...})` and `MX('youth',{...})`).
- The on-screen preview of every study guide and manual now matches the PDF: logo cover, running sections, and a footer with the small logo, "Bushwick Family Ministries | Church of God of Prophecy | Ministry name", and "Copyright 2026 Bushwick Family Ministries". The browser Print button repeats that footer on every page.
- The downloaded PDFs have the same footer on every page.

## Academy Director experience (staff)
- After the director signs in, the header reads **Campus AD · Catalog · Admin · Records**. These are teacher pages, not the student pages.
- **Campus AD**: classroom overview, teaching tools, per-track progress, live announcements and coming events.
- **Catalog**: every course with enrolled, completed and average grade, plus its study guide and ministry manual.
- **Admin**: program health, catalog controls (Discipleship and Track A permissions), students by ministry, admin tools, access and security.
- **Records**: every student's transcript (view or PDF, including seminar and event hours, waived courses, certificates and readiness), earned certificates, issue a certificate, and verify a certificate against the Academy records.
- **Log out** sits at the bottom of Overview and Profile. The quick-actions logo button follows the director on every page.
- Announcements have a **Preview** step before posting.

- Profile roles: Church Member, Ministry Member, Assistant Ministry Director, Ministry Director, Deacon, Clergy, Minister, Pastor, Administrative, Other (type your own). Ministries include Praise & Worship and Usher, and Other lets a student type a ministry that is not listed.
- Registering for a class sends a request to the Academy Director under Requests. The class opens right away. The director can confirm it, or decline it to close the class again.


## UI/UX update (v33)
- Phones and small tablets get a bottom tab bar (Campus, Catalog, Readiness, Transcript, Profile); the top menu and the Back to Campus button hide at that size.
- A gold reading-progress bar runs across the top of lesson pages.
- Skip and unlock requests on a course page are tucked into a "Need to skip or unlock this course?" panel.
- Fixed a horizontal scroll caused by the campus hero background.
- Toasts size to their message, sit clear of the bottom bar, and close when tapped.
- Director stats show two per row on phones; the portal tabs fade at the edge to show they scroll.


## Manuals in the BFM template and volunteer packets (v34)
- All ministry manuals now follow the BFM template: cover letter, table of contents, welcome statement, then Section 1 BFM Organizational Foundation, 2 Ministry Foundation (slogan, mission and vision, goals and core values, healthy qualities, Scriptures), 3 Standards & Expectations / Character Qualities, 4 Culture, 5 Servanthood | Life Led By Christ | Balance of Ministry & Life, 6 Safety & Care, 7 Safeguarding & Compliance.
- 16 manuals (BFM Safety is the sixteenth and is open to everyone): Children's, Youth & Young Adults, Men's, Women's, Usher & Hospitality, Nursery, Communications (includes media), Dance, Pastoral Aid/Care, Administrative, Couples, Deacon, Christian Education, Outreach. Communications opens with the Media course, Pastoral Aid/Care opens with Track 3, and Administrative opens with Track A.
- **Volunteer training packets** follow one template: Welcome Statement, Table of Contents, Section 1 Foundational Section (church vision statement, core values), Section 2 Roles & Responsibilities (organizational chart for the Director, Assistant Director and Volunteer roles, and what each role means), and Additional Materials (FAQs and a volunteer agreement). There are two general packets (Volunteer Orientation Packet, Volunteer Safety & Safeguarding Packet) for anyone who has not found a ministry, shown on the Track 1 page, plus one packet per ministry, shown on each ministry's page and under Individual ministries in Study guides and resources. They are printed documents, not courses. Edit the wording in `generalDoc` and `packetDoc` in `js/app.js`.
- Content lives in `js/courses.js`: `MN(...)` fields per manual, `MTPL` (slogan, culture heading, expectation groups, safe-environment audience) and `BFM_FOUND` (church statement, vision, mission, core values). Much of the wording is placeholder text for your pastor and ministry leaders to replace.

## Manual layout (v36)

Every manual and packet PDF now has: page 1 cover (logo, Bushwick Family Ministries, Church of God of Prophecy, ministry name), page 2 table of contents with subsections and page numbers, page 3 welcome statement, then seven sections, each on its own page with a big bold section name and titled subsections (no numbers). Smaller groups inside a subsection are bold headings. The contents page lists each section with its page number and its subsections. The same structure shows on screen and in Print. Edit the wording in `js/courses.js`.

## Manual layout (v38)

The contents page shows section and subsection numbers. Section 1 is named BFM Foundation. After the welcome statement the sections flow one after another instead of one per page. The cover prints the ministry name as large as fits the page.

## Manual and packet layout (v40)
- Covers: gold label, rule, large title, italic tagline, BFM ACADEMY and copyright near the bottom, under the black logo band.
- Table of contents: numbered sections and subsections with page numbers and dot leaders (two columns on manuals).
- Page fit: a paragraph, list item, or subsection is never split across pages. If a full subsection will not fit, it starts on the next page.
- Indented items are bullet points.
- Vision, scripture (Matthew 28:18-20), and mission updated everywhere.
- Arrival times: Sunday school teachers 9:30 AM; deacon, admin, pastoral aid, media, communications, and usher volunteers 45 min to 1 hr before the 10:30 service.
- New Volunteer Information Form at the end of every packet (Track 1 checklist, personal information, important note).

## UI/UX polish (v41)
- Back button now goes up one level (lesson to course, course to track, and so on) and names where it goes.
- Course outline is open by default on the course page.
- Assessments show "n of N answered" in a sticky bar next to Submit.
- Home: Leadership tracks (1 to 3) and Optional programs (Track A, Teacher Certification) are separate rows.
- Readiness card says "Your readiness summary" for students.
- Director: staff tabs wrap on desktop, the Admin nav item stays highlighted on staff pages, and the footer shows director links.
- Fixed: on-screen manuals and packets showed paragraph text as small gold capitals (class name clash).
- Fixed: manuals and study guides were unreadable in dark mode.
- Mobile: tidier progress ring, resource list, and transcript stats.

## v42 – Manual restructure
- Removed "How this manual fits the whole church" and "How to use this manual"; removed disagreements, social media, common challenges, important contacts and notes from all manuals.
- Emergency procedures and incident reports kept only in the nursery, children's and youth manuals; Welcoming guests only in Usher & Hospitality.
- "<Ministry> Foundation" now carries full-text KJV scriptures with a "How it connects" note for mission, vision, goals/values, and (in Culture) healthy qualities; one scripture per character quality.
- Servanthood rewritten with spiritual and practical application; compliance and quarterly reporting guidelines updated; 10-12 FAQs per ministry at the end.
- New files: scr_data.js, scr_faq1/2.js, scr_lead.js, bible.js (merged into js/courses.js).

## v43 and v44
- Background checks are renewed whenever leadership asks.
- Lessons now show the full text of each Bible passage (King James Version, public domain) in "Read ..." panels under What Scripture says.
- Punctuation pass: serial commas made consistent; "&" used consistently in Track 1 course titles.

## v45
- 6-month renewal now spells out first aid, safety, fire hazards, and safety training.
- New "How BFM Academy works" strip for new students; optional programs collapse on Campus.
- Locked tracks show one clear lock message with a "Go to Track N" button and a collapsed course preview.
- Track 3 ministry cards no longer repeat the ministry name; "Your steps" checklist at the top of each lesson.

## v46 – Guided tours
- New student tour (12 steps) and director tour (13 steps): a spotlight walks through the real pages, with Back, Next, a progress bar, and a Skip tour button on every step. Arrow keys move between steps and Esc skips.
- New students (and directors on their first staff visit) see a small prompt, once. Students who have already started a course are not prompted.
- The tour stays out of the way after that. Replay it from the footer (Guided tour, or Student tour / Director tour for staff), the Profile page, or the FAQs.
- Code: js/app.js (app_l.js section). Styles: .tour* in css/styles.css.

## v47
- Removed the "How BFM Academy works" strip from Campus.
- Guided tour rebuilt to visit every section: 21 steps for students (Campus, Catalog, a track, a course, Readiness, Transcript, Certificates, Study guides, Bookmarks, Events, Profile, FAQs, help button) and 16 for directors (every staff tab, Staff FAQs, and the student preview).
- Smoother tour: it waits for each page to draw, follows the target while the page scrolls, keeps the card clear of the highlighted area, and keeps keyboard focus inside the card.

## v48
- Course page: the main button is now "Next lesson" and goes straight to the first unfinished lesson (it becomes "Take the assessment" or "Go to the project" when the lessons are done). The next lesson is marked "Next" in the outline.

## v49
- Fixed: the director grading report always showed "Courses completed: 0". It now counts completions correctly.
- Found during the 50-student dry run (see the separate demo package).

## v50
- Leadership tracks (Track 1, 2, 3) now open only after the four BFM classes (New Believers, New Members, Water Baptism, Discipleship). Anyone with a position (deacon, assistant ministry director, ministry director, minister, clergy, pastor, administrative, or a typed role) sees “Would you like to skip this class?” with Yes and No on each class page. Yes shows “Awaiting approval from the Academy” until the director approves; regular members do not see this prompt. Church members and ministry members finish them, or ask to skip New Believers or Water Baptism on those class pages. A student who already has Track 1-3 progress is not locked out.
- Announcements: inline banner or floating pop-up, X to close, arrows (1 of 3), start and end date and time, icon, colors, archive and restore. Students see Past announcements on the news page.
- New events pop-up: when the director adds an event, students get a pop-up that points to the events calendar in the footer.

## v52
- Floating announcements open as a centered pop-up over a dark, blurred background.
- Footer events column no longer overlaps.
- Excel exports (.xlsx) with the BFM logo and a styled table for the student roster and grading reports; CSV is still there. Excel needs internet once (loads a small library).
- Director messages: more space above Send reply, a Delete button on each message, and Clear answered.

## v53
- Ministry manual, Safeguarding & Compliance, Reporting: added Monthly Reports (last Sunday, no later than the 5th of the next month) and Quarterly Reports (end of the quarter, or by the 5th of the next month).

## v54
- Phone layout pass: checked every student and staff screen at 320, 360, 375 and 768 pixels wide. Card grids no longer push past the screen on small phones, and the tour prompt hides while an announcement pop-up is open.

## v55: student accounts (website package only)
- Students now sign up and log in with an email and a password. Passwords are handled by Firebase and never stored in these files.
- Each account has its own saved copy of progress (loaded automatically on any device) and its own record the director sees, now with the student's email.
- Students can reset a forgotten password by email.
- Turn it on by filling in js/config.js (unchanged steps) and re-publishing the rules in firebase-rules.json (new `state` section). Set `studentAccounts:false` to keep the old device-only identities.
- The page published inside Claude is not changed: it keeps signing students in through their Claude account.

## v57: smoother sign-in
- The sign-in screen has a Student / Director switch. Director opens the staff portal sign-in. The Staff link is gone from the footer when student accounts are on.
- A student's first sign-in starts the guided tour automatically; when it ends or is skipped, they must finish their profile (name, role, and a ministry unless they are a church member) before anything else opens. Returning students go straight in.
- Sign-in remembers the last email, has a show-password button, focuses the right field, and shows a short welcome screen while loading.

## v58: new sign-in pages
- Student sign in, create account, reset password, director sign in and the loading screen share one full-screen design: a dark gold brand panel (animated light rays, verse, ministry ribbon) and a form card.
- New fields with icons and floating labels, a password strength meter, a green check when passwords match, a Caps Lock warning, show/hide password, red highlights on the field that needs fixing, and a "Check your inbox" screen after a reset.
- The header, footer, chat helper and pop-ups are hidden on sign-in pages. On phones the brand panel becomes a banner above the form.

## v60: Continue with Google
- Optional Google button on the student sign-in and create-account pages. Turn it on with `googleClientId` in js/config.js; steps are in SETUP-SHARED-RECORDS.md (Optional: Continue with Google). Needs a real web address or Live Server, not a double-clicked file.

## v61: contact details and policies
- Footer: contact details under the logo (email, call, text, address) and a bottom bar with copyright plus Privacy Policy, Terms of Use and Copyright Policy pages. The sign-in pages link to the same three policies.
- Contact details and policy text live in js/app.js (search for BFM_CONTACT and privacyPolicy). Have church leadership review the policy wording before going live.

## Latest update: course restructure and packet sections
- Track 1 is LDR 101–116, Track 2 is MIN 200–217, Administrative is ADM 401–417. Courses no longer have separate quizzes in Tracks 1 and 2; each track ends with a 30-question final exam (70% to pass) and courses use case studies instead of projects.
- Pastoral Care & Prayer Ministry moved to Track 3 and opens when the Academy unlocks it.
- Volunteer ministry packets now include 1.3 (ministry vision, mission, and core values) and 2.3 (roles and responsibilities chart). Orientation packets are unchanged.
- Communications manual and packet include the Communications Department mission text.
- The Administrative track now has 19 courses (ADM 401–419; see the Staff and Volunteers note below). It had 18 courses (ADM 401–418): no per-course quizzes or projects, case studies instead, then the capstone project (ADM 417) and a 30-question final exam (ADM 418). Governance, Bylaws, Policies, and Compliance (ADM 410) combines the earlier Governance and Bylaws courses.
- A Ministers Ministry manual and volunteer packet were added; the manual opens after Track 2.

## Teaching manuals, membership test, and tools (latest)
- **Teaching manuals:** one manual for each of Track 1, Track 2, and Administrative, with every course in it as a chapter, after a first part on setup, session flow, safety, grading, and the final exam. Each course chapter has a plan for every session, a case study with a grading rubric, and answer keys. They are for teachers and staff and are found in Study guides and resources, under Teaching manuals, and on each course page. They are built from the course content, so they update when you edit a course.
- **Attendance sheet and grade record** (PDF) for any course, from Study guides and resources, under Teaching manuals.
- **Membership test:** the New Members Class now ends with a 15-question test (NMC 190, 11 correct to pass), like the Water Baptism Class.
- **Staff > System:** connection status, what is in the Academy, and **Download all student records**.
- **Back up my progress** in student Settings, with **Restore** from a file.
- Teaching manuals are also in the staff Manuals and packets list. There is no footer link.
- Staff > System also shows students started and finished by track, and what needs attention.
- New guide: `DEPLOY-AND-MAINTENANCE.md` (for the developer).

## Case studies are self-practice (latest)
- Every course now ends with a **case study** (no projects). Case studies are for the student's own practice: not graded, no mentor sign-off, nothing in Review and grade. Students check each question and write a response to finish.
- Lessons and quizzes still work as before; final exams are still scored.
- Case studies live in `js/courses.js` (the `d21` block) and the engine is in `js/app.js`.
- **Youth & Young Adults** manual and packet now have sections for Youth (13-17), Young Adults (18-35), and how one ministry serves both.
- Every volunteer packet has a longer Core Values section with a scripture for each value.

## Study guides portal, accessibility, licenses
- **Study guides** (Profile > Settings > Study guides, or the footer) is now a portal: search, filter by type, "Open to me only", courses in progress at the top. Each document has PDF, Print, **Word** (an editable .doc), and View. Code: `js/app.js` (`guidesPortal`, `guideAct`).
- **Accessibility:** skip-to-content link, focus moves to the page when you change pages, the page title follows the heading, progress bars are labeled, heading levels are fixed, and contrast failures were fixed. Audited with axe-core (WCAG 2 A/AA) on 14 pages in light and dark with 0 violations. Still test with a real screen reader.
- **Copyright Policy** now covers the logo and seal (property of Bushwick Family Ministries, Church of God of Prophecy) and font and library licenses (Inter, Montserrat, Lexend: SIL OFL 1.1; jsPDF, ExcelJS, qrcode-generator: MIT).
- Champagne and ivory palette, smoother hover and focus styling.

## Who can open which document (latest)
- **Course study guides** open once the student enrolls in that course (opening a lesson or pressing Enroll). Before that the portal says "Enroll in this course first to access the guide."
- **Ministry manuals** and **ministry volunteer packets** are locked until an administrator approves a request (Request access, then Staff > Requests). Approval is stored as `access["u:m-<key>"]`.
- Only the **two general volunteer packets** (Orientation, Safety and Safeguarding) are open to everyone. Teaching manuals stay for teachers and staff. Admins and instructor preview see everything.

## Communications, leadership sections and new lessons (latest)
- **Communications is one ministry.** The Media manual was merged into the Communications manual (sound, video, live stream, slides, graphics, website, social media). Track 3 course MIN 360 is now "Communications Ministry Leadership" (course id `dpt-media` is unchanged so saved progress still works; its key is `communications`). There are now **15 ministry manuals and 17 packets** (15 ministry packets plus the 2 general ones).
- **Social media section** in the Communications manual (Culture): purpose, posting guidelines, photos and privacy, comments and conflict, accounts and security. It is built in `app_i.js` (`k==='communications'`) and is the one exception to the earlier removal of social media sections.
- **Two new manual sections** in every ministry manual (not packets): **6 Leadership Training** (leadership as a gift, the five non-negotiables, how training works, evaluation) and **9 Removal and/or Reinstatement** (restoration framework, Matthew 18 steps, reinstatement). Sections are now 1 to 11 (Safety & Care 7, Safeguarding & Compliance 8, FAQ 10, Review and Approval 11). **BFM Safety** (facilities and building, and the well-being of people in programs and events) opens the Safety & Care section. The removal section is a template: the pastor and district should review it.
- **New lessons** (file `d22.js`, added at the end of each course so saved progress does not shift): MIN 201 (3), ADM 416 (2), ADM 403 (2), LDR 101 (1, the five non-negotiables), MIN 212 (1). Exam question banks were not changed.
- **Maintaining:** to add a lesson to an existing course, add it in `d22.js` with `add('<course id>',[L(...)])`. Bible references used by lessons must exist in the Bible file (`BIBLE`), or the verse text will be blank.

## Telling someone about BFM Academy (need to know)
Share in layers. One line: BFM Academy is the leadership training site of Bushwick Family Ministries (Church of God of Prophecy), with Bible-based classes, study guides and certificates.
- **Anyone curious:** the one line and the link.
- **A new student:** create an account, take the four BFM classes first, then Track 1. Course study guides open after enrolling. Final tests need 70% and can be retaken.
- **A ministry volunteer:** the two general packets are open. Their ministry's manual and packet open when the director approves Request access.
- **A pastor or leader:** the above, plus the track structure (86 courses), that case studies are self-practice, and that the manuals are drafts for pastoral review.
- **The director, staff or teachers:** Review & grade, Requests, Messages, Reports, the System tab and backups, and the teaching manuals.
- **Whoever maintains the site:** this README and DEPLOY-AND-MAINTENANCE.md.
- Never pass along the director access code, other students' records, the answer keys to non-teachers, or the Firebase keys.

## Administrative track: Staff and Volunteers and new lessons (latest)
- **New course ADM 407, Staff and Volunteers** (`d18d.js`, course id `adm-staffvol`), between Giving Systems (ADM 406) and Payroll. Five lessons: people, not resources; the volunteer process steps 1 and 2 (define roles, screen); steps 3 and 4 (job description, training); recruiting; hiring staff (full-time, part-time, stipend). It has a 5-question bank for the final exam and a case study.
- **Renumbered:** the courses after it moved up by one. Payroll is ADM 408, Budgeting 409, Bookkeeping 410, **Governance, Bylaws, Policies, and Compliance 411**, Technology and Records 412, Human Resources 413, Facilities 414, Office Administration 415, Risk and Insurance 416, Events 417, Capstone 418, **Final exam 419**. Codes are set in the `AD` list in `d19.js`. Course ids did not change, so saved progress still works.
- **ADM 411 (Governance)** has three new lessons on the defining documents every church needs: the five documents at a glance, the constitution, bylaws and incorporation in depth, and policies, procedures and job descriptions with samples.
- **ADM 405 (Stewardship & Church Finance)** has three new lessons: physical resources (curriculum, supplies, properties, equipment and furnishings), finances part 1 (view money rightly, build the budget, worked example), and finances part 2 (controls, internal audit, records, tool not goal).
- New lessons live in `d22.js` (appended to the end of each course) except the new course, which is in `d18d.js`. The lessons give general guidance. They are not legal or tax advice, and the examples are illustrations, not requirements.



## Named directors and the activity log

Each director signs in with their own personal access code. Under **Staff portal > System** a director can:

- **Name each code** (Director 1, Director 2, and so on) with a full name and title. After that, the portal says "Signed in as <name>", grades show who gave them, and every action is recorded.
- **See the Activity log**: sign-ins and sign-outs, grades, unlocks, approvals and declines, replies, announcements and events, and profile edits or deletions.
- **Turn a director off** (and back on). A turned-off director is refused at sign-in and is signed out when their session next checks in. At least one director always stays active, and you cannot turn off the account you are using.

With shared records connected (Claude shared records or Firebase), the roster and log are shared by all directors. Without them, they live in that browser only. If you use Firebase, publish the updated `firebase-rules.json` so the `staff` and `audit` areas are director-only.

Honest limit: the codes are checked inside the app, so turning a director off is enforced by the app, not by the server. To fully end a code that may be in the wrong hands, also create replacement codes with `node tools/make-passcodes.js` and publish the update.


## BFM Safety is its own manual

BFM Safety is a standalone manual, not a section. It covers the safety of the facilities and building and the well-being of every person who takes part in programs and events, with the same sections as the other manuals. It is open to every signed-in student and leader (no permission request) under Resources > Ministry manuals. Each ministry manual keeps its own Safety & Care section, written for that ministry.

## Child, nursery and youth safety procedures

The BFM Safety manual and the Nursery, Children's and Youth & Young Adults manuals now carry detailed safety procedures in Section 7 (Safety & Care): who may serve, the two-adult and open-door rules, check-in and pickup, suggested adult-to-child ratios, restrooms and diapering, health and allergies, behavior and discipline, photos and online contact, trips and overnights, emergencies, and what to do if abuse is suspected. The nursery adds safe sleep and room safety, children's adds before-class, class and dismissal steps, and youth adds leader boundaries, mentoring, texting and social media, overnight events and young adult standards. These are working templates: the pastor confirms every number and rule with the district, the insurance provider and New York law.


## Round 1 changes: exams only, merged courses, registry

- **No quizzes anywhere.** Lessons end with reflection questions (at least two full sentences each), then case studies or projects, then one final exam per class or track. Classes (NBC 190, NMC 190, BAP 190, DSC 190) and the Teacher Certification (TCH 202) need 80%. Track 1 (LDR 116), Track 2 (MIN 214) and Administrative (ADM 418) need 75% of 30 questions. Each Track 3 ministry course has its own exam at 80%.
- **Harder exams.** Every attempt draws a fresh set of questions from a larger pool, balanced across the courses. The exam never shows the correct answers. A failed attempt lists the courses to review. No question is used in more than one exam (Track 3 pools are still the original generic questions and are rewritten in a later round).
- **Merged courses.** Staff and Volunteers joined Human Resources (ADM 407). Emerging Leaders is now two parts (MIN 208, 209). Mentoring is two courses (MIN 210 Mentoring Emerging Leaders, MIN 211 Mentor and Mentee). Track 2 is MIN 200 to 214. Administrative is ADM 401 to 418.
- **Course IDs match codes** (for example `ldr-103` is LDR 103). Saved progress from older versions is migrated automatically the first time it loads (`idv` marks migrated progress).
- **Pastoral care.** Pastoral Care & Prayer Ministry (MIN 430) has five lessons including suicide and self-harm, abuse and reporting, referral, confidentiality, and caring for the caregiver. Shepherding Hearts (MIN 207) has a crisis lesson (who to call: 911, 988, and the New York State Child Abuse Hotline). Confirm every phone number with your pastor.
- **Certificate registry.** Each certificate ID is stored in the shared database (`cert/<ID>`). The director confirms certificates (`certok/<ID>`) from Records > Certificates, and anyone verifying an ID sees Confirmed, Waiting for confirmation, Withdrawn, or Not found. The database rules now include `cert` and `certok` (see `firebase-rules.json`).
- **Certificate names:** New Believers Class, New Members Class, Water Baptism Class, Discipleship Class, Foundations of Servanthood, Ministry Leadership, Ministry Specialization, Church Administration, and Certified Teacher.
- **Lessons.** Lessons can carry a longer teaching text (`body`, about 500 words). The Pastoral Care, crisis, and Human Resources lessons have it now. The other lessons get theirs in later rounds.
