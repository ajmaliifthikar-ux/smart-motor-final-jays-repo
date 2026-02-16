# Implementation Plan: Advanced CMS & Autonomous AI Agent Swarm

## Phase 1: CMS Core & Infrastructure
Goal: Establish the database models and basic API routes for content management and versioning.

- [x] Task: Update `prisma/schema.prisma` to include `ContentAudit` and `ContentHistory` models.
    - [x] Write Tests: Verify schema integrity and relation mappings.
    - [x] Implement Feature: Add new models and run `npx prisma migrate dev`.
- [x] Task: Create Server Actions for granular content updates with audit logging.
    - [x] Write Tests: Verify `ContentAudit` record is created on every update.
    - [x] Implement Feature: Develop `updateContentWithAudit` action.
- [x] Task: Implement snapshot history logic for full content state restoration.
    - [x] Write Tests: Verify snapshot creation and "Restore to Version" functionality.
    - [x] Implement Feature: Develop `createContentSnapshot` and `restoreContentSnapshot` actions.
- [x] Task: Conductor - User Manual Verification 'Phase 1: CMS Core & Infrastructure' (Protocol in workflow.md)

## Phase 2: Administrative CMS Interface
Goal: Build the visual management tools for website content.

- [ ] Task: Develop the Admin Content Dashboard for editing core page sections.
    - [ ] Write Tests: Test form validation and error handling for content fields.
    - [ ] Implement Feature: Create UI for editing Hero, About, and Mission sections.
- [ ] Task: Build management interfaces for the Service Catalog and Brand profiles.
    - [ ] Write Tests: Verify CRUD operations for services and brands.
    - [ ] Implement Feature: Create dynamic forms for service and brand metadata.
- [ ] Task: Implement the "Version History" viewer in the admin panel.
    - [ ] Write Tests: Verify correct rendering of audit logs and historical snapshots.
    - [ ] Implement Feature: Create UI to compare versions and trigger restorations.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Administrative CMS Interface' (Protocol in workflow.md)

## Phase 3: Business Research Agent Integration
Goal: Establish the secure Strategy Lab and integrate the high-rigor research agent.

- [ ] Task: Scaffold the "Strategy Lab" secure area within the Admin Panel.
    - [ ] Write Tests: Verify role-based access control (RBAC) for the lab.
    - [ ] Implement Feature: Create protected routes and layout for the lab.
- [ ] Task: Integrate Gemini 2.0 Flash with Business Research frameworks (MECE, Issue Trees).
    - [ ] Write Tests: Verify agent generates structured outputs based on specific prompts.
    - [ ] Implement Feature: Develop the research agent logic using Genkit/Gemini.
- [ ] Task: Build the Business Analysis dashboard with live data visualizations.
    - [ ] Write Tests: Test data aggregation from platform metrics (bookings, etc.).
    - [ ] Implement Feature: Create charts and insight summaries for the Strategy Lab.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Business Research Agent Integration' (Protocol in workflow.md)

## Phase 4: Autonomous SEO Agent Swarm
Goal: Deploy the specialized agent swarm for technical, competitor, and local SEO.

- [ ] Task: Set up the Orchestration Layer for multi-agent coordination using Gemini 2.0 Flash.
    - [ ] Write Tests: Verify task planning and delegation between agents.
    - [ ] Implement Feature: Develop the Master Agent logic.
- [ ] Task: Implement the Technical SEO and Competitor Intelligence agents.
    - [ ] Write Tests: Verify crawler output and SERP data parsing (mocked APIs).
    - [ ] Implement Feature: Integrate GSC, GA4, and SerpAPI/DataForSEO.
- [ ] Task: Develop the Autonomous Proposal Engine and Approval Workflow UI.
    - [ ] Write Tests: Verify one-click execution of approved SEO proposals.
    - [ ] Implement Feature: Create the "SEO Opportunities" dashboard with approval buttons.
- [ ] Task: Implement Local SEO monitoring for Google Business Profile.
    - [ ] Write Tests: Verify review detection and alerting logic.
    - [ ] Implement Feature: Integrate GBP API and build review alert system.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Autonomous SEO Agent Swarm' (Protocol in workflow.md)
