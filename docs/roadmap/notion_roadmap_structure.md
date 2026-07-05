# PetAppro Notion Roadmap Structure

## Recommended Notion Pages

Create a top-level page:

```text
PetAppro Product Hub
```

Inside it:

- Roadmap
- Feature Specs
- User Flows
- Design System
- Decision Log
- Technical Architecture
- Launch Checklist
- Claude Code Prompts
- Research and References

## Roadmap Database

Suggested properties:

| Property | Type |
|---|---|
| Name | Title |
| Phase | Select |
| Status | Select |
| Priority | Select |
| Owner | Person/Text |
| User Role | Multi-select |
| Area | Select |
| Target Release | Select/Date |
| GitHub Issue | URL |
| Spec Link | Relation/URL |
| Risk | Select |

Phase options:

- 0 Product Definition
- 1 Tenant Foundation
- 2 Core Booking
- 3 Staff Operations
- 4 Notifications and Activity
- 5 Payments
- 6 Polish and Launch
- 7 Add-ons

Status options:

- Idea
- Spec Needed
- Ready for Build
- In Progress
- Review
- Done
- Deferred

Area options:

- Platform
- Admin
- Client
- Staff
- Booking
- Payments
- Notifications
- Design System
- Legal
- Infrastructure

## Decision Log Database

Suggested properties:

| Property | Type |
|---|---|
| Decision | Title |
| Date | Date |
| Status | Select |
| Area | Select |
| Context | Text |
| Decision | Text |
| Rationale | Text |
| Revisit Date | Date |

Status options:

- Proposed
- Decided
- Revisit Later
- Reversed

## Feature Spec Template

```text
# Feature Name

## Goal

## Users / Roles

## User Story

## Requirements

## Flow

## Data / Tenant Scope

## Permissions

## UI States

## Notifications

## Payments / Legal Impact

## Acceptance Criteria

## Claude Code Build Prompt
```

