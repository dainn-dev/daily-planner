# Project Structure & Architecture

## Folder Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level page components
├── constants/          # Application constants and initial values
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and helpers
├── App.js              # Main app component with routing
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Component Architecture

**Page Components (`src/pages/`):**
- Route-level components that represent full pages
- Handle page-specific state and data fetching
- Compose smaller components to build complete views
- Examples: `HomePage.js`, `DailyPage.js`, `AdminDashboardPage.js`

**Reusable Components (`src/components/`):**
- Shared UI components used across multiple pages
- Follow single responsibility principle
- Accept props for customization
- Include form components, headers, navigation, and feature-specific components

**Component Categories:**
- **Layout:** `Header.js`, `Sidebar.js`, `Footer.js`
- **Forms:** `FormInput.js`, `FormSelect.js`, `FormTextarea.js`, `PasswordInput.js`, `Toggle.js`
- **Feedback:** `ErrorMessage.js`, `SuccessMessage.js`
- **Feature-specific:** `Hero.js`, `SmartScheduling.js`, `GoalBreakdown.js`
- **Page-specific headers:** `LoginHeader.js`, `ContactHeader.js`, etc.

## Routing Structure

**Public Routes:**
- `/` - Homepage
- `/login`, `/register` - Authentication
- `/forgot-password`, `/reset-password` - Password recovery
- `/contact`, `/term`, `/conditions` - Static pages

**Authenticated Routes:**
- `/daily` - Daily task planning
- `/goals`, `/goals/:id` - Goal management
- `/calendar` - Calendar view
- `/settings/*` - User settings (nested routes)

**Admin Routes:**
- `/admin/dashboard` - Admin overview
- `/admin/users`, `/admin/users/:id` - User management
- `/admin/logs` - System log file management

## Code Conventions

**File Naming:**
- PascalCase for component files: `FormInput.js`, `AdminDashboardPage.js`
- camelCase for utility files: `formValidation.js`, `colorMappings.js`
- kebab-case for configuration files: `tailwind.config.js`

**Component Structure:**
- Functional components with hooks
- Props destructuring in function parameters
- PropTypes or TypeScript for type checking (when applicable)
- Default exports for components

**State Management:**
- Local component state with `useState`
- Custom hooks for reusable stateful logic
- Constants files for initial values and configuration

**Styling:**
- Tailwind utility classes
- Custom color palette defined in `tailwind.config.js`
- Responsive design with mobile-first approach
- Semantic class names for custom components

## Data Flow Patterns

**Form Handling:**
- Use `useForm` custom hook for form state management
- Validation utilities in `src/utils/formValidation.js`
- Error handling with inline error messages

**Constants Management:**
- Initial values in `src/constants/` files
- Centralized configuration for reusability
- Separate files by feature domain (settings, tasks, etc.)

**Component Communication:**
- Props for parent-to-child communication
- Callback functions for child-to-parent communication
- Context API for deeply nested state (when needed)