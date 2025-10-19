import { ActivityRankingService } from '../ActivityRankingService';
import { ActivityType, WeatherForecast } from '../../types';

describe('ActivityRankingService', () => {
    let service: ActivityRankingService;

    beforeEach(() => {
        service = new ActivityRankingService();
    });

    describe('rankActivities', () => {
        it('should rank skiing highest in cold snowy weather', () => {
            const weather: WeatherForecast = {
                date: '2024-01-15',
                temperatureMax: 2,
                temperatureMin: -5,
                precipitation: 0,
                windSpeed: 15,
                weatherCode: 71, // Snow
                weatherDescription: 'Slight snow fall',
                snowfall: 10,
            };

            const result = service.rankActivities(weather);

            expect(result).toHaveLength(4);
            expect(result[0].type).toBe(ActivityType.SKIING);
            expect(result[0].score).toBeGreaterThan(50);
            expect(result[0].recommended).toBe(true);
        });

        it('should rank outdoor sightseeing highest in clear warm weather', () => {
            const weather: WeatherForecast = {
                date: '2024-06-15',
                temperatureMax: 24,
                temperatureMin: 18,
                precipitation: 0,
                windSpeed: 10,
                weatherCode: 0, // Clear sky
                weatherDescription: 'Clear sky',
            };

            const result = service.rankActivities(weather);

            expect(result).toHaveLength(4);
            expect(result[0].type).toBe(ActivityType.OUTDOOR_SIGHTSEEING);
            expect(result[0].score).toBeGreaterThan(50);
            expect(result[0].recommended).toBe(true);
        });

        it('should rank indoor sightseeing highest in stormy weather', () => {
            const weather: WeatherForecast = {
                date: '2024-07-15',
                temperatureMax: 22,
                temperatureMin: 16,
                precipitation: 25,
                windSpeed: 45,
                weatherCode: 95, // Thunderstorm
                weatherDescription: 'Thunderstorm',
            };

            const result = service.rankActivities(weather);

            expect(result).toHaveLength(4);
            expect(result[0].type).toBe(ActivityType.INDOOR_SIGHTSEEING);
            expect(result[0].score).toBeGreaterThan(50);
            expect(result[0].recommended).toBe(true);
        });

        it('should rank surfing highly in warm weather with good winds', () => {
            const weather: WeatherForecast = {
                date: '2024-08-15',
                temperatureMax: 28,
                temperatureMin: 22,
                precipitation: 0,
                windSpeed: 25,
                weatherCode: 1, // Mainly clear
                weatherDescription: 'Mainly clear',
            };

            const result = service.rankActivities(weather);

            const surfing = result.find(a => a.type === ActivityType.SURFING);
            expect(surfing).toBeDefined();
            expect(surfing!.score).toBeGreaterThan(50);
            expect(surfing!.recommended).toBe(true);
        });

        it('should mark skiing as not recommended in warm weather', () => {
            const weather: WeatherForecast = {
                date: '2024-08-15',
                temperatureMax: 30,
                temperatureMin: 22,
                precipitation: 0,
                windSpeed: 10,
                weatherCode: 0,
                weatherDescription: 'Clear sky',
            };

            const result = service.rankActivities(weather);

            const skiing = result.find(a => a.type === ActivityType.SKIING);
            expect(skiing).toBeDefined();
            expect(skiing!.recommended).toBe(false);
        });

        it('should return all activities sorted by score', () => {
            const weather: WeatherForecast = {
                date: '2024-03-15',
                temperatureMax: 12,
                temperatureMin: 6,
                precipitation: 3,
                windSpeed: 20,
                weatherCode: 61, // Slight rain
                weatherDescription: 'Slight rain',
            };

            const result = service.rankActivities(weather);

            expect(result).toHaveLength(4);

            // Verify scores are in descending order
            for (let i = 0; i < result.length - 1; i++) {
                expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
            }

            // Verify all activities are present
            const types = result.map(a => a.type);
            expect(types).toContain(ActivityType.SKIING);
            expect(types).toContain(ActivityType.SURFING);
            expect(types).toContain(ActivityType.INDOOR_SIGHTSEEING);
            expect(types).toContain(ActivityType.OUTDOOR_SIGHTSEEING);
        });

        it('should provide meaningful reasons for rankings', () => {
            const weather: WeatherForecast = {
                date: '2024-01-15',
                temperatureMax: 2,
                temperatureMin: -5,
                precipitation: 0,
                windSpeed: 15,
                weatherCode: 71,
                weatherDescription: 'Slight snow fall',
                snowfall: 10,
            };

            const result = service.rankActivities(weather);

            result.forEach(activity => {
                expect(activity.reason).toBeTruthy();
                expect(activity.reason.length).toBeGreaterThan(0);
            });
        });

        it('should clamp scores between 0 and 100', () => {
            const extremeWeather: WeatherForecast = {
                date: '2024-01-15',
                temperatureMax: 45,
                temperatureMin: 40,
                precipitation: 50,
                windSpeed: 100,
                weatherCode: 99, // Thunderstorm with heavy hail
                weatherDescription: 'Thunderstorm with heavy hail',
            };

            const result = service.rankActivities(extremeWeather);

            result.forEach(activity => {
                expect(activity.score).toBeGreaterThanOrEqual(0);
                expect(activity.score).toBeLessThanOrEqual(100);
            });
        });
    });
});

