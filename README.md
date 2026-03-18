# ☠️ VICAR Threat Modeler

A node-based, interactive threat modeling canvas built on the **VICAR** framework by [ETTIC (Desjardins)](https://medium.com/etticblog/vicar-bridging-the-gap-between-threat-modeling-and-remediation-8538ab851c1e).

## What is VICAR?

VICAR structures each threat through 5 elements:

| Letter | Element | Description |
|--------|----------|-------------|
| **V** | **Vector** | How the attack unfolds |
| **I** | **Impact** | What happens if exploited |
| **C** | **Control** | Weak or missing security control |
| **A** | **Actor** | Who is behind the threat |
| **R** | **Ranking** | Priority: Low / Medium / High |

## Features

- 🎭 **6 VICAR Node Types** — Threat Actor, Attack Vector, Attack Surface, Control, Impact, Threat
- 🖱️ **Drag & Drop Canvas** — Powered by React Flow
- 📝 **Properties Panel** — Edit node details, rankings, and type-specific fields
- 🔗 **Connect Nodes** — Draw relationships between elements
- 📤 **Export JSON / YAML** — Save and share your threat models
- 📥 **Import** — Load existing VICAR models
- 🗺️ **MiniMap** — Color-coded overview of your threat model
- 🌑 **Dark Theme** — Full dark UI

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Flow](https://reactflow.dev/) — Node canvas
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [js-yaml](https://github.com/nodeca/js-yaml) — YAML export/import
- [Lucide React](https://lucide.dev/) — Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Usage

1. **Drag** a node from the left palette onto the canvas
2. **Click** a node to edit its properties in the right panel
3. **Connect** nodes by dragging from one handle to another
4. **Export** your threat model as JSON or YAML

## License

MIT
