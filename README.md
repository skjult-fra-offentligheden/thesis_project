# CEON — Hi-fi prototype

Onboarding / role-assignment prototype for the thesis comprehension test.

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## What's in this scaffold

- **Type layer (locked).** `src/types/` contains the four files agreed:
  - `requirements.ts` — `Requirement = LegalRequirement | OrganisationalRequirement`. Tagged variant. The architectural core of Principle 1.
  - `grants.ts` — `Grant = FunctionGrant | DataGrant`. Each grant carries a `Requirement` as `provenance`.
  - `roles.ts` — RBAC capability tier only. No requirements field.
  - `users.ts` — User holds `roleId` and `grants[]`.
- **Seed data.** `src/data/` — six requirements (3 legal, 3 organisational), two roles (superuser, employee), four users including the participant identity (Sarah Chen, superuser at Acme Shipping A/S).
- **Screen 1: Dashboard.** Role-situating. Company name in header, identity badge, three summary cards, recent activity. **No provenance encoding.** First encoding appearance is reserved for the create-user screen.
- **Screen 2: Create user.** Placeholder. Next build target.

## Design notes for the design process chapter

Two scratch sentences to expand later:

1. RBAC was chosen for capability tiering because the access model is not the contribution; the visual encoding of requirement provenance is. RBAC minimises model overhead and lets the prototype foreground what the comprehension test examines.

2. Data and function access are gated by grants rather than by role, reflecting the access model surfaced by Everllence participants during mid-fi sessions. The resulting model is hybrid: RBAC for capability tiers, ABAC-style grants for data and function authorisation.

## Open decisions revisited (provisional, written down)

- **Wish 4 vs 6:** Integrated creation-and-access at assignment moment; separate management deferred (out of scope, justified by comprehension claim being tested at assignment, not maintenance).
- **Task 1 rewrite:** Clean up workflow/UI confusion first; let encoding do the work unaided. No embedded decision point that forces the distinction.
- **Task 3 pre-signalling:** Loose end — needs distinction between facilitator debrief explanation vs interface-level legal surfacing on the denial screen. Revisit before screen build for the sanctions denial.
