// City data from geocoding API
export interface City {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    admin1?: string; 
    population?: number;
}

export interface WeatherForecast {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
    snowfall?: number;
}

export interface Weather {
    city: City;
    timezone: string;
    forecasts: WeatherForecast[];
}

// Types of activities 
export enum ActivityType {
    SKIING = 'SKIING',
    SURFING = 'SURFING',
    INDOOR_SIGHTSEEING = 'INDOOR_SIGHTSEEING',
    OUTDOOR_SIGHTSEEING = 'OUTDOOR_SIGHTSEEING'
}

export interface RankedActivity {
    type: ActivityType;
    score: number;
    reason: string;
    recommended: boolean;
}

export interface ActivityRanking {
    date: string;
    weather: WeatherForecast;
    activities: RankedActivity[];
}

export interface TravelPlan {
    city: City;
    weather: Weather;
    activityRankings: ActivityRanking[];
}

// Raw API response types from Open-Meteo
export interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;
    population?: number;
}

export interface GeocodingResponse {
    results?: GeocodingResult[];
    generationtime_ms: number;
}

export interface WeatherResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        windspeed_10m_max: number[];
        weathercode: number[];
        snowfall_sum?: number[];
    };
}

// Custom error classes
export class TravelPlannerError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'TravelPlannerError';
        Object.setPrototypeOf(this, TravelPlannerError.prototype);
    }
}

export class CityNotFoundError extends TravelPlannerError {
    constructor(query: string) {
        super(`No cities found matching "${query}"`, 'CITY_NOT_FOUND', 404);
        this.name = 'CityNotFoundError';
    }
}

export class WeatherAPIError extends TravelPlannerError {
    constructor(message: string) {
        super(message, 'WEATHER_API_ERROR', 502);
        this.name = 'WeatherAPIError';
    }
}

export class ValidationError extends TravelPlannerError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}
