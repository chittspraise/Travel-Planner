import {
    ActivityType,
    RankedActivity,
    WeatherForecast,
} from '../types';
import {
    isSnowy,
    isRainy,
    isClear,
    isStormy,
    isCloudy,
} from '../utils/weatherCodes';

// Activity ranking logic - scores each activity based on weather
// TODO: maybe add more activity types? (hiking, beach, etc)
export class ActivityRankingService {
    // Takes weather data and returns sorted activities with scores
    rankActivities(weather: WeatherForecast): RankedActivity[] {
        const activities = [
            this.rankSkiing(weather),
            this.rankSurfing(weather),
            this.rankIndoorSightseeing(weather),
            this.rankOutdoorSightseeing(weather),
        ];

        // Sort by score descending
        return activities.sort((a, b) => b.score - a.score);
    }

    // Skiing - needs cold temps and snow obviously
    private rankSkiing(weather: WeatherForecast): RankedActivity {
        let score = 0;
        const reasons: string[] = [];

        // temp needs to be cold for skiing
        const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
        // console.log('Skiing temp check:', avgTemp); // debug
        if (avgTemp >= -10 && avgTemp <= 5) {
            score += 40;
            reasons.push('ideal temperature for skiing');
        } else if (avgTemp > 5 && avgTemp <= 10) {
            score += 20;
            reasons.push('acceptable temperature');
        } else if (avgTemp < -10) {
            score += 15;
            reasons.push('very cold');
        } else {
            reasons.push('too warm for skiing');
        }

        // Snowfall scoring
        if (weather.snowfall && weather.snowfall > 0) {
            score += 30;
            reasons.push('fresh snow');
        } else if (isSnowy(weather.weatherCode)) {
            score += 25;
            reasons.push('snowy conditions');
        } else {
            reasons.push('no snow');
        }

        // Wind speed scoring (ideal: < 30 km/h)
        if (weather.windSpeed < 20) {
            score += 20;
            reasons.push('calm winds');
        } else if (weather.windSpeed < 40) {
            score += 10;
            reasons.push('moderate winds');
        } else {
            score -= 10;
            reasons.push('high winds');
        }

        // Precipitation penalty
        if (isRainy(weather.weatherCode)) {
            score -= 20;
            reasons.push('rainy conditions');
        }

        // Weather code bonus
        if (isClear(weather.weatherCode)) {
            score += 10;
            reasons.push('clear visibility');
        }

        return {
            type: ActivityType.SKIING,
            score: Math.max(0, Math.min(100, score)),
            reason: reasons.join(', '),
            recommended: score >= 50,
        };
    }

    // Surfing scoring - warm weather + wind but not too much
    // FIXME: should probably check ocean conditions too but API doesn't have that
    private rankSurfing(weather: WeatherForecast): RankedActivity {
        let score = 0;
        const reasons: string[] = [];

        // Temperature scoring (ideal: > 15°C)
        const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
        if (avgTemp >= 20) {
            score += 40;
            reasons.push('warm temperature');
        } else if (avgTemp >= 15) {
            score += 25;
            reasons.push('mild temperature');
        } else if (avgTemp >= 10) {
            score += 10;
            reasons.push('cool temperature');
        } else {
            reasons.push('too cold');
        }

        // Wind speed scoring (ideal: 15-35 km/h for waves)
        if (weather.windSpeed >= 15 && weather.windSpeed <= 35) {
            score += 30;
            reasons.push('good wind for waves');
        } else if (weather.windSpeed > 35 && weather.windSpeed <= 50) {
            score += 15;
            reasons.push('strong winds');
        } else if (weather.windSpeed < 15) {
            score += 10;
            reasons.push('light winds');
        } else {
            score -= 20;
            reasons.push('dangerous winds');
        }

        // Weather conditions
        if (isClear(weather.weatherCode) || isCloudy(weather.weatherCode)) {
            score += 20;
            reasons.push('suitable weather');
        }

        // Storm penalty
        if (isStormy(weather.weatherCode)) {
            score -= 50;
            reasons.push('dangerous thunderstorms');
        }

        // Heavy rain penalty
        if (weather.precipitation > 10) {
            score -= 20;
            reasons.push('heavy rain');
        } else if (weather.precipitation > 5) {
            score -= 10;
            reasons.push('moderate rain');
        }

        // Light precipitation bonus (ocean activity)
        if (weather.precipitation > 0 && weather.precipitation <= 2) {
            score += 10;
        }

        return {
            type: ActivityType.SURFING,
            score: Math.max(0, Math.min(100, score)),
            reason: reasons.join(', '),
            recommended: score >= 50,
        };
    }

