# PetAppro — Planning-Doc Sequencing (what actually gates Oct 1)

**Owner:** Claude Cowork (Product Manager) · **Audience:** Danny (PO), George/ChatGPT (Project Manager), Codex (Technical Governor)
**Created:** 2026-07-06 · **Source of truth this reconciles:** `TASKS.md`, `docs/decisions/open_decisions.md`, `docs/roadmap/mvp_roadmap.md`

## Purpose
A planning doc gets written **when something downstream cannot start without it** — not because a capability exists on a wishlist. This note ranks the planning backlog by dependency and need, so we don't spec features ahead of the decisions or partners they depend on. It reconciles the July 6 PM standup, which listed 9 "missing planning docs" as if they were peers.

## The test for "write this doc now"
1. Does an **upcoming sprint** (next 2–4 weeks) need it to start? →  *Now.*
2. Is it gated on an **unresolved decision or input** (design partner, pricing, a Decided flag)? →  *Deferred until that resolves.*
3. Is it explicitly **Deferred-beyond-MVP** in the roadmap? →  *Backlog; document as deferred only.*

## What actually gates Oct 1 (in order)
1. **Store clock (the binding external constraint).** LLC → EIN → D-U-N-S → Apple/Google Org accounts. LLC is in REVIEW (approval ~Jul 8–10). This is a *sequence-readiness* item, not a doc. Nothing above it flexes.
2. **Sprint 1 crown jewel (the binding code path).** Monorepo + single tested `packages/pricing`. This is the Jul 18 pivot checkpoint. Owner: Claude Code. Sequence first.
3. **Phase 1 architecture + data-model draft.** Gates the tenant schema (Sprint 2) and RBAC/RLS (Sprint 3) — the never-cut foundation and the Aug 15 GO/NO-GO. **This is the real "next planning doc," and it was not on the standup list phrased that way.**

## Planning-doc backlog, ranked by dependency

### Now — write next (gates Sprint 2–3, the never-cut foundation)
| Doc | Gates | Dependency / trigger |
|---|---|---|
| `technical_architecture.md` | Sprint 2 tenant schema | Phase 1 exit; D-001 (Decided), D-003/004/005/012 defaults |
| `data_model_draft.md` | Sprint 2–3 (schema + RLS) | Same; Aug 15 go/no-go depends on it |

### Next — write once Phase 1 is review-ready (feeds Aug build, has slack)
| Doc | Gates | Dependency / trigger |
|---|---|---|
| Mobile Architecture | Expo app scaffold (Sprint 3, Aug) | D-001 native/Expo (Decided). The one genuinely near-term item from the standup list. |
| UX flows (Phase 2) | MVP specs (Phase 4) | Phase 1 exit; reuse Woof patterns |

### Deferred — do NOT write yet (gated on an unresolved input)
| Doc | Why it waits |
|---|---|
| **Billing & Subscription Management** | Gated on **D-021 (design partner, Proposed)** and **D-020 (SaaS pricing, Proposed)**; needed **Phase 5**. The only early-binding call — web checkout via Stripe Billing, not iOS IAP — is **already Decided (D-001)**. Writing tiers/trials/dunning now = spec ahead of two unresolved inputs. |
| Tenant Administration | Largely covered by the Phase 1 architecture + roles doc; the rest is post-foundation. |

### Deferred-beyond-MVP — backlog only, document as deferred
Client Messaging (full in-app messaging), Reporting & Analytics (deep analytics), Feature Flags, Public API / Webhooks, full Audit Logs (price-override audit trail already covered by D-018), Backup & Disaster Recovery (operational, Phase 5+). All map to items the roadmap already lists under "Defer beyond MVP." Batching these now is the feature-creep risk the standup itself warns about.

## Bottom line
- **Billing/subscription: not now.** No dependency forces it; the compliance-critical piece is already decided.
- **Next doc to actually write: Phase 1 architecture + data model** — that's what unblocks the foundation and the Aug 15 gate.
- **Rule to hold the line:** every new capability gets a doc *before* implementation (George's point, agreed) — but the doc is written *when a downstream sprint needs it*, sequenced by dependency, not batched.
