# Technology Stack & Build System

## Core Technologies

**Frontend Framework:**
- React 18 with functional components and hooks
- React Router DOM v6 for client-side routing
- Create React App (CRA) as build system

**Styling & UI:**
- Tailwind CSS v3.4 with utility-first approach
- Custom color palette with semantic naming
- Material Symbols for icons (Google Fonts)
- Inter font family for typography
- Tailwind plugins: @tailwindcss/forms, @tailwindcss/container-queries

**Build Tools:**
- PostCSS with Autoprefixer
- React Scripts 5.0.1 for development and build processes
- ESLint with react-app configuration

## Package Management
- **Preferred:** pnpm (as indicated in README)
- **Alternative:** npm
- Lock file: pnpm-lock.yaml

## Common Commands

```bash
# Development
pnpm dev          # Start development server (localhost:3000)
npm start         # Alternative with npm

# Production Build
pnpm build        # Create optimized production build
npm run build     # Alternative with npm

# Testing
pnpm test         # Run test suite
npm test          # Alternative with npm

# Dependencies
pnpm install      # Install dependencies
npm install       # Alternative with npm
```

## Browser Support
- Production: >0.2%, not dead, not op_mini all
- Development: Latest Chrome, Firefox, Safari

## Development Server
- Runs on http://localhost:3000
- Hot reload enabled via React Scripts
- Proxy configuration available through package.json if needed