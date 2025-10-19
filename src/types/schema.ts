import { gql } from 'graphql-tag';


// GraphQL schema definition for city, weather, and activity planning

export const typeDefs = gql`
  # Represents a city and its basic details
 
  type City {
    id: ID!
    name: String!
    country: String!
    countryCode: String!
    latitude: Float!
    longitude: Float!
    admin1: String
    population: Int
  }

  # A single day’s weather forecast
 
 
  type WeatherForecast {
    date: String!
    temperatureMax: Float!
    temperatureMin: Float!
    precipitation: Float!
    windSpeed: Float!
    weatherCode: Int!
    weatherDescription: String!
    snowfall: Float
  }

  # Weather info for a specific city including forecast data
  type Weather {
    city: City!
    timezone: String!
    forecasts: [WeatherForecast!]!
  }

  # Possible activity types
  enum ActivityType {
    SKIING
    SURFING
    INDOOR_SIGHTSEEING
    OUTDOOR_SIGHTSEEING
  }

  # Describes how suitable a certain activity is based on weather
  type RankedActivity {
    type: ActivityType!
    score: Float!              # 0 to 100
    reason: String!           # Why it’s ranked that way
    recommended: Boolean!    # true if the activity is a good choice
  }

  # Ranking of all activities for a specific date
  type ActivityRanking {
    date: String!
    weather: WeatherForecast!
    activities: [RankedActivity!]!
  }

  # Combines city, weather, and recommended activities
  type TravelPlan {
    city: City!
    weather: Weather!
    activityRankings: [ActivityRanking!]!
  }

  # Root queries available in the API
  type Query {
    # Search for cities by name (partial or full)
    searchCities(
      query: String!           # City name to search for
      limit: Int               # Max results (default 10, max 50)
    ): [City!]!

  # Get weather forecast for a specific city
    getWeather(
      cityId: ID!              # City ID
      days: Int                # Number of days (default 7, max 16)
    ): Weather!

     # Get ranked activities based on weather conditions
    getActivityRankings(
      cityId: ID!
      days: Int
    ): [ActivityRanking!]!

    # Get a full travel plan including weather + activity suggestions
    getTravelPlan(
      cityId: ID!
      days: Int
    ): TravelPlan!
  }
`;
