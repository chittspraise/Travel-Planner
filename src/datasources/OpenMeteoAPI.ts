import axios from "axios";
import { config } from "../config";
import {
  City,
  GeocodingResponse,
  WeatherResponse,
  WeatherAPIError,
  CityNotFoundError,
} from "../types";

/**
 * Wrapper around Open-Meteo API
 * Handles fetching city info and weather data.
 * Open-Meteo is great because it's free and doesn’t need an API key.
 */
export class OpenMeteoAPI {
  private geoClient;
  private weatherClient;

  constructor() {
    // Set up two axios clients — one for cities, one for weather
    this.geoClient = axios.create({
      baseURL: config.openMeteo.geocodingUrl,
      timeout: config.api.requestTimeout,
    });

    this.weatherClient = axios.create({
      baseURL: config.openMeteo.weatherUrl,
      timeout: config.api.requestTimeout,
    });
  }

  /**
   * Search for cities by name
   * Example: "Paris" → returns list of matching cities with coordinates.
   */
  async searchCities(query: string, limit = 10): Promise<City[]> {
    try {
      const res = await this.geoClient.get<GeocodingResponse>("/search", {
        params: {
          name: query,
          count: limit,
          language: "en",
          format: "json",
        },
      });

      // if no cities found, throw custom error
      if (!res.data.results || res.data.results.length === 0) {
        throw new CityNotFoundError(query);
      }

      // Map API data to our City format
      return res.data.results.map((item) => this.formatCity(item));
    } catch (err: any) {
      // If it’s our custom "not found" error, just pass it through
      if (err instanceof CityNotFoundError) throw err;

      // Otherwise wrap axios/network errors
      if (axios.isAxiosError(err)) {
        throw new WeatherAPIError(`City search failed: ${err.message}`);
      }

      // Unknown/unexpected error
      throw err;
    }
  }

  /**
   * Turn an ID (like "48.85_2.35") back into a City object
   */
  async getCityById(id: string): Promise<City> {
    const [latStr, lonStr] = id.split("_");

    if (!latStr || !lonStr) {
      throw new WeatherAPIError(
        `Bad city ID format: ${id}. Expected "latitude_longitude"`
      );
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    // check if numbers make sense
    if (isNaN(lat) || isNaN(lon)) {
      throw new WeatherAPIError(`Invalid coords in ID: ${id}`);
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new WeatherAPIError(`Coordinates out of valid range: ${id}`);
    }

    // Return a simple City object — name not included (comes from search)
    return {
      id,
      name: `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`,
      country: "",
      countryCode: "",
      latitude: lat,
      longitude: lon,
    };
  }

  /**
   * Get weather forecast for a given location.
   * Default: next 7 days.
   */
  async getWeatherForecast(
    lat: number,
    lon: number,
    days = 7
  ): Promise<WeatherResponse> {
    try {
      const res = await this.weatherClient.get<WeatherResponse>("/forecast", {
        params: {
          latitude: lat,
          longitude: lon,
          daily: [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "windspeed_10m_max",
            "weathercode",
            "snowfall_sum",
          ].join(","),
          timezone: "auto",
          forecast_days: days,
        },
      });

      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        throw new WeatherAPIError(`Weather fetch failed: ${err.message}`);
      }
      throw err;
    }
  }

  /**
   * Format the raw geocoding result into a City object
   */
  private formatCity(raw: any): City {
    return {
      id: `${raw.latitude}_${raw.longitude}`,
      name: raw.name,
      country: raw.country || "",
      countryCode: raw.country_code || "",
      latitude: raw.latitude,
      longitude: raw.longitude,
      admin1: raw.admin1 || "",
      population: raw.population || 0,
    };
  }
}

export default OpenMeteoAPI;
