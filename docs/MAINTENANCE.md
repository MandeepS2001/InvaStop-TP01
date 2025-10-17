## InvaStop Maintenance Document

Audience: Future sponsors, support staff, and the sponsoring organisation’s technical team.

This document is structured per the exemplar rubric to ensure clarity, completeness, and knowledge transfer readiness.

---

### 1. Introduction
InvaStop is a web platform that helps monitor and manage invasive species across Australia by combining a React frontend with a FastAPI backend and an AWS RDS MySQL database. This document explains how to operate, maintain, secure, and extend the system.

### 2. Maintenance Team Composition
- Product owner/sponsor representative
- Tech lead (backend focus)
- Frontend engineer
- DevOps/infra support (part‑time)
- Data steward (DB access governance, backups)

RACI: Tech lead owns releases and incident response; data steward owns backups and restores; DevOps owns secrets/hosting; frontend and backend engineers own feature maintenance.

### 3. Development Lifecycle
- Branching: feature branches → PR review (minimum 1 reviewer) → merge to `main`.
- Versioning: semantic versioning MAJOR.MINOR.PATCH. Hotfixes increment PATCH.
- Code quality: ESLint/Prettier (frontend), type hints and Pydantic validation (backend). No dead code in PRs.
- Testing gates:
  - Backend: start service; verify `/health`, `/docs` loads; run 3–5 critical API smoke calls.
  - Frontend: load homepage, map, one analytics page; verify no console errors.
- Release flow:
  1) Cut release branch `release/vX.Y.Z`.
  2) Build frontend `npm run build` and smoke test locally.
  3) Backup RDS snapshot (see Section 9).
  4) Deploy backend, then frontend.
  5) Post‑deploy validation and monitoring (Section 12).

### 4. Product Overview & Features
- Citizen reporting, risk analytics, seasonal insights, interactive map overlays.
- API groups: auth, species, reports, analytics, epic1, quiz, impact, ai.

Feature flags and toggles
- CORS origins configured via environment variable.
- Optional map token via `MAPBOX_ACCESS_TOKEN`.

### 5. Operating Environment
- Local: Node 18+, Python 3.11+, uvicorn, React dev server.
- Production: static frontend hosting (Vercel‑style) and FastAPI service. Database is AWS RDS MySQL.
- Optional Docker for local parity; not used in current deployment.

### 6. System Architecture Diagram + Stack
Stack
- Frontend: React 18, TypeScript, Tailwind, React‑Router, Axios, React‑Query, Leaflet/React‑Leaflet.
- Backend: FastAPI, SQLAlchemy, Pydantic, python‑jose/passlib (JWT), httpx.
- Data: AWS RDS MySQL via PyMySQL.

Key links
- Health: `GET /health`
- Docs: `GET /docs`
- Base routes under `/api/v1/*` (see Section 10).

ASCII Architecture
```
 [Browser]
     |
     v
 [Frontend: React/TS]  -- Axios -->  [Backend: FastAPI]
                                  |--> SQLAlchemy ORM
                                  |--> Auth (JWT)
                                  |--> Data APIs (analytics, map)
                                           |
                                           v
                                [AWS RDS MySQL]
```

### 7. Maintenance Activities (code / data / test / troubleshoot)
- Code: dependency updates quarterly; lint/format; review PRs; update API schemas.
- Data: back up RDS daily; run `check_table_structure.py` before deploying schema changes; scripts `init_db.py`, `import_data.py` for controlled loads.
- Test: smoke tests for major pages; sample API calls in Postman; verify map rendering.
- Troubleshoot: see Section 13.

Runbooks
- Dependency update runbook:
  1) Create branch `chore/deps-YYYYMM`.
  2) Update `backend/requirements.txt` minor versions; `npm outdated` and apply minors.
  3) Rebuild and run smoke tests; open PR.
- Secrets rotation runbook:
  1) Generate new `SECRET_KEY` and DB password; store in secret manager.
  2) Update environment; restart backend; validate login flows.
  3) Revoke old credentials.

### 8. Security and Compliance (OWASP + ACS)
- OWASP controls: input validation (Pydantic), authentication with JWT, least‑privilege DB users, CORS allowlist, HTTPS‑only in production, secret rotation.
- ACS Code: act in public interest, maintain competence, value privacy, manage conflicts; see Section 17 mapping.

Vulnerabilities to watch
- SQL injection (mitigated via ORM/params), JWT token leakage, CORS misconfig, exposed `.env` files.
Security testing
- Quarterly: dependency CVE scan; manual auth and CORS checks; confirm HTTPS redirection in hosting.

### 9. Database Operations (Backup / Restore / Access Control)
- Connection via `DATABASE_URL` (MySQL + PyMySQL). Keep RDS security groups IP‑restricted.
- Backups: enable automated snapshots (daily); retain 7–30 days; pre‑release manual snapshot.
- Restore: create new RDS from snapshot; point `DATABASE_URL` to restored instance after validation.
- Access control: separate app user vs admin; rotate credentials; never share admin keys in code.

