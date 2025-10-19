# 🌍 Travel Planner API

A smart GraphQL API for planning trips with weather-based activity recommendations. Built with TypeScript and Apollo Server.

> **Perfect for:** Travel apps, trip planning tools, activity recommendation systems, and weather-based decision making.

## 📋 What it Does

This API helps you plan the perfect trip by:

- 🔍 **Search for cities** around the world with autocomplete
- 🌤️ **Get weather forecasts** for up to 16 days ahead
- 🎯 **Get smart activity recommendations** based on real-time weather conditions
  - Skiing 🎿
  - Surfing 🏄
  - Indoor Sightseeing 🏛️
  - Outdoor Sightseeing 🗺️
- 🚀 **All through a single GraphQL endpoint** - easy to integrate!

## 🛠️ Tech Stack

- **Node.js + TypeScript** - Type-safe backend
- **Apollo Server** - GraphQL server
- **Axios** - HTTP client for API calls
- **Jest** - Testing framework
- **Open-Meteo API** - Weather data (free, no API key needed! 🎉)

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn**

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/chittspraise/Travel-Planner.git
cd Travel-Planner

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

✅ Server will be running at `http://localhost:4000`

🎮 Open `http://localhost:4000` in your browser to access the **GraphQL Playground**!

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🔥 Start development server with hot reload |
| `npm run build` | 📦 Build for production |
| `npm start` | ▶️ Start production server |
| `npm test` | 🧪 Run all tests |
| `npm run test:watch` | 👀 Run tests in watch mode |
| `npm test -- --coverage` | 📊 Run tests with coverage report |
| `npm run lint` | 🔍 Run ESLint to check code quality |
| `npm run format` | ✨ Format code with Prettier |

## 📖 API Usage

### GraphQL Playground

Once the server is running, open `http://localhost:4000` in your browser to access the Apollo Sandbox.

### Example Queries

📝 **See `examples.graphql` for a complete collection of ready-to-use queries!**

The `examples.graphql` file contains:
- All query types with variations
- Sample city IDs for popular destinations
- Complete workflow examples
- Activity-specific queries

Copy any query from that file and paste it directly into Apollo Sandbox.

#### 1. Search for Cities

```graphql
query SearchCities {
  searchCities(query: "London", limit: 5) {
    id
    name
    country
    countryCode
    latitude
    longitude
    population
  }
}
```

#### 2. Get Weather Forecast

```graphql
query GetWeather {
  getWeather(cityId: "51.5074_-0.1278", days: 7) {
    city {
      name
      country
    }
    timezone
    forecasts {
      date
      temperatureMax
      temperatureMin
      precipitation
      windSpeed
      weatherDescription
      snowfall
    }
  }
}
```

#### 3. Get Activity Rankings

```graphql
query GetActivityRankings {
  getActivityRankings(cityId: "51.5074_-0.1278", days: 7) {
    date
    weather {
      weatherDescription
      temperatureMax
      temperatureMin
    }
    activities {
      type
      score
      reason
      recommended
    }
  }
}
```

#### 4. Get Complete Travel Plan

```graphql
query GetTravelPlan {
  getTravelPlan(cityId: "51.5074_-0.1278", days: 7) {
    city {
      name
      country
    }
    weather {
      timezone
      forecasts {
        date
        weatherDescription
        temperatureMax
        temperatureMin
      }
    }
    activityRankings {
      date
      activities {
        type
        score
        reason
        recommended
      }
    }
  }
}
```

## Activity Ranking System

The API ranks activities based on weather conditions using a sophisticated scoring algorithm:

### Skiing 🎿
- **Ideal**: Cold temperatures (-10°C to 5°C), fresh snow, calm winds
- **Factors**: Temperature, snowfall, wind speed, visibility
- **Score Range**: 0-100 (recommended if ≥50)

### Surfing 🏄
- **Ideal**: Warm temperatures (>20°C), moderate winds (15-35 km/h)
- **Factors**: Temperature, wind speed, precipitation, storms
- **Score Range**: 0-100 (recommended if ≥50)

