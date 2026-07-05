# PetAppro Planning Documentation

Master index for product and platform planning. These documents define **what** PetAppro is and **how** it should behave before implementation in `app/`.

**Workspace home:** `/Users/dannybaker/Documents/Base509/Products/petappro` (PetAppro product repo, under Base509 LLC)

**Status:** Phase 0 — Product Definition (in progress). Planning only; no application code, SQL, or migrations in this layer.

---

## How to Use This Index

| Audience | Start here |
|---|---|
| New contributors | `product_brief.md` → `mvp_roadmap.md` |
| Cursor / Claude Code sessions | `docs/prompts/cursor_project_instructions.md` |
| Permission or access questions | `user_roles_and_permissions.md` |
| Booking behavior | `booking_workflows.md` |
| Alerts, email, SMS, messaging | `notification_and_communication_system.md` |
| SaaS plans and add-ons | `subscription_tiers.md` |
| Unresolved decisions | `docs/decisions/open_decisions.md` |

Implementation specs live under `docs/specs/`. Feature specs must trace back to planning documents listed here.

---

## Foundation

| Document | Purpose | Phase |
|---|---|---|
| [product_brief.md](./product_brief.md) | Product summary, MVP scope, success criteria, positioning | 0 |
| [../decisions/open_decisions.md](../decisions/open_decisions.md) | Decision log with working defaults | 0 → 5 |
| [../roadmap/mvp_roadmap.md](../roadmap/mvp_roadmap.md) | Phased roadmap and exit criteria | 0 → 6 |

---

## Platform Planning

Core platform behavior documents. Each owns one topic; cross-link rather than duplicate.

| Document | Purpose | Phase |
|---|---|---|
| [user_roles_and_permissions.md](./user_roles_and_permissions.md) | MVP roles, invite codes, permission matrix, tenant access rules | 0 → 1 |
| [booking_workflows.md](./booking_workflows.md) | Client and staff booking flows, eligibility gates, server authority | 0 → 2 |
| [notification_and_communication_system.md](./notification_and_communication_system.md) | Channels, event catalog, communication vs notifications, delivery model | 0 → 4 |
| [subscription_tiers.md](./subscription_tiers.md) | SaaS plans, add-ons, feature gating by tier | 0 → 5 |

---

## Strategy and Reference

| Document | Purpose |
|---|---|
| [woof-wetreats-to-petappro-rebuild-plan.md](./woof-wetreats-to-petappro-rebuild-plan.md) | Rebuild strategy, data model direction, MVP scope anchor |
| [woof-wetreats-reference-review.md](./woof-wetreats-reference-review.md) | Read-only reference app behavior and gaps |
| [PetAppro-Tooling-and-Automation.md](./PetAppro-Tooling-and-Automation.md) | **Canonical:** tool roles, build workflow, decision gates, automation (absorbed the two docs below) |
| [PetAppro-Strategy-and-Business-Plan.md](./PetAppro-Strategy-and-Business-Plan.md) | Business strategy, framework choice, GTM, launch, costs |
| [Base509-LLC-Formation-Guide-CA.md](./Base509-LLC-Formation-Guide-CA.md) | CA LLC self-filing walkthrough (Base509 LLC) |
| _archived:_ `../_archive/ai_build_operating_model.md`, `../_archive/ai_tools_skills_and_plugins_plan.md` | Superseded → merged into the tooling doc |

---

## Specs and Implementation (Downstream)

| Document | Purpose |
|---|---|
| [../specs/platform_notification_and_activity_plan.md](../specs/platform_notification_and_activity_plan.md) | Activity history UI spec; legacy combined notes |
| `../specs/` (future) | Feature specs derived from planning docs in Phase 4 |

---

## Document Relationships

```text
product_brief.md
    ├── user_roles_and_permissions.md
    ├── booking_workflows.md
    │       └── notification_and_communication_system.md  (events on booking actions)
    ├── notification_and_communication_system.md
    │       └── subscription_tiers.md  (which channels are base vs add-on)
    └── subscription_tiers.md
            └── open_decisions.md  (D-007, D-008, D-020)
```

---

## Phase 0 Platform Planning Checklist

- [x] Product brief
- [x] User roles and permissions
- [x] Notification and communication system
- [ ] Booking workflows — draft complete; refine in Phase 2
- [ ] Subscription tiers — working defaults; finalize before GTM (D-020)
- [ ] Open decisions reviewed and promoted to **Decided** where required

When Phase 0 exit criteria in `mvp_roadmap.md` are met, proceed to Phase 1 architecture documents (`technical_architecture.md`, `data_model_draft.md` — not yet created).
