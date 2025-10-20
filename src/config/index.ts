import dotenv from 'dotenv';

dotenv.config();
export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  openMeteo: {
      geocodingUrl: process.env.OPENMETEO_GEOCODING_URL || 
      'https://geocoding-api.open-meteo.com/v1',
    weatherUrl: process.env.OPENMETEO_WEATHER_URL || 
    'https://api.open-meteo.com/v1',
  },

  api: {
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '5000', 10),
    maxCitySuggestions: parseInt(process.env.MAX_CITY_SUGGESTIONS || '10', 10),
  maxForecastDays: 16, // API limit
     defaultForecastDays: 7 ,
  },
} as const ;

export default config
