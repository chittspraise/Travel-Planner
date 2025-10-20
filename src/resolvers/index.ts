import {
  City,
  Weather,
  WeatherForecast,
  ActivityRanking,
  TravelPlan,
  ValidationError,
} from '../types';
import { OpenMeteoAPI } from '../datasources/OpenMeteoAPI';
import { ActivityRankingService } from '../services/ActivityRankingService';
import { getWeatherDescription } from '../utils/weatherCodes';
import { config } from '../config';

export interface Context {
  dataSources: {
    openMeteoAPI: OpenMeteoAPI;
    activityRankingService: ActivityRankingService;
  };
}

export const resolvers = {
  Query: {
    searchCities: async (_: unknown,
      { query, limit = 10 }: { query: string; limit?: number },
      { dataSources }: Context
    ): Promise<City[]> => {
      
      if (!query || query.trim().length < 2) {
        throw new ValidationError('Search query must be at least 2 characters');
      }
      const validLimit = Math.min(Math.max(1, limit), config.api.maxCitySuggestions);
      return dataSources.openMeteoAPI.searchCities(query.trim(), validLimit);
    },

       getWeather: async ( _: unknown,
      { cityId, days = 7 }: { cityId: string; days?: number },
      { dataSources }: Context
    ): Promise<Weather> => {
      const validDays = Math.min(
        Math.max(1, days),
        config.api.maxForecastDays
      );

      const city = await dataSources.openMeteoAPI.getCityById(cityId);
      const weatherData = await dataSources.openMeteoAPI.getWeatherForecast(
        city.latitude,
        city.longitude,
        validDays
      );

      
      const forecasts: WeatherForecast[] = weatherData.daily.time.map(
        (date, index) => ({
          date,
          temperatureMax: weatherData.daily.temperature_2m_max[index],
          temperatureMin: weatherData.daily.temperature_2m_min[index],
          precipitation: weatherData.daily.precipitation_sum[index],
          windSpeed: weatherData.daily.windspeed_10m_max[index],
          weatherCode: weatherData.daily.weathercode[index],
          weatherDescription: getWeatherDescription(
            weatherData.daily.weathercode[index]
          ),
          snowfall: weatherData.daily.snowfall_sum?.[index],
        })
      );

      return {
        city,
        timezone: weatherData.timezone,
        forecasts,
      };
    },

    getActivityRankings: async (
      _: unknown,
      { cityId, days = 7 }: { cityId: string; days?: number },
    { dataSources }: Context
    ):  Promise<ActivityRanking[]> => {
      const validDays = Math.min(
         Math.max(1, days),
        config.api.maxForecastDays
      );

      const city = await dataSources.openMeteoAPI.getCityById(cityId);
      const weatherData = await dataSources.openMeteoAPI.getWeatherForecast(
        city.latitude,
        city.longitude,
        validDays
      );

      const activityRankings: ActivityRanking[] = weatherData.daily.time.map(
        (date, index) => {
          const weather: WeatherForecast = {
            date,
            temperatureMax: weatherData.daily.temperature_2m_max[index],
            temperatureMin: weatherData.daily.temperature_2m_min[index],
            
            precipitation: weatherData.daily.precipitation_sum[index],
           
            windSpeed: weatherData.daily.windspeed_10m_max[index],
           
            weatherCode: weatherData.daily.weathercode[index],

            weatherDescription: getWeatherDescription(
              weatherData.daily.weathercode[index]
            ),
            snowfall: weatherData.daily.snowfall_sum?.[index],
          };

          const activities = dataSources.activityRankingService.rankActivities(
            weather
          );

          return {
            date,
            weather,
            activities,
          };
        }
      );

      return activityRankings
    },

    getTravelPlan: async (
      _: unknown,
      { cityId, days = 7 }: { cityId: string; days?: number },
      { dataSources }: Context
    ): Promise<TravelPlan> => {
      const validDays = Math.min(
        Math.max(1, days),
        config.api.maxForecastDays
      );

      const city = await dataSources.openMeteoAPI.getCityById(cityId);
      const weatherData = await dataSources.openMeteoAPI.getWeatherForecast(
        city.latitude,
        city.longitude,
        validDays
      );

      const forecasts: WeatherForecast[] = weatherData.daily.time.map(
        (date, index) => ({
          date,
          temperatureMax: weatherData.daily.temperature_2m_max[index],
          temperatureMin: weatherData.daily.temperature_2m_min[index],
          precipitation: weatherData.daily.precipitation_sum[index],
          windSpeed: weatherData.daily.windspeed_10m_max[index],
          weatherCode: weatherData.daily.weathercode[index],
          weatherDescription: getWeatherDescription(
            weatherData.daily.weathercode[index]
          ),
          snowfall: weatherData.daily.snowfall_sum?.[index],
        })
      )

      const weather: Weather = {
        city,
          timezone: weatherData.timezone,
        forecasts,
      };

      const activityRankings: ActivityRanking[] = forecasts.map((forecast) => {
           const activities = dataSources.activityRankingService.rankActivities(
          forecast
        );

        return {
          date: forecast.date,
            weather: forecast,
          activities
        };
      });

      return {
        city,
        weather,
        activityRankings
      };
    },
  },
};

export default resolvers;
