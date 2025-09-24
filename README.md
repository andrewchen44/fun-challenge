# Token Price Explorer

A modern React + TypeScript application for exploring cryptocurrency token prices and performing token swaps. Built with performance, maintainability, and best practices in mind.

## Features

- **Real-time Token Prices**: Fetches live prices from the Funkit API for USDC, USDT, ETH, and WBTC
- **Token Swap Interface**: Clean, intuitive UI for comparing token values
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Robust error boundaries and user-friendly error messages
- **Loading States**: Smooth loading indicators during API calls
- **Price Refresh**: Manual refresh functionality with timestamp display
- **Accessibility**: Built with ARIA attributes and semantic HTML

## Tech Stack

- **Frontend**: React 18 + TypeScript
  - *Why*: React provides component-based architecture for maintainable UI, TypeScript ensures type safety and catches errors at compile time
- **Build Tool**: Vite
  - *Why*: Fast development server with HMR, optimized production builds, and excellent TypeScript support out of the box
- **Styling**: CSS with custom properties (design system)
  - *Why*: Native CSS approach with design tokens for consistency, maintainability, and performance without additional runtime overhead
- **API**: Funkit API Base for token data and prices
  - *Why*: Provides reliable, real-time cryptocurrency data with proper TypeScript types and error handling
- **Code Quality**: ESLint + Prettier
  - *Why*: ESLint catches code quality issues and enforces best practices, Prettier ensures consistent code formatting across the team
- **Git Hooks**: Husky + lint-staged
  - *Why*: Automatically runs linting and formatting on staged files before commits, preventing code quality issues from entering the repository
- **Error Handling**: React Error Boundary
  - *Why*: Gracefully handles component crashes and provides fallback UI, improving user experience and debugging capabilities

## Prerequisites

- **Node.js**: Version 18 or higher (required for Vite and modern JavaScript features)
- **npm**: Version 8 or higher

## Getting Started

### 1. Clone the Repository

```bash
git clone <https://github.com/andrewchen44/fun-challenge>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ErrorFallback/          # Error boundary fallback UI
│   └── TokenSwap/             # Token swap related components
│       ├── AmountInput/       # USD amount input component
│       ├── Panel/             # Generic panel container
│       ├── TokenChip/         # Token selection buttons
│       ├── TokenDisplay/      # Token amount and price display
│       └── TokenSelector/     # Token dropdown selector
├── constants/
│   └── tokens.ts              # Token definitions and configuration
├── hooks/
│   └── useTokenPrices.ts      # Custom hook for price fetching
├── services/
│   └── tokenApi.ts            # API service for token data
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── styles.css                 # Global styles and design system
```

## Design System

The application uses a comprehensive CSS custom properties system for consistent styling:

- **Colors**: Primary, text, background, border, and error colors
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, 2xl)
- **Typography**: Font sizes, weights, and line heights
- **Borders**: Border widths, radii, and styles
- **Transitions**: Smooth animations and hover effects

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prepare` - Initialize husky git hooks

## Pre-commit Hooks

This project uses **husky** and **lint-staged** to automatically run linting and formatting before each commit:

- **ESLint**: Automatically fixes linting issues in TypeScript/React files
- **Prettier**: Formats code for consistent styling
- **Staged files only**: Only processes files that are staged for commit

### What happens on commit:
1. ESLint runs with `--fix` flag on staged `.ts` and `.tsx` files
2. Prettier formats staged `.ts`, `.tsx`, `.css`, `.md`, and `.json` files
3. If any issues cannot be auto-fixed, the commit is blocked
4. You must fix the issues manually and stage the changes again

### Bypassing hooks (not recommended):
```bash
git commit --no-verify -m "commit message"
```

## Design Assumptions

This application was built with the following key design assumptions in mind:

### Real-time Data Priority

- **Assumption**: Having the most real-time data is critical so that users can make the most informed decisions
- **Implementation**: Fetch new data every time a new token is selected instead of fetching and reusing cached price data
- **Rationale**: Cryptocurrency prices can be volatile and change rapidly. Users need the most current information to make accurate trading decisions

### Limited Token Set

- **Assumption**: There are only 4 coins in the world (USDC, USDT, ETH, WBTC)
- **Implementation**: Token selection uses simple chip buttons for all available tokens
- **Future Considerations**: For applications with more tokens, would need to implement:
  - Dropdown selection with search functionality
  - Pagination or virtual scrolling for large token lists
  - Token search and filtering capabilities
  - Token categorization (e.g., by market cap, category, etc.)

### User Experience Priorities

- **Performance**: Optimized for fast token switching and price updates
- **Simplicity**: Clean, intuitive interface that doesn't overwhelm users
- **Reliability**: Robust error handling and loading states
- **Accessibility**: Built with semantic HTML and ARIA attributes


## Security Considerations

- API keys are included for development purposes only
- In production, API keys should be stored in environment variables
- All user inputs are validated and sanitized