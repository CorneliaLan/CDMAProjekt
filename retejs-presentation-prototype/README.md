# Vehicle Advisor — Rete.js v2 PoC

Visual survey/form logic builder built with **Rete.js v2** as a proof-of-concept for the CDMA project. Demonstrates a node-based decision tree that guides users to personalised vehicle recommendations.

## What it does

- **Visual graph editor** — drag nodes, draw connections, edit condition values inline
- **3 node types**: Question (blue), Condition (orange), Recommendation (green)
- **5 question input styles** — radio cards, range slider, multi-select checkboxes, number stepper, yes/no buttons
- **Run the survey** — walks the graph via a smooth modal UI, evaluates conditions (`equals`, `≤`, `≥`, `includes`, …), and presents matching vehicle recommendations at each leaf
- **Hardcoded demo tree** — 26 nodes across 3 branches (Commuting · Family · Recreation) with 10 recommendation endpoints

## How to start

```bash
# from the project folder:
npx serve .
```

Then open **http://localhost:3000** in Chrome or Edge.

> **Note:** A local HTTP server is required — ES modules and import maps are blocked on `file://` URLs by the browser.

## Tech

| | |
|---|---|
| Node editor | [Rete.js v2](https://retejs.org) |
| Rendering | React 18 (via Rete React Plugin) |
| Build | None — single `index.html`, CDN imports only ([esm.sh](https://esm.sh)) |
