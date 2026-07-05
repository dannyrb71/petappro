# @petappro/ui (build target — not yet scaffolded)

The shared component library the app imports. Each component here **implements an approved
spec** from `design-system/specs/` and consumes `@petappro/tokens` — never raw literals
(golden rule: shared components only, no one-off UI).

- **Contract:** `design-system/specs/<layer>/<component>.md` (Objective→Requirements→Acceptance).
- **Record:** every shipped component has `design-system/records/<component>.md`. No record → not in the library.
- **Owner:** Claude Code, after the Governor approves the spec.

Placeholder until the Expo monorepo/workspaces are initialized — marks where component code lives.
