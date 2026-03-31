# EvoBite — Intelligent Diet & Lifestyle Planner

AI-powered diet planner with personalized meals, smart calorie intelligence, and recipe-integrated plans. Eat Smart. Evolve Daily.

## Features

- Personalized diet planning based on user profile
- Smart calorie intelligence
- Recipe-integrated meal plans
- Responsive dashboard with animations
- PDF export functionality
- Dark/Light theme support

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/ui + Radix UI
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Routing**: React Router
- **PDF Generation**: jsPDF + html2canvas

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. The app will be deployed with the following settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Node Version**: 18+

### Manual Deployment

The `vercel.json` file is configured for optimal Vercel deployment with SPA routing support.

## Environment Variables

No environment variables are required for this application.

## License

MIT
