# Figma-Tailwind Design System Boilerplate

> **The missing link between Figma design systems and production-ready code.**

Finally, a starter template that keeps your Figma designs and code perfectly aligned. No more "it doesn't look like the design" - build pixel-perfect UIs with automated design token synchronization.

## 🎯 Why This Exists

**The Problem**: You can find amazing design systems on Figma Community and tons of code boilerplates, but nothing that truly connects them. Designers create beautiful, systematic designs in Figma, then developers rebuild them from scratch in code, losing consistency and wasting time.

**The Solution**: This boilerplate automatically syncs your Figma design tokens with your codebase, creating a seamless workflow from design to production.

## ✨ Key Features

- 🎨 **True Figma-Code Alignment** - Design tokens sync automatically from Figma to CSS
- 🌗 **Smart Theme System** - Light/dark themes with semantic color variables
- 🧩 **shadcn Foundation** - Built on shadcn/ui components, customized for design system alignment
- ⚡ **Tailwind 4.1** - Latest Tailwind with CSS variables and @theme directive
- 🔄 **Automated Sync Scripts** - Keep design and code in perfect harmony
- 📐 **Pixel-Perfect Typography** - Font styles that match Figma exactly
- 🎯 **MCP-Ready** - Optimized for AI-powered UI generation that stays on-brand

## 🛠 Tech Stack

- **Next.js 15.3.5** - React framework
- **Tailwind CSS 4.1** - Latest version with native CSS variables
- **shadcn/ui** - Component foundation (customized)
- **Phosphor Icons** - Icon system aligned with Figma designs
- **TypeScript** - Type safety throughout

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/alfrankl1/figma-tailwind-cookiecutter.git
cd figma-tailwind-cookiecutter

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` (or `3003` if 3000 is in use) to see your design system in action.

## 🎨 Figma Integration

### Design System Setup
1. **Get the Figma Community File** - [Link coming soon] - A complete design system template
2. **Customize Your Tokens** - Modify colors, typography, and spacing in Figma
3. **Export Variables** - Use Figma's design token export feature
4. **Sync to Code** - Run the sync scripts to update your CSS

### Sync Commands
```bash
# Sync colors from Figma exports to CSS
npm run build:colors

# Sync typography from Figma exports to CSS  
npm run build:fonts
```

## 📁 Project Structure

```
├── src/
│   ├── components/ui/          # shadcn components (customized)
│   ├── app/globals.css         # Design tokens & Tailwind config
│   └── app/                    # Next.js app directory
├── scripts/
│   ├── sync-figma-colors.js    # Color token sync script
│   └── sync-figma-fonts.js     # Typography sync script
├── tools/
│   ├── figma-colors.json       # Exported color tokens
│   └── figma-fonts.json        # Exported typography tokens
└── .cursor/rules/              # AI coding rules for consistency
```

## 🎯 Design System Philosophy

### Semantic Color System
Uses intelligent color naming that works across themes:
```css
/* Instead of hard-coded colors */
bg-blue-500

/* Use semantic tokens that adapt */
bg-brand text-brand-secondary border-brand-tertiary
```

### Typography Alignment
Font styles match Figma exactly with fallbacks:
```css
/* Figma font style names */
.font-button      /* Button text styling */
.font-title       /* Heading styles */
.font-body-large  /* Body text variants */
```

### Component Conventions
- Start with pure shadcn component
- Assess against Figma design requirements  
- Apply semantic tokens for perfect alignment
- Use Phosphor icons matching Figma icon names

## 🎪 Who This Is For

### For Designers Who Code
- Skip the "developer handoff" - your designs ARE the code
- Maintain design consistency without engineering overhead
- Build functional prototypes that match your vision exactly

### For Development Teams
- Eliminate design-code drift
- Build faster with pre-aligned components
- Focus on functionality, not pixel-pushing

### For Design Systems Teams
- Single source of truth between Figma and code
- Automated consistency checks
- Scale design decisions across products

## 🔮 Roadmap

- [ ] **Component Library Expansion** - More shadcn components with Figma alignment
- [ ] **Advanced Token Support** - Spacing, borders, shadows, and more
- [ ] **Figma Plugin** - Direct sync from Figma interface
- [ ] **Design System Documentation** - Auto-generated component docs
- [ ] **Theme Variants** - Support for brand variations and white-labeling

## 📚 Examples

Check out the included Button component to see the full integration in action:
- All shadcn variants maintained
- Figma color tokens applied
- Typography styles from design system
- Phosphor icons matching Figma names
- Perfect hover states and interactions

## 🤝 Contributing

This is just the beginning! Help us build the ultimate Figma-code bridge:
- Add new component integrations
- Improve sync script reliability  
- Enhance theme system capabilities
- Share your design system setups

## 📄 License

MIT License - build amazing things!

---

**Ready to eliminate design-code friction forever?** Star this repo and let's build the future of design-development collaboration.
