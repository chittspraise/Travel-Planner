# Travel Planner API

GraphQL API for planning trips with weather-based activity recommendations. Built with TypeScript and Apollo Server.

## What it does

- Search for cities around the world
- Get weather forecasts (up to 16 days)
- Get activity recommendations based on weather (skiing, surfing, sightseeing)
- All through a single GraphQL endpoint

## Tech Stack

- Node.js + TypeScript
- Apollo Server (GraphQL)
- Axios for API calls
- Jest for testing
- Open-Meteo API (free, no key needed)

## Getting Started

### Setup

Requirements: Node.js 18+

```bash
# install dependencies
npm install

# run dev server
npm run dev
```

Server runs at `http://localhost:4000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Usage

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

## Project Structure

```
travel-planner-api/
├── src/
│   ├── config/           # Configuration management
│   ├── datasources/      # Data sources (OpenMeteo API)
│   ├── resolvers/        # GraphQL resolvers
│   ├── services/         # Business logic (activity ranking)
│   ├── types/            # TypeScript types and GraphQL schema
│   ├── utils/            # Utility functions
│   └── index.ts          # Server entry point
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Environment variables template
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `REQUEST_TIMEOUT` | `5000` | API request timeout (ms) |
| `MAX_CITY_SUGGESTIONS` | `10` | Max city search results |
| `OPENMETEO_GEOCODING_URL` | `https://geocoding-api.openmeteo.com/v1` | Geocoding API URL |
| `OPENMETEO_WEATHER_URL` | `https://api.open-meteo.com/v1` | Weather API URL |

## API Limits

- **City Search**: Up to 50 results per query (default: 10)
- **Weather Forecast**: Up to 16 days (default: 7)
- **Request Timeout**: 5 seconds

## Error Handling

The API provides clear error messages with appropriate status codes:

- `CITY_NOT_FOUND` (404) - City not found in search
- `WEATHER_API_ERROR` (502) - External API error
- `VALIDATION_ERROR` (400) - Invalid input parameters
- `INTERNAL_SERVER_ERROR` (500) - Unexpected errors

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

The project maintains >70% code coverage across all metrics.

## How it works

The API uses Open-Meteo for weather data (it's free and doesn't need an API key which is nice). Activity ranking is done with a simple scoring algorithm that looks at temperature, precipitation, wind, etc.

## TODO / Ideas for later

- Add caching (Redis maybe?)
- Rate limiting
- More activity types
- User preferences
- Maybe integrate with booking APIs?

## Notes

The activity scoring is pretty basic but seems to work well. Skiing gets high scores when it's cold and snowy, surfing likes warm weather with wind, etc. Could probably be improved with more data.

## License

MIT

