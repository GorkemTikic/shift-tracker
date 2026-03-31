# T-Shift Professional Operations Tracker

A high-performance Progressive Web App (PWA) designed for customer support operations to track multi-segment shifts.

## The T-Shift Logic

This application handles data based on a strict 9-hour operational envelope called a **"T-Shift"** (15:00 UTC - 00:00 UTC).
*   **Time Normalization:** Times are tracked via military `HH:mm` format. "00:00" logically represents the terminal end of the shift but is treated conceptually as "24:00" for calculation metrics (Productive vs. Other).
*   **Category Strategy:** Features a predefined set of strict operations categories (`Online`, `AD HOC`, `Meal Break`, etc.) mapped to colors, prioritizing main productive states in the selection workflow.
*   **Segment Defaults:** The app eliminates friction by automatically assigning the start time of a new segment to perfectly match the end time of the preceding segment.

## Features

1.  **Dark Mode Premium UI:** Sleek glassmorphism using Tailwind CSS.
2.  **Smart Summary Generator:** Fully automates the shift report output ("March X Summary: 15:00-18:00 AD HOC...").
3.  **Local First:** No server needed. All data persists to standard browser `localStorage` and can be synced via Import/Export JSON.
4.  **Mobile Ready:** The application layout is fully responsive, targeting touch-first environments with large touch targets.

## Local Development

```bash
# Install packages
npm install

# Run the local Vite server
npm run dev

# Build for production deployment
npm run build
```

## Deployment (GitHub Pages)

This project is built using Vite and configured with `base: './'` so it can be deployed immediately:

1.  Push the code to a GitHub repository (e.g. `user/t-shift`).
2.  Enable **GitHub Actions** or use `gh-pages` branch.
3.  Deploy the `/dist` directory. Vercel and Netlify can also be instantly linked.
