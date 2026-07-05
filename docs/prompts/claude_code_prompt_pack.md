# PetAppro Claude Code Prompt Pack

> **This is a prompt library, not the rules.** The canonical, auto-read project rules live in `/CLAUDE.md` (and `/AGENTS.md` for Codex) at the repo root. Use these templates to write task/review/deploy prompts; they should echo — never contradict — the root rule files. Keep them in sync.

## Global Instruction To Use At The Start Of Claude Code Sessions

```text
You are working on PetAppro, a multi-tenant SaaS platform for pet care businesses.

Treat Woof Wetreats as a single-business reference app, not as architecture to copy blindly.

Important product rules:
- PetAppro is software for independent pet care businesses, not a marketplace, employer, agency, or broker.
- Every business-specific record must be tenant-scoped with business_id or an equivalent tenant boundary.
- Staff/admin permissions must come from business memberships, not global emails.
- Server-side booking and pricing are authoritative.
- Email is for paper trail; urgent alerts should use in-app, push, or SMS depending on feature scope.
- Stripe Connect should allow each business to collect its own payments directly.
- Do not deploy to Netlify unless I explicitly approve deployment.
- Prefer local tests/builds first.

Before coding, inspect the existing repo patterns and summarize:
1. Files likely affected
2. Data model/RLS impact
3. UI states needed
4. Verification plan

Then implement only the requested scope.
```

## Feature Implementation Prompt Template

```text
Feature: [feature name]

Goal:
[plain-English outcome]

User roles:
[owner/admin/staff/client]

Tenant scope:
This must be scoped to business_id. No cross-business data leakage.

Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]

UI states:
- Loading
- Empty
- Error
- Success
- Permission denied, if relevant

Data/model impact:
- [tables/functions affected]
- [RLS considerations]
- [storage considerations, if any]

Verification:
- Run local typecheck/build/tests if available.
- Manually test [specific flow].
- Do not deploy unless I approve.

Please inspect the repo first, propose the implementation approach briefly, then make the changes.
```

## Supabase/RLS Review Prompt

```text
Please review the Supabase schema/migrations/RLS policies for tenant isolation.

Check:
1. Every business-specific table has business_id or a reliable tenant boundary.
2. Clients can only access their own data inside their business.
3. Staff can only access businesses where they have a membership.
4. Owner/admin actions require the correct role.
5. Storage paths are tenant-prefixed or otherwise protected.
6. RPCs and Edge Functions enforce business scope server-side.
7. No global ADMIN_EMAIL or single-business assumptions remain.

Do not change code yet. Create a findings document with severity, file references, and recommended fixes.
```

## Pre-Deploy Review Prompt

```text
Please perform a pre-deploy review.

Check:
1. What changed since the last commit.
2. Whether local build/typecheck/tests pass.
3. Whether Supabase migrations are included and ordered.
4. Whether any environment variables are needed.
5. Whether Netlify deploy is necessary now.
6. Any user-facing risks or rollback concerns.

Do not deploy. Report findings and wait for approval.
```

