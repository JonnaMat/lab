<div align="center">
  <h1 style="font-size: 28px; margin: 10px 0;">Spatial Canvas</h1>
  <p>A draggable, pannable canvas for organizing content as overlapping cards. Perfect for bibliographies, knowledge management, and visual tracking.</p>
  <p>
    <a href="https://jonnamat.github.io/spatial-canvas/">
      <img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-View%20Site-green?style=for-the-badge" />
    </a>
  </p>
</div>

<p align="center">
  <a href="https://creativecommons.org/licenses/by/4.0/">
    <img alt="License" src="https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg" />
  </a>
  <a href="https://react.dev/">
    <img alt="React" src="https://img.shields.io/badge/React-18.2-blue.svg" />
  </a>
  <a href="https://zustand-demo.pmnd.rs/">
    <img alt="Zustand" src="https://img.shields.io/badge/Zustand-4.5-purple.svg" />
  </a>
  <a href="https://tailwindcss.com/">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-3.4-cyan.svg" />
  </a>
</p>



## ✨ What is this?

A spatial canvas is a **drag-and-drop workspace** where content lives as overlapping cards. Instead of a linear list, you arrange papers, articles, and demos spatially—like pinning notes to a physical board, but digital.

**Why spatial?**

- **Visual clustering** — Group related cards by topic or theme
- **Non-linear exploration** — Follow your intuition, not a rigid list
- **Persistent memory** — Your arrangement saves automatically, so you can pick up where you left off



## 🎯 Features

| Feature | Description |
|---------|-------------|
| **Draggable Cards** | Grab any card and move it anywhere on the canvas |
| **Pan Navigation** | Drag the background to explore your space |
| **Auto Z-Index** | Hover over a card for 150ms to bring it to front |
| **Persistent Layout** | Your arrangement is saved to cookies automatically |
| **Dark Theme** | Dracula-inspired palette for comfortable reading |
| **GitHub Pages Ready** | Deploy with one build command |



## 🚀 Quick Start

### Use as Template

1. Click **"Use this template"** on GitHub
2. Clone your new repository:
   ```bash
   git clone https://github.com/your-username/spatial-canvas.git
   cd spatial-canvas
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run locally:
   ```bash
   npm run dev
   ```



## 🌐 Deploy to GitHub Pages

### Automatic (Recommended)

1. Go to your repository **Settings → Pages**
2. Under "Build and deployment", select **Source: GitHub Actions**
3. Push to `master` — GitHub automatically builds and deploys!

That's it. Every push to `master` triggers a deployment.

### Manual

```bash
npm run build
```

Then in GitHub Settings → Pages:
- Source: Deploy from a branch
- Branch: `master` / `dist` folder



### Local Development

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```



## 📝 Customization

### Add Your Own Cards

Edit `src/data/initialCards.ts`:

```typescript
{
  id: 'c1',
  x: 100,           // horizontal position
  y: 200,           // vertical position
  zIndex: 1,        // stacking order (leave as 1)
  title: 'Paper Title',
  description: 'Brief description of the paper.',
  type: 'article', // 'article' or 'demo'
  link: 'https://arxiv.org/abs/...',
}
```

### Change the Theme

Colors are defined in `tailwind.config.js` under the `dracula` key. Modify the hex values to match your brand.

### Adjust Canvas Size

The canvas bounds are set in `src/components/Canvas.tsx`. Update the `w-[1400px] h-[900px]` classes to fit your content.



## 🏗️ Tech Stack

| Technology                                    | Purpose                      |
|-----------------------------------------------|------------------------------|
| [React](https://react.dev/)                   | UI framework                 |
| [Zustand](https://zustand-demo.pmnd.rs/)      | Lightweight state management |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first styling        |
| [Vite](https://vitejs.dev/)                   | Fast build tool              |
| [TypeScript](https://www.typescriptlang.org/) | Type safety                  |



## 📁 Project Structure

```
src/
├── components/
│   ├── Canvas.tsx      # Main canvas with pan/drag handling
│   ├── Card.tsx        # Draggable card
│   └── ResetButton.tsx # Restore default layout
├── store/
│   └── canvasStore.ts  # Zustand store + cookie persistence
├── data/
│   └── initialCards.ts # Default card definitions
├── hooks/
│   └── useCardDrag.ts  # Drag interaction logic
└── index.css           # Tailwind + custom styles
```



## 🤝 Contributing

Contributions welcome! Whether it's fixing bugs, adding features, or improving docs:

1. Fork and create a branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Run `npm run lint` to check for issues
4. Commit with a clear message
5. Open a pull request



## 📄 License

This project is available under **CC BY 4.0** (Creative Commons Attribution 4.0).

**You are free to:**
- ✅ Use for personal or commercial projects
- ✅ Modify to suit your needs
- ✅ Share with others

**You must:**
- 📝 Credit **Jonna Matthiesen** as the original author

See [creativecommons.org/licenses/by/4.0](https://creativecommons.org/licenses/by/4.0/) for details.



## 🙏 Acknowledgements

- [Dracula Theme](https://draculatheme.com/) — Beautiful dark color palette
- [Zustand](https://github.com/pmndrs/zustand) — Minimal state management
- All who use and contribute to this template
