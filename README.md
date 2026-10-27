# 🎮 Hotel Explorer Mini-Game

A lightweight, interactive 2D floor-plan arcade game built entirely in modern React using Vite. Players navigate a grid-accurate blueprint of a hotel layout, track down randomly spawning items, and solve arithmetic puzzles under a ticking countdown clock to build their balance and level up.

---

## ✨ Features Included
* **Dynamic Grid Walking:** Fully functional position tracking that translates client clicks into fluid coordinate sliding.
* **Smart Boundary Detection:** Collision mapping walls that restrict both character movements and spawning algorithms safely inside the walkable open hallway zones.
* **Timed Challenge Locks:** Integrated reaction timers that close target chests automatically after 15 seconds if left unanswered.
* **Adaptive Difficulty Loop:** Progress engine that increments user levels and opens larger mathematical numeric ranges as the coin balance milestones grow.
* **Immersive Visual Blending:** Optimized graphical layout featuring overlay filters to seamlessly integrate character art into the hotel environment.

---

## 🛠️ Run & Setup Instructions

Follow these rapid initialization steps to launch the local deployment environment on your system:

### 1. Prerequisites
Ensure you have the stable LTS release of **Node.js** installed on your workstation. Verify your local installation by running this terminal call:
```bash
node -v
```

### 2. Install Project Dependencies
Open your workspace terminal panel inside your main root folder directory and run the following execution string to bundle core module nodes:
```bash
npm install
```

### 3. Launch Development Host
Fire up the lightning-fast Vite local runtime server engine:
```bash
npm run dev
```

### 4. Experience the Game
Look inside your terminal log stream, locate the generated local address binding network output (typically `http://localhost:5173/`), then **hold Ctrl (or Cmd on Mac) and click the link** to explore the application directly inside your web browser.