### Indoor Sightseeing 🏛️
- **Ideal**: Bad weather outside (rain, storms, extreme temperatures)
- **Factors**: Weather conditions, temperature extremes, wind
- **Score Range**: 0-100 (always viable, recommended if ≥50)

### Outdoor Sightseeing 🗺️
- **Ideal**: Clear skies, mild temperatures (15-25°C), low precipitation
- **Factors**: Weather clarity, temperature, precipitation, wind
- **Score Range**: 0-100 (recommended if ≥50)

## 📁 Project Structure

```
Travel-Planner/
├── src/
│   ├── config/           # ⚙️  Configuration management
│   ├── datasources/      # 🌐 Data sources (OpenMeteo API integration)
│   │   └── __tests__/    # Unit tests for data sources
│   ├── resolvers/        # 🔗 GraphQL resolvers (query implementations)
│   ├── services/         # 💼 Business logic (activity ranking algorithms)
│   │   └── __tests__/    # Unit tests for services
│   ├── types/            # 📝 TypeScript types and GraphQL schema
│   ├── utils/            # 🔧 Utility functions (weather codes, etc.)
│   │   └── __tests__/    # Unit tests for utilities
│   └── index.ts          # 🚀 Server entry point
├── coverage/             # 📊 Test coverage reports (generated)
├── dist/                 # 📦 Compiled JavaScript (generated)
├── examples.graphql      # 📚 Example queries for testing
├── jest.config.js        # 🧪 Jest testing configuration
├── tsconfig.json         # 🔷 TypeScript configuration
├── .eslintrc.js          # 📏 ESLint code quality rules
├── .gitignore            # 🚫 Git ignore patterns
└── package.json          # 📦 Dependencies and scripts
```

## 🔐 Environment Variables

All environment variables have sensible defaults and are **optional**. The API works out of the box without any configuration!

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port number |
| `NODE_ENV` | `development` | Environment mode (`development` or `production`) |
| `REQUEST_TIMEOUT` | `5000` | API request timeout in milliseconds |
| `MAX_CITY_SUGGESTIONS` | `10` | Maximum city search results to return |
| `OPENMETEO_GEOCODING_URL` | `https://geocoding-api.openmeteo.com/v1` | Geocoding API base URL |
| `OPENMETEO_WEATHER_URL` | `https://api.open-meteo.com/v1` | Weather API base URL |

💡 **Tip:** You can create a `.env` file in the root directory to customize these values (check `.env.example` if needed).

## ⚡ API Limits

- **City Search**: Up to 50 results per query (default: 10)
- **Weather Forecast**: Up to 16 days (default: 7)
- **Request Timeout**: 5 seconds

## ⚠️ Error Handling

The API provides clear, actionable error messages with appropriate GraphQL error extensions:

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `CITY_NOT_FOUND` | 404 | The requested city wasn't found |
| `WEATHER_API_ERROR` | 502 | External weather API error |
| `VALIDATION_ERROR` | 400 | Invalid input parameters |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## 🧪 Testing

The project includes comprehensive unit tests for all core functionality.

```bash
# Run all tests
npm test

# Run tests in watch mode (great for development)
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

✅ **Test Coverage:** The project maintains >70% code coverage across all metrics.

## 🔍 How It Works

1. **Weather Data:** Uses the [Open-Meteo API](https://open-meteo.com/) - a free, open-source weather API with no API key required
2. **Activity Ranking:** Smart scoring algorithm evaluates weather conditions against ideal parameters for each activity
3. **GraphQL:** Clean, type-safe API with excellent developer experience via Apollo Server

## 🚧 Future Improvements

Ideas for enhancement (contributions welcome!):

- [ ] Add Redis caching for improved performance
- [ ] Implement rate limiting for production use
- [ ] More activity types (hiking, beach days, photography, etc.)
- [ ] User preference profiles
- [ ] Integration with booking/reservation APIs
- [ ] Historical weather data analysis
- [ ] Mobile push notifications for weather changes

## 👥 Contributing

This is a team project! If you want to contribute:

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes and write tests
3. Run tests and linting: `npm test && npm run lint`
4. Commit with clear messages: `git commit -m "Add: your feature description"`
5. Push and create a Pull Request

## 📄 License

MIT

---

**Made with ❤️ for better travel planning**
