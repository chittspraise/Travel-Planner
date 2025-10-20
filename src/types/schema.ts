import { gql } from 'graphql-tag';

export const typeDefs = gql`
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

  type Weather{
    city: City!
    timezone: String!
     forecasts: [WeatherForecast!]!
  }

  enum  ActivityType {
     SKIING
    SURFING
    INDOOR_SIGHTSEEING
    OUTDOOR_SIGHTSEEING
  }

  type RankedActivity{
    type: ActivityType!
    score: Float!
     reason: String!
     recommended: Boolean!
  }

  type ActivityRanking {
    date: String!
    weather: WeatherForecast!
    activities: [RankedActivity!]!
  }

  type   TravelPlan {
  city: City!
    weather: Weather!
    activityRankings: [ActivityRanking!]!
  }

  type   Query{
    searchCities(query: String!, limit: Int): [City!]!
    
    getWeather (cityId: ID!, days: Int): Weather!
    
    getActivityRankings(cityId:ID!, days: Int): [ActivityRanking!]!
    getTravelPlan(cityId: ID!, days Int): TravelPlan!
  }
`;
