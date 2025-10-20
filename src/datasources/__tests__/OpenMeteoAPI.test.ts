import { OpenMeteoAPI } from '../OpenMeteoAPI';
import axios, { AxiosInstance } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenMeteoAPI', () => {
    let api: OpenMeteoAPI;

    beforeEach(() => {
        api = new OpenMeteoAPI();
        jest.clearAllMocks();
    });

    describe('searchCities', () => {
        it('should return cities when search is successful', async () => {
            const mockResponse = {
                data: {
                    results: [
                        {
                            id: 2643743,
                            name: 'London',
                            latitude: 51.5074,
                            longitude: -0.1278,
                            country: 'United Kingdom',
                            country_code: 'GB',
                            admin1: 'England',
                            population: 8961989,
                        },
                    ],
                    generationtime_ms: 0.5,
                },
            };

            mockedAxios.create.mockReturnValue({
                get: jest.fn().mockResolvedValue(mockResponse),
            } as Partial<AxiosInstance> as AxiosInstance);

            api = new OpenMeteoAPI();
            const result = await api.searchCities('London');

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                name: 'London',
                country: 'United Kingdom',
                countryCode: 'GB',
                latitude: 51.5074,
                longitude: -0.1278,
                admin1: 'England',
                population: 8961989,
            });
            expect(result[0].id).toBe('51.5074_-0.1278');
        });

        it('should throw CityNotFoundError when no results found', async () => {
            const mockResponse = {
                data: {
                    results: [],
                    generationtime_ms: 0.5,
                },
            };

            mockedAxios.create.mockReturnValue({
                get: jest.fn().mockResolvedValue(mockResponse),
            } as Partial<AxiosInstance> as AxiosInstance);

            api = new OpenMeteoAPI();

            await expect(api.searchCities('NonexistentCity')).rejects.toThrow(
                'No cities found matching "NonexistentCity"'
            );
        });

        it('should throw WeatherAPIError on network error', async () => {
            mockedAxios.create.mockReturnValue({
                get: jest.fn().mockRejectedValue(new Error('Network Error')),
            } as Partial<AxiosInstance> as AxiosInstance);

            api = new OpenMeteoAPI();

            await expect(api.searchCities('London')).rejects.toThrow();
        });

        it('should respect limit parameter', async () => {
            const mockGet = jest.fn().mockResolvedValue({
                data: {
                    results: [],
                    generationtime_ms: 0.5,
                },
            });

            mockedAxios.create.mockReturnValue({
                get: mockGet,
            } as Partial<AxiosInstance> as AxiosInstance);

             api = new OpenMeteoAPI();

            try{
                await api.searchCities('London', 5);
            }catch (error) {
                // Ignore CityNotFoundError
            }

            expect(mockGet).toHaveBeenCalledWith('/search', {
                params: expect.objectContaining({
                    count: 5,
                }),
            });
        });
    });

    describe('getCityById', () => {
        it('should return city for valid ID', async () => {
            const result = await api.getCityById('51.5074_-0.1278');

            expect(result.latitude).toBe(51.5074);
            expect(result.longitude).toBe(-0.1278);
            expect(result.id).toBe('51.5074_-0.1278');
            expect(result.name).toContain('Lat 51');
        });

        it('should throw error for invalid ID format', async () => {
            await expect(api.getCityById('invalid')).rejects.toThrow('Bad city ID format');
        });

        it('should parse coordinates from city ID', async () => {
            const result = await api.getCityById('40.7128_-74.0060');

            expect(result.latitude).toBe(40.7128);
            expect(result.longitude).toBe(-74.0060);
            expect(result.id).toBe('40.7128_-74.0060');
        });
    });

    describe('getWeatherForecast', () => {
        it('should return weather forecast data', async () => {
            const mockResponse = {
                data: {
                     latitude: 51.5 ,
                    longitude: -0.12,
                     timezone: 'Europe/London' ,
                        timezone_abbreviation: 'GMT',
                     daily: {
                         time: ['2024-01-15', '2024-01-16'],
                    temperature_2m_max: [12.5, 13.2],
                     temperature_2m_min: [6.3, 7.1],
                        precipitation_sum: [0.2, 0.0],
                     windspeed_10m_max: [15.5, 18.2] ,
                      weathercode: [1, 0],
                        snowfall_sum: [0, 0] ,
                    },
                },
            };

            mockedAxios.create.mockReturnValue({
                get: jest.fn().mockResolvedValue(mockResponse) ,
            } as Partial<AxiosInstance> as AxiosInstance);

            api = new OpenMeteoAPI();
            const result = await api.getWeatherForecast(51.5, -0.12, 2);

            expect(result).toMatchObject({
                latitude: 51.5,
                longitude: -0.12,
                timezone: 'Europe/London',
            });
            expect(result.daily.time).toHaveLength(2);
            expect(result.daily.temperature_2m_max).toHaveLength(2);
        });

        it('should throw WeatherAPIError on network error', async () => {
            mockedAxios.create.mockReturnValue({
                get: jest.fn().mockRejectedValue(new Error('Network Error')),
            } as Partial<AxiosInstance> as AxiosInstance);

            api = new OpenMeteoAPI();

            await expect(api.getWeatherForecast(51.5, -0.12, 7)).rejects.toThrow();
        });

        it('should use default days parameter', async () => {
            const mockGet = jest.fn().mockResolvedValue({
                data: {
                    latitude: 51.5,
                    longitude: -0.12,
                    timezone: 'Europe/London',
                    daily: {
                        time: [],
                        temperature_2m_max: [],
                        temperature_2m_min: [],
                        precipitation_sum: [],
                        windspeed_10m_max: [],
                        weathercode: [],
                    },
                },
            });

            mockedAxios.create.mockReturnValue({
                get: mockGet,
            } as Partial<AxiosInstance> as AxiosInstance);

            api = new OpenMeteoAPI();
            await api.getWeatherForecast(51.5, -0.12);

            expect(mockGet).toHaveBeenCalledWith('/forecast', {
                params: expect.objectContaining({
                    forecast_days: 7,
                }),
            });
        });
    });
});