Backup/Restore Procedures
```bash
# Snapshot (AWS console or CLI)
aws rds create-db-snapshot --db-instance-identifier <prod-instance> --db-snapshot-identifier invastop-pre-release-$(date +%Y%m%d)

# Restore to new instance (CLI)
aws rds restore-db-instance-from-db-snapshot --db-instance-identifier invastop-restore --db-snapshot-identifier <snapshot-id>
```
Post-restore validation
- Run `check_table_structure.py` and manual queries for row counts of key tables.
- Point staging `DATABASE_URL` to the restored instance; run API smoke tests.

### 10. API Contracts and Versioning
- Use `/docs` Swagger as the canonical contract.
- Backward‑compatible changes: additive fields. Breaking changes: create new route or `/api/v2`.
- Representative endpoints: `/api/v1/epic1/states/risk-levels`, `/api/v1/epic1/invasive-records`, `/api/v1/epic1/seasonal-risk`.

Change control template
- Summary, Affected endpoints, Request/Response diffs, Migration plan, Rollback plan.

### 11. Build & Deployment Workflow + Rollback
- Frontend: `npm run build` → deploy `frontend/build` to hosting. Post‑build script `build-iteration1.js` runs automatically.
- Backend: run with `uvicorn`/`gunicorn`; env vars via platform secrets; CORS configured via settings.
- Rollback: redeploy previous frontend artifact; redeploy prior backend image or commit. If schema changed, restore from snapshot to staging before prod cutback.

Release checklist (detailed)
- [ ] RDS snapshot taken and noted.
- [ ] `.env` present in environment; secrets verified.
- [ ] CORS restricted to production domains.
- [ ] `/health` green; `/docs` loads; map tiles render.
- [ ] Error logs show no new 5xx after 15 minutes.

### 12. Monitoring and Logging Framework
- Health checks: `/health`.
- Metrics to watch: HTTP 5xx rate, latency, DB connection failures, auth errors.
- Log sources: app server logs, hosting platform logs; retain 14–30 days.

Alert suggestions
- Health check failure ≥3 mins, 5xx rate > 2% over 10 mins, DB connection errors spike.

### 13. Troubleshooting Guide (Common Faults and Fixes)
- Frontend cannot reach API: backend not running on 8000 or CORS `ALLOWED_ORIGINS` missing localhost; fix and retry.
- 500 on data endpoints: verify `DATABASE_URL` and RDS security group allow current IP; check model/table existence with `check_table_structure.py`.
- Swagger missing: start server with `uvicorn main:app --reload`; resolve import errors.
- Map blank: ensure Leaflet tiles reachable or set required map token if using Mapbox.

Diagnostics commands
```bash
curl -i http://localhost:8000/health
curl -s http://localhost:8000/docs | head -n 5
mysql -h <rds-endpoint> -u <user> -p -e "SHOW DATABASES;"
```

### 14. Extensibility and Coding Conventions
- Python 3.11+, Node 18+.
- Backend: routers under `app/api/routes`; SQLAlchemy models in `app/models`; Pydantic schemas in `app/schemas`.
- Frontend: functional components, hooks, TypeScript types in `src/types`; keep modules small and focused.

PR guidelines
- Small, focused changes; include screenshots or sample responses; update docs when contracts change.

### 15. Maintenance Cadence Checklist
- Monthly: dependency audit; review logs; verify backups succeeded; rotate any temporary keys.
- Quarterly: minor upgrades; restore‑from‑snapshot drill; CORS/secret review.
- Pre‑release: snapshot DB; run smoke tests; check `/docs` validity; update changelog.

### 16. Knowledge Transfer Strategy
- 60–90 minute walkthrough of repo, runbooks, deployment, and DB ops.
- Provide artifacts: this Maintenance Doc, Support Doc, Product Doc, Swagger JSON, ERD snapshot, architecture diagram.
- Access handover: repo/hosting/RDS; rotate secrets post‑transfer.

KT session outline
1) Architecture and environments (15m)
2) Local run + build walkthrough (20m)
3) Release, rollback, and backup/restore (20m)
4) Security posture and secrets (10m)
5) Q&A (10–20m)

### 17. Compliance & Ethical Standards (ACS Mapping)
- Public interest: transparent data handling; no unnecessary PII.
- Quality of life: reliable information to assist environmental decisions.
- Honesty: accurate documentation and limitations noted.
- Competence: maintain current security practices and dependencies.
- Professional development: periodic reviews and KT sessions.

Regulations and standards
- Follow platform terms for map tiles/APIs; comply with data licensing and attribution.

### 18. Appendix – File structure, ERD snapshot, URLs, contact table
- File structure: see repository root; key backend files `main.py`, `app/core/*`, `app/api/routes/*`.
- ERD: generate from SQLAlchemy models (`Top5Common`, `TaxonDataset`, `InvasiveRecord`, etc.).
- URLs: Frontend `http://localhost:3000`; Backend `http://localhost:8000`; Docs `/docs`; Health `/health`.
- Contacts: include sponsor representative, tech lead, DB admin, and support mailbox.

Contact Table (template)
| Role | Name | Email | Backup |
| --- | --- | --- | --- |
| Sponsor Rep | TBD | tbd@example.com | – |
| Tech Lead | TBD | tbd@example.com | TBD |
| DB Admin | TBD | tbd@example.com | TBD |
| Support | TBD | support@example.com | – |


