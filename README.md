# Travel-Planner API

A GraphQL API that provides weather-based activity recommendations for travel planning. Built with TypeScript, Apollo Server, and Open-Meteo API.

## Quick Start

``` bash
npm install
npm run dev
```

The server starts at `http://localhost:4000` with GraphQL Playground enabled.

## What It Does

This API enables travel planning by combining real-time weather data with activity recommendations:

- **City Search**: Autocomplete search powered by Open-Meteo's geocoding API
- **Weather Forecasts**: Up to 16-day forecasts for any location
- **Activity Rankings**: Intelligent scoring system that ranks activities based on weather conditions
  - Skiing
  - Surfing
  - Indoor sightseeing
  - Outdoor sightseeing

## Architecture

The codebase follows a layered architecture pattern:

```
src/
├── datasources/     - External API integration (Open-Meteo)
├── services/        - Business logic (activity scoring algorithms)
├── resolvers/       - GraphQL query handlers
├── types/           - TypeScript interfaces & GraphQL schema
├── utils/           - Shared utilities (weather code mappings)
└── config/          - Configuration management
```

**Key Design Decisions:**

- **DataSource Pattern**: Encapsulates all Open-Meteo API calls in a dedicated class for easy mocking and testing
- **Service Layer**: Activity ranking logic is isolated from GraphQL concerns, making it reusable
- **Type Safety**: Shared TypeScript types between resolvers and services prevent runtime errors
Fully Typed (TypeScript-ready): Improves maintainability and safety.

## API Examples

See `examples.graphql` for complete query examples. Basic usage:

### Search Cities

```graphql
uery {
   searchCities(query: "johannesburg", limit: 5) {
    id
    name
    country
    latitude
    longitude
  }
}
```

### Get Weather Forecast

```graphql
query {
  getWeather(cityId: "35.6762_139.6503", days: 7) {
    city {
      name
      country
    }
    timezone
    forecasts {
      date
      temperatureMax
      temperatureMin
      weatherDescription
      precipitation
      windSpeed
    }
  }
}
```

# ## Get Activity Rankings

```graphql
query {
  getActivityRankings(cityId: "35.6762_139.6503") {
    date
    activities {
      type
      score
      reason
      recommended
    }
  }
}
```

### Get Complete Travel Plan

```graphql
query {
  getTravelPlan(cityId: "-26.20227_28.04363", days: 7) {
    city {
      name
    }
    weather {
      forecasts {
        date
        weatherDescription
      }
    }
    activityRankings {
      date
      activities {
        type
        score
        recommended
      }
    }
  }
}
```

## Activity Scoring System

Each activity is scored 0-100 based on weather conditions. Activities with scores >= 50 are marked as recommended.

**Skiing**: Optimal in cold temperatures (-10°C to 5°C), requires snowfall, penalized by rain and high winds

**Surfing**: Prefers warm temperatures (>20°C), moderate winds (15-35 km/h) for waves, heavily penalized by storms

**Indoor Sightseeing**: Base score of 50 (always viable), increases with poor outdoor conditions

**Outdoor Sightseeing**: Optimal at 15-25°C with clear skies, heavily penalized by precipitation and storms

## Testing

```bash
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode for development
```

Test suite covers:

- OpenMeteo API wrapper (integration with external API)
- Activity ranking algorithms (core business logic)
- Weather code utilities

**Current Coverage: 77.7%**

The main gap is resolver tests (0% coverage). See trade-offs section below.

## Configuration

All configuration uses environment variables with sensible defaults:

```
PORT=4000
NODE_ENV=development
REQUEST_TIMEOUT=5000
MAX_CITY_SUGGESTIONS=10
```

Optional: Create a `.env` file to override defaults.

## Available Commands

```bash
npm run dev          
npm run build        
npm start            
npm test             
npm run lint        
```

## Trade-offs & Omissions

Given the 2-3 hour time constraint, I prioritized core functionality over nice-to-haves:

### No Caching

Weather data changes slowly (hourly updates at most), making it ideal for caching. In production I'd add:

- Redis for API response caching (TTL: 30-60 minutes)
- Significant performance improvement and reduced API calls
- Estimated implementation time: 1-2 hours

### Basic Activity Scoring

Current implementation uses rule-based scoring with hardcoded weights. Future improvements:

- Machine learning model trained on historical weather/activity data
- User preference profiles (some people prefer cold weather skiing)
- More granular scoring (consider UV index, visibility, etc.)

### No Resolver Integration Tests

Resolvers have 0% coverage. This was intentional:

- Time was better spent testing business logic (services, datasources)
-  Resolvers are thin layers that mostly pass data through
- Integration tests require more setup (Apollo server instance, context mocking)
-   Core algorithms ARE tested where actual logic lives

For production, I'd add integration tests using Apollo's executeOperation method.

### Limited Error Handling

Current implementation handles common cases but lacks:

- Retry logic for transient network failures
- Circuit breaker pattern for API resilience
- Rate limiting protection
- Detailed error logging/monitoring

### Security Considerations

Not implemented due to time constraints:

- No authentication/authorization (required for multi-user scenarios)
- No input sanitization beyond basic validation
- No rate limiting per user/IP

## Future Enhancements

If I had more time or for production deployment:

1. **Caching Layer** - Redis integration for API responses
2. **More Activities** - Hiking, beach days, photography, cycling
3. **Personalization** - User profiles with activity preferences
4. **Historical Data** - "Best time to visit" based on past weather patterns
5. **Monitoring** - Structured logging, error tracking, performance metrics
6. **GraphQL Subscriptions** - Real-time weather alerts
7. **API Documentation** - Auto-generated docs from schema

## Development Notes

**Why Open-Meteo?**

- Free tier with no API key required
- Good documentation and reliable uptime
- Provides both geocoding and weather data ,good with axios 

**Why GraphQL?**

- Flexible querying (clients request exactly what they need)
- Strong typing with schema validation
- Single endpoint reduces complexity

**Use of AI Tools**
I used GitHub Copilot for:

- Boilerplate code (server setup, type definitions)
- Test scaffolding and mock data
- Repetitive implementations

I manually designed and implemented:

- Activity ranking algorithm and scoring weights
- Architecture and separation of concerns
- Error handling strategy
- Trade-off decisions based on time constraints

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **GraphQL Server**: Apollo Server 4
- **HTTP Client**: Axios
- **Testing**: Jest
- **Data Source**: Open-Meteo API

Reflection:
I focused on building a clean, testable backend with clear separation of data and logic.
While the features are simple, the structure is production-ready and designed for easy growth — caching, personalization, or analytics could be added with minimal refactoring.

## License

MIT
