# Getting PetAppro Into the App Stores — A Complete Beginner's Walkthrough

You've never published an app before. That's fine. This guide assumes **zero prior knowledge** and walks you through, in order, exactly what to do and when, so PetAppro can be live by **October 1, 2026**.

Read the "Plain-English glossary" once, then just work the checklist top to bottom.

---

## Plain-English glossary (read once)

- **App Store** = Apple's store, for iPhone/iPad. Run by Apple.
- **Google Play** = the Android store, for Samsung/Pixel/most non-Apple phones. Run by Google.
- **Developer account** = a verified account with Apple (and separately with Google) that lets you publish apps. You need one with *each* company.
- **D-U-N-S number** = a free 9-digit ID for your *business*, issued by a company called Dun & Bradstreet. Apple and Google use it to confirm your business is real. Free, but takes 1–2 weeks to get.
- **Organization account** = you register with Apple/Google as your company (**Base509 LLC** — the legal entity that owns the PetAppro product), not as yourself personally. **Always choose this.** It looks more legit and avoids a Google testing hurdle (below).
- **Entity vs. app name:** the developer/seller account is **Base509 LLC**; the app still publishes under the name **PetAppro**. Publishing a product under a different name than the legal entity is normal and does not complicate approval. If you want the small "seller" line to read "PetAppro" instead of "Base509 LLC," register a DBA/fictitious business name for it — optional and cosmetic.
- **Personal / Individual account** = you register as yourself. **Avoid this** — Google makes personal accounts recruit 12–20 testers for 14 days before going public.
- **Submission** = handing your finished app to Apple/Google to publish.
- **Review** = Apple/Google inspect your app (takes a few days). They can approve or reject. First-timers often get rejected once, fix a small thing, and resubmit.
- **TestFlight** = Apple's tool for letting a handful of people try your app before it's public.
- **Closed testing track** = Google's version of the same thing.
- **Bundle ID / package name** = a unique name for your app behind the scenes, like `com.petappro.app`. You pick it once.

---

## The one rule that makes all of this make sense

**Everything happens in a chain, and each link unlocks the next:**

> Business (LLC) exists → get D-U-N-S number → open Apple + Google company accounts → (meanwhile, the app gets built and tested) → **submit by ~Sept 10** → survive review → **launch Oct 1**.

The identity steps (LLC → D-U-N-S → accounts) *must* happen in order — you can't skip ahead. But the app can be built **at the same time** your accounts are being verified. That's how you fit it all in.

---

## PHASE 1 — Make your business official (Target: first half of August)

You need a real business before Apple/Google will give you a company account.

- [ ] **Form an LLC.** This is the legal "container" for your business. Easiest path: use a service like LegalZoom, Northwest Registered Agent, or your state's website. Cost is roughly $50–$300 depending on your state. (You're in California — CA has an $800/year franchise tax, so ask an accountant about timing.)
- [ ] **Get an EIN.** This is a free federal tax ID for your business, like a Social Security number for the company. Apply directly and free at irs.gov (search "apply for EIN online"). Takes ~15 minutes.
- [ ] **Open a business bank account** using your LLC papers + EIN. You'll use this card to pay the Apple/Google fees.
- [ ] Write down your exact **legal business name, address, and phone number.** These must match *everywhere* (LLC, D-U-N-S, Apple, Google) or verification stalls.

> ⏱️ Why now: everything else depends on the LLC existing. Don't wait.

---

## PHASE 2 — Get your D-U-N-S number (Target: start it the day the LLC is filed)

This is the slowest step, so start it the moment your LLC exists.

- [ ] Go to Dun & Bradstreet's site and request a **D-U-N-S number** (search "get a D-U-N-S number"). It's **free** — do NOT pay for a "rush" service unless you're truly out of time.
- [ ] Enter your exact legal business name + address (must match Phase 1).
- [ ] **Wait.** Free processing can take **1–2 weeks**, occasionally longer. This is normal.
- [ ] When it arrives, save the 9-digit number somewhere safe. You'll paste it into both Apple and Google.

> ⏱️ If this is taking too long and August is slipping away, tell me — Apple has a way to look up/expedite a D-U-N-S during their enrollment, and we can adjust.

---

## PHASE 3 — Open your Apple developer account (Target: mid-August)

- [ ] Have ready: your **D-U-N-S number**, your LLC legal name/address, and a business credit/debit card.
- [ ] Go to developer.apple.com → "Enroll." Choose **"Company / Organization"** (NOT Individual).
- [ ] Apple charges **$99/year.**
- [ ] Apple will verify your business against the D-U-N-S info. This can take a few days and they may call to confirm you're authorized to sign for the business — answer the phone/email promptly.
- [ ] Once approved, you have access to **App Store Connect** — the dashboard where you'll manage the app, testers, and submission.

