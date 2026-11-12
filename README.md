# ClubFund — Student Club Budget Tracker

A lightweight, modern budgeting tool designed specifically for college clubs, student societies, and campus organizations to track expenses, monitor budget allocations, and balance their treasury.

## Features
- **Financial Overview Dashboard**: Real-time display of allocated budget, total expenditure, remaining balance, and budget consumption percentage.
- **Record Expenses**: Fast modal form capturing description, amount, category, and transaction date.
- **Category-wise Visual Breakdown**: Progress bars and proportional expenditure distribution across Food & Catering, Marketing, Equipment, Operations, Honorariums, and Miscellaneous.
- **Search & Filtering**: Search expense logs by keyword and filter by specific expense categories.
- **Budget Adjustments**: Flexible treasury controls allowing club leaders to update total budget limits anytime.
- **Local Persistence & Safe Defaults**: All entries persist in `localStorage` with a 1-click sample data reset button.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Modern, responsive custom CSS design system

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Installation & Local Run
From this directory (`ClubFund`):
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

To build for production:
```bash
npm run build
```
The production bundle will be generated in `dist/`.

To preview the production build locally:
```bash
npm run preview
```

## Deployment
This application is completely static and ready for instant deployment to any static hosting provider:
- **Vercel**: Run `vercel` or link your repo; set root directory to `ClubFund`, build command to `npm run build`, and output directory to `dist`.
- **Netlify**: Drag and drop the `dist` folder or connect via Git with `npm run build` and `dist` publish directory.
- **GitHub Pages**: Deploy the `dist` folder with `gh-pages` or GitHub Actions.
