# Exchange Project

A comprehensive cryptocurrency exchange platform that provides real-time trading capabilities, market data visualization, and secure authentication. This project is structured in multiple parts, each focusing on different aspects of the exchange system.

## 🌟 Features

- Real-time cryptocurrency price tracking
- Live order book visualization
- Secure user authentication
- Market data aggregation
- WebSocket-based real-time updates
- Responsive and modern UI
- Proxy service for API rate limiting and caching
- Multiple trading pairs support

## 🏗️ Project Structure

### Part 1

#### Day 2

- **binance-frontend-realtime/**: Real-time trading interface with WebSocket integration
- **binance-frontend/**: Static version of the trading interface
- **exchange-proxy/**: API proxy service for rate limiting and caching
- **backend/**: Core backend services for the exchange
- **auth-service/**: Authentication and authorization service

## 🛠️ Tech Stack

### Frontend

- **Next.js**: React framework for production-grade applications
- **TypeScript**: For type-safe code
- **TailwindCSS**: For modern, utility-first styling
- **WebSocket**: For real-time data streaming
- **Chart.js/TradingView**: For financial charts

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **WebSocket**: For real-time bi-directional communication
- **JWT**: For secure authentication

### Infrastructure

- **Docker**: Application containerization
- **Kubernetes**: Container orchestration
- **Redis**: For caching and real-time data
- **PostgreSQL**: Primary database

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd exchange
   ```

2. **Start the Auth Service**

   ```bash
   cd Part-1/day-2/auth-service
   npm install
   npm run dev
   ```

3. **Launch the Backend**

   ```bash
   cd Part-1/day-2/backend
   npm install
   npm run dev
   ```

4. **Set up the Exchange Proxy**

   ```bash
   cd Part-1/day-2/exchange-proxy
   npm install
   npm run dev
   ```

5. **Run the Frontend Application**
   ```bash
   cd Part-1/day-2/binance-frontend-realtime
   npm install
   npm run dev
   ```

## 🔧 Configuration

Create a `.env` file in each service directory with the following variables:

```env
# Auth Service
JWT_SECRET=your_jwt_secret
PORT=3001

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/exchange
REDIS_URL=redis://localhost:6379

# Exchange Proxy
BINANCE_API_KEY=your_binance_api_key
RATE_LIMIT=100
```

## 📦 Docker Deployment

Build and run all services using Docker Compose:

```bash
docker-compose up --build
```

## 🔐 Security

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure WebSocket connections
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- Binance docs for architecture
- Backpack Exchange API for market data
- TradingView for charting libraries
- The open-source community for various tools and libraries used in this project