> ✅ You don't need the finished app to open this account. Open it early so it's ready when the app is.

---

## PHASE 4 — Open your Google Play developer account (Target: mid-to-late August)

- [ ] Go to play.google.com/console → sign up. Choose **"Organization"** (NOT Personal), and enter your **D-U-N-S number.**
- [ ] Google charges **$25, one time** (never again).
- [ ] Google verifies your business (a few days).
- [ ] Once approved, you have the **Google Play Console** — Android's version of the dashboard.

> 💡 Why "Organization" matters here specifically: a *personal* Google account created these days must line up **12–20 testers who use the app for 14 straight days** before you can launch publicly. An **Organization** account skips that requirement — which is exactly the timeline trap we're avoiding.

---

## PHASE 5 — Build + test the app (happens in parallel, all of August)

This is the dev work (Claude Code + Codex), running at the same time as Phases 1–4. You don't personally do the coding, but here's your part:

- [ ] **Try the app yourself** on your own phone as it comes together (your dev tools can send you test builds).
- [ ] By **late August**, invite a few real pet-care operators (your design partners) to try it via **TestFlight** (iPhone) and Google's **closed testing track** (Android). Even though your Organization account doesn't *require* 12–20 testers, having 5–10 real people try it catches embarrassing bugs before the public sees them.
- [ ] Collect their feedback → dev fixes it → repeat.

---

## PHASE 6 — Prepare the "store listing" (Target: first week of September)

Before you can submit, each store needs marketing materials + legal disclosures. Think of it as the app's storefront page.

- [ ] **App name + short description + longer description.**
- [ ] **Screenshots** of the app (specific sizes for different phones — your dev tools generate these).
- [ ] **App icon.**
- [ ] **Privacy Policy URL** and **Support URL** (a web page people can reach you at). We'll host these on your marketing site.
- [ ] **Apple "privacy nutrition labels"** and **Google "Data Safety form"** — simple questionnaires about what data the app collects. Answer honestly; your dev can tell you the answers.
- [ ] **Account-deletion feature** — Apple requires that users can delete their account *inside* the app. Make sure this is built.
- [ ] Confirm the **age rating** and content questions.

---

## PHASE 7 — Submit (HARD DEADLINE: ~September 10)

- [ ] In **App Store Connect** (Apple) and **Play Console** (Google), attach the finished app build to the listing and click **Submit for review.**
- [ ] **Why Sept 10 and not later:** a brand-new app usually takes **2–5 days** to review, it gets *slower* in September (holiday rush), and about **40% of first submissions get rejected** for something minor. Submitting on Sept 10 leaves room for one rejection → fix → resubmit and still be live by Oct 1.
- [ ] If you get a rejection notice, don't panic — it's usually a small, specific fix. Send it to me/your dev and we resubmit.

---

## PHASE 8 — Launch (Target: October 1)

- [ ] Once both stores show "Approved / Ready for Sale," you choose to release (you can set it to go live automatically on Oct 1).
- [ ] Do a final real-phone check: download the live app from each store, sign up, make a test booking.
- [ ] Announce it (marketing site, your pet-care network, design partners).
- [ ] 🎉 You're live.

---

## The dated calendar (stick this on the wall)

| When | What must happen |
|---|---|
| **Now – Aug 8** | Form LLC, get EIN, open business bank account |
| **Day LLC is filed** | Request D-U-N-S number (free; 1–2 wks) |
| **~Aug 15** | D-U-N-S in hand |
| **~Aug 15–18** | Open Apple developer account (Organization, $99) |
| **~Aug 18–22** | Open Google Play account (Organization, $25) |
| **All of August** | App is being built (dev tools) — you test builds on your phone |
| **Late August** | Beta to 5–10 design partners via TestFlight + closed track |
| **Sept 1–5** | Store listings, screenshots, privacy forms, account-deletion feature |
| **~Sept 10** | **SUBMIT to both stores** (leave room for one rejection cycle) |
| **Sept 10–26** | Clear review; fix + resubmit if rejected |
| **Oct 1** | **Public launch** |

---

## What I need from you to keep this on track

1. **Decide who forms the LLC** — just you, or you + Marco? (Affects the paperwork.)
2. **Start Phase 1 this month.** The LLC + D-U-N-S are the long poles; nothing else can start until they're done.
3. **Line up 5–10 design-partner testers** now, so they're ready when the beta opens in late August.

If you want, I can:
- Turn this into a shared checklist you (and Marco) can tick off together, and
- Schedule an **automatic weekly reminder** that tells you which phase you should be in and flags if you're falling behind the Oct 1 date. (That reminder needs a calendar/Notion connector authorized — currently they're not connected — but I can set it up the moment one is.)
