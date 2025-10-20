import axios from "axios";
import { config } from "../config";
import {
  City,
  GeocodingResponse,
  WeatherResponse,
  WeatherAPIError,
  CityNotFoundError,
} from "../types";

interface RawGeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
}

export class OpenMeteoAPI {
  private geoClient;
   private weatherClient;

  constructor() {
    this.geoClient = axios.create({
      baseURL: config.openMeteo.geocodingUrl,
      timeout: config.api.requestTimeout,
    });

    this.weatherClient = axios.create({
      baseURL: config.openMeteo.weatherUrl,
      timeout: config.api.requestTimeout,
    });
  }

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

      if (!res.data.results || res.data.results.length === 0) {
          throw new CityNotFoundError(query);
      }

      return res.data.results.map((item) => this.formatCity(item));
    } catch (err: unknown) {
      if (err instanceof CityNotFoundError) throw err;

      if (axios.isAxiosError(err)) {
        throw new WeatherAPIError(`City search failed: ${err.message}`);
      }
      throw err;
    }
  }

  async getCityById(id: string): Promise<City> {
    const [latStr, lonStr] = id.split("_");

    if (!latStr || !lonStr) {
      throw new WeatherAPIError(
        `Bad city ID format: ${id}. Expected "latitude_longitude"`
      );
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      throw new WeatherAPIError(`Invalid coords in ID: ${id}`);
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new WeatherAPIError(`Coordinates out of valid range: ${id}`);
    }
    
    return {
      id,
      name: `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`,
      country: "",
      countryCode: "",
      latitude: lat,
      longitude: lon,
    };
  }

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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw new WeatherAPIError(`Weather fetch failed: ${err.message}`);
      }
      throw err;
    }
  }

  private formatCity(raw: RawGeocodingResult): City {
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
