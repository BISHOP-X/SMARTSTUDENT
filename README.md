# SmartStudent

> AI-powered learning management platform that adapts to you

SmartStudent is a modern learning management system that combines unified academic management with intelligent personal organization. Built with cutting-edge technologies to provide a seamless and responsive user experience.

## Features

- 🎓 **Academic Management**: Comprehensive tools for managing courses, assignments, and schedules
- 🤖 **AI-Powered**: Intelligent recommendations and adaptive learning paths
- 📊 **Analytics Dashboard**: Track progress and performance with detailed insights
- 🎨 **Modern UI**: Beautiful, accessible interface built with shadcn-ui components
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Built-in theme support for comfortable viewing

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn-ui (Radix UI primitives)
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Testing**: Vitest with Testing Library

## Installation

### Prerequisites

- Node.js 16+ and npm (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

### Setup

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── pages/         # Page components
└── main.tsx       # Application entry point
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `npm run lint` before committing
- Write meaningful commit messages
- Add tests for new features

## Development Guidelines

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Maintain component modularity and reusability
- Write accessible markup (ARIA labels, semantic HTML)
- Ensure responsive design across all breakpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or contributions, please:
- Open an issue on GitHub
- Submit a pull request
- Contact the development team

---

Built with ❤️ using React, TypeScript, and Vite
