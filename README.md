# JobBank — Private Repository

IMPORTANT: This repository is a private, company-owned project. Do NOT clone, fork, or copy this repository or any of its contents unless you have explicit written permission from the project owner. Unauthorized duplication or distribution is strictly prohibited.

**Project Owner:** dev-olayemi

**Purpose:** A production-grade job platform for Africa — internal, proprietary, and maintained by the core engineering team.

**If you do not have access:** Request access from the project owner or your manager. Do NOT attempt to bypass permissions.

**Quick Summary**
- **Status:** Private / Internal
- **Tech stack:** Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Primary entry:** `src/main.tsx`

**Access & Policies**
- Do not clone, fork, or mirror this repository to public or personal accounts.
- Do not publish or share any repository contents externally.
- Secrets and credentials must never be committed. Use your organization's secret manager or vault.
- Local `.env` files must be added to `.gitignore` (we use `.env.local` for local overrides). If you find secrets in the repo, notify security and rotate them immediately.

Getting access
- If you require access, contact the repository owner (`dev-olayemi`) or the team lead and request an invitation. Access will be granted via GitHub team membership or explicit invite.

Local development (for authorized contributors only)
- Clone only if you've been explicitly invited.

```bash
# Recommended (using bun if installed)
bun install
bun run dev

# Alternatively (npm)
npm install
npm run dev
```

- Environment: Create a local environment file from the example and never commit it:

```bash
cp .env.example .env.local
# edit .env.local with your credentials
```

Security & secrets
- Never commit `.env`, keys, or private credentials. They should be stored in your team's secret manager.
- We enforce `.gitignore` to exclude environment files. If you discover sensitive files already committed, inform the owner immediately so we can rotate credentials and remove them from history.

Committing and PRs
- Use feature branches: `feature/<short-desc>` or `bugfix/<short-desc>`.
- Open a pull request targeting `main` and request at least one reviewer from the core team.
- Write clear PR descriptions and reference relevant issue IDs.

CI / Deployments
- Deployments are handled by the ops team (Lovable or internal CI). Do not attempt to reconfigure deployment targets unless authorized.

Repository hygiene & history
- If secrets were previously committed, we will coordinate a history purge (git filter-repo or BFG) and a coordinated force-push. This action requires communication with all collaborators.

Support & contact
- Repo owner / maintainer: GitHub: `dev-olayemi`
- For security incidents: contact the security team and the project owner immediately.

Legal & license
- This codebase is proprietary and intended for internal use only. Do not redistribute or relicense without permission.

---

If you want additional sections (architecture overview, developer workflow, or onboarding checklist), tell me which sections to add and I will expand this README accordingly.
