# Base509 LLC — California LLC Self-Filing Guide (single-member, sole owner: Danny)

*Base509 LLC is the legal entity; PetAppro is a product/brand owned by it.*

A beginner, do-it-yourself walkthrough for forming **Base509 LLC** in California without a paid service, and getting it ready for the app-store path (D-U-N-S → Apple/Google org accounts). Work it top to bottom.

> **Entity structure:** the legal company is **Base509 LLC** (Danny's umbrella company). **PetAppro is a product/brand and intellectual property owned by Base509 LLC** — not its own entity. All formation, banking, D-U-N-S, Stripe, and Apple/Google developer accounts are under **Base509 LLC**; PetAppro (and any future "Appro" products) ride on top as products. This does **not** complicate app-store publishing — the app publishes as "PetAppro" while the developer/seller is Base509 LLC (see the App-Store Walkthrough).

> **Not legal or tax advice.** This is a practical guide. The forms are simple and you can absolutely self-file, but confirm anything tax-related (especially the $800 franchise tax and Form 568) with the CA Franchise Tax Board (FTB) or an accountant. When in doubt, the official source is the CA Secretary of State's **bizfile Online** portal and **ftb.ca.gov**.

---

## Why self-filing is fine here
A paid service (LegalZoom, etc.) just fills out the same state forms you can fill out yourself on **bizfile Online**. For a straightforward single-member LLC, self-filing saves ~$100–$300 in service fees. You pay only the state fees below. The one thing services add — a commercial registered agent — you don't need, because you can be your own agent (see Step 2).

## Cost summary (California, 2026)
| Item | Cost | When |
|---|---|---|
| Articles of Organization (Form LLC-1) | **$70** | Today, at filing |
| Statement of Information (Form LLC-12) | **$20** | Within 90 days of filing |
| $800 annual franchise tax (FTB) | **$800** | By the 15th day of the 4th month after formation |
| Operating Agreement | $0 | Internal doc, not filed (template below) |
| EIN (IRS) | $0 | After the LLC is approved |
| **Year-one total** | **~$890** | |

Note: an *additional* LLC fee kicks in only if CA-sourced gross receipts exceed $250k — not a concern at launch.

---

## Step 1 — Choose and check the name
- Decide the exact legal name: **Base509 LLC** (California requires "LLC," "L.L.C.," or "Limited Liability Company" in the name).
- **"PetAppro" is a product name, not the entity** — you do NOT need a separate LLC for it. Optional: if you later want to sign contracts, invoice, or bank publicly *as* "PetAppro," file a **DBA / Fictitious Business Name** ("Base509 LLC dba PetAppro") at your county — a cheap, separate filing. Not required to publish the app or form the LLC today.
- **Check availability** on bizfile Online (business search) so it's not already taken or too similar to an existing CA entity.
- **Write down the exact spelling/capitalization** — it must match *identically* on the LLC, your D-U-N-S registration, your Apple Developer org, and your Google Play org, or verification stalls later.
- Optional: you can reserve a name for 60 days ($10) if you're not filing immediately — not needed if you file today.

## Step 2 — Designate your Agent for Service of Process (registered agent)
- This is the person who receives legal mail for the LLC. **You can be your own agent.**
- Requirements: an individual with a **physical California street address** (no P.O. boxes). Your home address works.
- On the form you'll choose "an individual" and enter your name + CA street address.

## Step 3 — File the Articles of Organization (Form LLC-1) on bizfile — $70
Go to **bizfile.sos.ca.gov** → create an account → file "Articles of Organization – CA LLC (Form LLC-1)." Fill-in cheat sheet:

| Field | What to enter |
|---|---|
| **LLC name** | `Base509 LLC` (exact) |
| **Business addresses** | Principal office street address (CA) + mailing address if different |
| **Agent for Service of Process** | "Individual" → your name |
| **Agent address** | Your CA street address (no P.O. box) |
| **Management structure** | For a solo owner, choose **"One Manager"** *or* **"All LLC Member(s)"** — for a single-member LLC these are effectively the same; "All LLC Member(s)" is the simplest/typical pick |
| **Purpose statement** | California pre-fills the standard statement ("The purpose of the limited liability company is to engage in any lawful act or activity…") — you don't write your own |
| **Organizer** | You (the person filing) |

Submit and pay the **$70**. You'll get a stamped confirmation and your **LLC filing number** — save the PDF.

## Step 4 — Write your Operating Agreement (single-member) — internal, not filed
California law expects an LLC to have an operating agreement, but you **do not file it with the state** — you keep it in your records (banks and Stripe may ask to see it). A simple single-member version is enough. A ready template is at the end of this doc — fill in the brackets, sign, date, and save a PDF.

## Step 5 — File the Statement of Information (Form LLC-12) — $20, within 90 days
- On bizfile, file **Form LLC-12** within **90 days** of formation (then every 2 years after).
- It lists your LLC's address, the manager/member (you), and your agent. **$20.**
- Easy to forget — do it in the same week as formation so it's done.

## Step 6 — Get your EIN from the IRS — free, after approval
- Once the LLC shows as filed, go to **irs.gov** → "Apply for an Employer Identification Number (EIN) online." Free, ~15 minutes, issued instantly.
- For a single-member LLC with no employees, it's taxed as a "disregarded entity" by default (reported on your personal return) — the online tool walks you through it.
- You need the EIN for the **business bank account**, **D-U-N-S**, **Stripe**, and store accounts.

## Step 7 — Note the $800 franchise tax (FTB)
- Every CA LLC owes the **$800 annual franchise tax**. The old first-year exemption has expired, so an LLC formed in 2026 **owes it in year one**.
- Due by the **15th day of the 4th month** after formation (e.g., form in July → roughly Nov 15). Pay via **ftb.ca.gov** (Form FTB 3522).
- You'll also file **Form 568** annually for the LLC. Confirm specifics with an accountant.

## Step 8 — Beneficial Ownership (FinCEN BOI) — currently NOT required for you
- As of **July 2026**, FinCEN's rule exempts **domestic U.S. companies** (including your CA LLC) from filing a BOI report — only foreign entities must file.
- **This rule has changed repeatedly**, so before relying on it, do a 2-minute check at **fincen.gov/boi** for the current status at the time you form. If the exemption is ever reversed, filing is free and online.

## Step 9 — Open a business bank account
- Bring: stamped Articles of Organization, EIN confirmation, operating agreement, your ID.
- Keep business and personal money strictly separate (this is what preserves the LLC's liability protection).

## Step 10 — Then start the app-store chain
Once the LLC + EIN exist, immediately move to the long-lead store items (see the App-Store Walkthrough):
1. **Request D-U-N-S** (free, 1–2 weeks) using the exact LLC name/address.
2. **Apple Developer** org account ($99) with the D-U-N-S.
3. **Google Play** org account ($25) with the D-U-N-S.

---

## Self-filing checklist
- [ ] Name chosen + availability checked (`Base509 LLC`), exact spelling saved
- [ ] You listed as Agent for Service of Process (CA street address)
- [ ] Articles of Organization (LLC-1) filed on bizfile — $70 — confirmation PDF saved
- [ ] Operating Agreement completed, signed, saved (template below)
- [ ] Statement of Information (LLC-12) filed — $20 — within 90 days
- [ ] EIN obtained from IRS (free) — saved
- [ ] $800 franchise tax deadline noted on calendar (FTB 3522)
- [ ] FinCEN BOI status checked (currently exempt for domestic LLCs)
- [ ] Business bank account opened
- [ ] D-U-N-S requested → Apple + Google org accounts

---

## Appendix — Single-Member LLC Operating Agreement (template)

> Fill in every `[bracketed]` item, delete this line, then sign, date, and save a PDF. This is a plain single-member template for internal records; have a lawyer review if anything is unusual. Not filed with the state.

```
OPERATING AGREEMENT OF BASE509 LLC
A California Single-Member Limited Liability Company

This Operating Agreement ("Agreement") is entered into as of [DATE] by [FULL LEGAL NAME]
("Member"), the sole member of Base509 LLC (the "Company").

1. FORMATION. The Company was formed as a limited liability company under the California
Revised Uniform Limited Liability Company Act by filing Articles of Organization with the
California Secretary of State on [FILING DATE], filing number [LLC NUMBER].

2. NAME AND PRINCIPAL OFFICE. The Company's name is Base509 LLC. Its principal office is
[STREET ADDRESS, CITY, CA, ZIP].

3. REGISTERED AGENT. The Agent for Service of Process is [FULL LEGAL NAME], located at
[CA STREET ADDRESS].

4. PURPOSE. The Company may engage in any lawful business activity permitted under
California law, including developing, owning, and operating software products and related
services and intellectual property (including, without limitation, the "PetAppro" product
and brand and any other products of the Company).

5. TERM. The Company shall continue until dissolved as provided by law or by the Member.

6. MEMBER. The sole member is [FULL LEGAL NAME], who owns 100% of the membership interest.

7. MANAGEMENT. The Company is member-managed. The Member has full authority to manage the
Company, make all decisions, and bind the Company in contracts.

8. CAPITAL CONTRIBUTIONS. The Member has contributed [initial contribution, e.g., $[AMOUNT]]
to the Company. Additional contributions are at the Member's discretion.

9. PROFITS, LOSSES, AND DISTRIBUTIONS. All profits and losses are allocated to the Member.
Distributions are made at the Member's discretion.

10. TAX TREATMENT. The Company is a single-member LLC treated as a disregarded entity for
federal income tax purposes unless the Member elects otherwise.

11. LIABILITY AND INDEMNIFICATION. The Member is not personally liable for the Company's
debts or obligations except as required by law. The Company shall indemnify the Member to the
fullest extent permitted by law.

12. DISSOLUTION. Upon dissolution, the Company's assets shall be distributed first to
creditors, then to the Member.

13. AMENDMENTS. This Agreement may be amended in writing signed by the Member.

IN WITNESS WHEREOF, the Member has executed this Agreement as of the date first written above.

_______________________________
[FULL LEGAL NAME], Sole Member
Base509 LLC
Date: ____________________
```
