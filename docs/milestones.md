**Roadmap Proposal (No Implementation)**
1. **Milestone 1: Core Runtime Stabilization (Domain 2 + 3)**
- Define canonical runtime contracts: block execution order, halt conditions, error states.
- Add tests for control blocks (`IF`, `ELSE`, `REPEAT`) and edge cases (wall collisions, bounds, target reached early).
- Add deterministic execution report shape (for UI playback + debugging, not only console logs).
- Exit criteria: stable `GameEngine` API with strong unit coverage.

2. **Milestone 2: Editor Program Model (Domain 1 + 3 + 4)**
- Define JSON schema for a level + program graph (blocks, nesting, metadata, version).
- Implement editor-side program builder state (block placement, nesting rules, validation).
- Add serialization/deserialization with version field and migration hook placeholders.
- Exit criteria: a saved program can roundtrip from editor → JSON → runtime without data loss.

3. **Milestone 3: Canvas Preview Runtime (Domain 2 + 1)**
- Build Canvas renderer loop for grid, walls, chest, target, player.
- Add step playback controls: play, pause, step-forward, reset.
- Map runtime execution steps to animation frames (deterministic, no physics engine).
- Exit criteria: split-screen editor + preview works with visible, repeatable playback.

4. **Milestone 4: Interaction UX (Domain 1)**
- Implement long-press radial menu on programming canvas.
- Add directional + control blocks in menu (`UP/DOWN/LEFT/RIGHT`, `IF`, `ELSE`, execution blocks).
- Add basic UX constraints: valid drop targets, invalid-state feedback.
- Exit criteria: user can author simple challenge solutions from UI alone.

5. **Milestone 5: Mobile + Persistence + QA (Domain 4 + 5)**
- Integrate local storage for level/program save/load (JSON documents).
- Validate Capacitor builds on Android/iOS and define device test matrix.
- Add E2E happy-path tests: create program, run preview, save, reload, rerun.
- Exit criteria: polished prototype build installable on both platforms.

**Suggested Priority Order**
- **Now:** Milestone 1 + JSON schema draft from Milestone 2.
- **Next:** Milestone 2 completion + Milestone 3 playback.
- **Then:** Milestone 4 UX polish.
- **Release prep:** Milestone 5 hardening.

**Guardrails**
- Keep physics and multiplayer out of scope.
- Keep runtime deterministic and test-first.
- Keep JSON versioned from the start to avoid migration pain later.