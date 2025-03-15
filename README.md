# Build Whatever Globe Gallery

An interactive 3D globe gallery showcasing the Build Whatever collection.

## Features

- Interactive 3D globe of images
- Smooth animations and transitions
- Click-to-zoom functionality for viewing images
- Auto-rotation when idle
- Responsive design
- Modern, minimalist UI

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd build-whatever-globe
```

2. Install dependencies:
```bash
npm install
```

3. Set up sample images:
```bash
npm run setup-images
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Technology Stack

- Next.js 14
- React 18
- Three.js
- React Three Fiber
- Framer Motion
- TypeScript
- Tailwind CSS

## Project Structure

```
build-whatever-globe/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       ├── Globe.tsx
│       └── ImageModal.tsx
├── public/
│   └── images/
├── scripts/
│   └── setup-images.js
└── package.json
```

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run setup-images` - Download sample images for testing

## License

MIT 