    // Indoor stuff - basically the inverse of outdoor activities
    private rankIndoorSightseeing(weather: WeatherForecast): RankedActivity {
        let score = 50; // Base score - always a viable option
        const reasons: string[] = ['comfortable indoor environment'];

        // Bad weather bonus (indoor activities are better in bad weather)
        if (isRainy(weather.weatherCode)) {
            score += 25;
            reasons.push('rainy outside');
        }

        if (isSnowy(weather.weatherCode)) {
            score += 20;
            reasons.push('snowy outside');
        }

        if (isStormy(weather.weatherCode)) {
            score += 30;
            reasons.push('stormy outside');
        }

        // Extreme temperature bonus
        const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
        if (avgTemp < 0 || avgTemp > 35) {
            score += 15;
            reasons.push('extreme temperature outside');
        }

        // High wind bonus
        if (weather.windSpeed > 40) {
            score += 15;
            reasons.push('high winds outside');
        }

        // Good weather penalty (better to be outside)
        if (isClear(weather.weatherCode) && avgTemp >= 15 && avgTemp <= 25) {
            score -= 20;
            reasons.push('beautiful weather outside');
        }

        return {
            type: ActivityType.INDOOR_SIGHTSEEING,
            score: Math.max(0, Math.min(100, score)),
            reason: reasons.join(', '),
            recommended: score >= 50,
        };
    }

    // Outdoor sightseeing - best on nice days
    private rankOutdoorSightseeing(weather: WeatherForecast): RankedActivity {
        let score = 0;
        const reasons: string[] = [];

        // Temperature scoring (ideal: 15-25°C)
        const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
        if (avgTemp >= 15 && avgTemp <= 25) {
            score += 35;
            reasons.push('perfect temperature');
        } else if (avgTemp >= 10 && avgTemp < 15) {
            score += 25;
            reasons.push('pleasant temperature');
        } else if (avgTemp >= 25 && avgTemp <= 30) {
            score += 20;
            reasons.push('warm but manageable');
        } else if (avgTemp > 30) {
            score += 5;
            reasons.push('hot weather');
        } else {
            score += 10;
            reasons.push('cool weather');
        }

        // Weather conditions scoring
        if (isClear(weather.weatherCode)) {
            score += 40;
            reasons.push('clear skies');
        } else if (isCloudy(weather.weatherCode)) {
            score += 25;
            reasons.push('partly cloudy');
        }

        // Precipitation penalty
        if (weather.precipitation === 0) {
            score += 15;
            reasons.push('no rain');
        } else if (weather.precipitation <= 2) {
            score += 5;
            reasons.push('light rain possible');
        } else if (weather.precipitation <= 5) {
            score -= 10;
            reasons.push('moderate rain expected');
        } else {
            score -= 30;
            reasons.push('heavy rain expected');
        }

        // Wind speed scoring
        if (weather.windSpeed < 20) {
            score += 10;
            reasons.push('calm conditions');
        } else if (weather.windSpeed > 40) {
            score -= 20;
            reasons.push('very windy');
        }

        // Storm penalty
        if (isStormy(weather.weatherCode)) {
            score -= 50;
            reasons.push('thunderstorms');
        }

        return {
            type: ActivityType.OUTDOOR_SIGHTSEEING,
            score: Math.max(0, Math.min(100, score)),
            reason: reasons.join(', '),
            recommended: score >= 50,
        };
    }
}

export default ActivityRankingService;

