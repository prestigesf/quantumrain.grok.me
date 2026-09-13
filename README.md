# Quantum Rain

**quantumrain.grok.me** — an interactive explainer of the 2025 observation of capillary breakup in a self-bound quantum droplet.

A filament of ultracold potassium-41 and rubidium-87 atoms stretches, pinches, and falls apart into a train of smaller droplets. That sequence is the first experimental quantum analog of the Plateau–Rayleigh instability. This repo turns that result into a readable page and a live canvas simulation.

Live: [https://prestigesf.github.io/quantumrain.grok.me/](https://prestigesf.github.io/quantumrain.grok.me/)  
Repo: [https://github.com/prestigesf/quantumrain.grok.me](https://github.com/prestigesf/quantumrain.grok.me)

---

## What you get

| File | Role |
| --- | --- |
| `index.html` | Single-page site: hero sim, physics explainer, experiment notes, sources |
| `CNAME` | Custom domain hint for `quantumrain.grok.me` |
| `LICENSE` | MIT |
| `.gitignore` | Standard ignore rules |

No build step. Open `index.html` or enable GitHub Pages on `main` (`/`).

---

## The science, short version

Classical water jets break into drops because surface tension favors less surface area. Beyond a critical length, a cylinder is unstable; pinches grow and the stream becomes a necklace of droplets. That is the Plateau–Rayleigh instability.

In 2025 a collaboration led by groups at CNR-INO, the University of Florence, and LENS reported the same morphology in a *quantum droplet*: a self-bound mixture of $^{41}$K and $^{87}$Rb held in an optical waveguide near absolute zero. Attractive mean-field interactions try to collapse the cloud; repulsive quantum fluctuations (the Lee–Huang–Yang correction) stabilize it into a liquid-like droplet. When that droplet is stretched past a critical aspect ratio it fragments into smaller droplets — “quantum rain.”

Key references:

- Fort, C. et al., *Phys. Rev. Lett.* **134**, 093401 (2025). DOI: [10.1103/PhysRevLett.134.093401](https://doi.org/10.1103/PhysRevLett.134.093401)
- Background on quantum droplets: Petrov, *Phys. Rev. Lett.* **115**, 155302 (2015); Cabrera et al., *Science* **359**, 301 (2018)
- Accessible overview: [Grokipedia — Quantum rain](https://grokipedia.com/page/Quantum_rain)

The canvas on the homepage is a **visual analogy**, not a Gross–Pitaevskii solver. It shows filament → pinch → satellite droplets so the morphology is easy to feel. Slider values change attraction, stretch, and fluctuation “noise,” which map loosely onto interaction strength, waveguide aspect ratio, and LHY-scale jitter.

---

## Run locally

```bash
git clone https://github.com/prestigesf/quantumrain.grok.me.git
cd quantumrain.grok.me
python3 -m http.server 8080
# open http://localhost:8080
```

Or just double-click `index.html`.

## GitHub Pages

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Optional: attach the custom domain in `CNAME` (`quantumrain.grok.me`) if DNS is pointed at GitHub Pages.

---

## Project status

First fill of an empty repo. Next useful additions if you want them:

- A 1D/2D toy Gross–Pitaevskii demo (Python + pybinding or JS + numeric.js)
- Slow-motion replay of published absorption images (fair-use stills + citation)
- A short FAQ for classrooms
- Topics / description / social preview image

---

## License

MIT. Science belongs to the original experimental groups; this page is an independent explainer and visualization.
