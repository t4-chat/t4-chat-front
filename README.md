# AI Vibe Frontend

A modern, responsive chat application built with React 19 and TypeScript. AI Vibe provides a seamless messaging experience with Google OAuth authentication, real-time features, and a beautiful user interface.

## 🎬 Demo Video

**[🎥 Watch Our Demo Video](https://youtu.be/l3B9tGeLSQg)** - See AI Vibe API in action!


## 🛠️ Tech Stack

### Core
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd t4-chat-front https://github.com/t4-chat/t4-chat-front
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your environment variables:
```env
VITE_REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_REACT_APP_API_URL=url
# Add other environment variables as needed
```

### 4. Start the development server
```bash
npm run start:4200
```

The application will be available at `http://localhost:4200`

## 📜 Available Scripts

### Development
- `npm start` - Start development server on default port
- `npm run start:4200` - Start development server on port 4200
- `npm run preview` - Preview production build locally

### Building
- `npm run build` - Build the app for production
- `npm run generate-api` - Generate API client from OpenAPI spec

### Code Quality
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix auto-fixable linting errors
- `npm run lint:fix-unsafe` - Fix with unsafe transformations
- `npm run format` - Format code with Biome

### Testing
- `npm test` - Run tests with Vitest

## 🐳 Docker Deployment

### Build and run with Docker
```bash
# Build the Docker image
docker build -t t4-chat-frontend .

# Run the container
docker run -p 80:80 t4-chat-frontend
```

### Using Docker Compose
```bash
docker-compose up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and formatting (`npm run lint:fix && npm run format`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use the established folder structure
- Write meaningful commit messages
- Ensure all linting passes before committing
- Add proper TypeScript types for new features
- Test your changes thoroughly

## 🔗 Related Documentation

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com/)

## 📄 License

This project is private and proprietary.

## 🐛 Issues & Support

If you encounter any issues or need support, please check the existing issues or create a new one in the project repository.


## 🤝 Team

Built with passion for the T3 ChatCloneathon by our amazing team! 
* avdieiev.oleksii@gmail.com
* stepun.tita@gmail.com
* pxlxpenko@gmail.com
* ostashko4@gmail.com

## 📱 Follow Us

Stay connected and follow our journey:

* **Instagram:** [ai_viiibe](https://www.instagram.com/ai_viiibe/)
* **X (Twitter):** [@ai_viiibe](https://x.com/ai_viiibe)
* **Telegram:** [ai_viiibe](https://t.me/ai_viiibe)

---

Built with ❤️ 