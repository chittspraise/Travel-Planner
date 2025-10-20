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

export class ActivityRankingService {
     rankActivities(weather: WeatherForecast): RankedActivity[] {
    const activities = [
     this.rankSkiing(weather),
    this.rankSurfing(weather),
    this.rankIndoorSightseeing(weather),
            this.rankOutdoorSightseeing(weather),
        ];

        return activities.sort((a,b) => b.score - a.score);
    }

    private rankSkiing(weather: WeatherForecast): RankedActivity {
        let score = 0;
        const reasons: string[] = [];
        const temp = (weather.temperatureMax + weather.temperatureMin) / 2;
        
        if (temp >= -10 && temp <= 5) {
            score += 40;
            reasons.push('ideal temperature for skiing');
        } else if (temp > 5 && temp <= 10) {
            score += 20;
            reasons.push('acceptable temperature');
        } else if (temp < -10) {
            score += 15;
            reasons.push('very cold');
        } else {
            reasons.push('too warm for skiing');
        }

        if (weather.snowfall && weather.snowfall > 0) {
            score += 30;
            reasons.push('fresh snow');
        } else if (isSnowy(weather.weatherCode)) {
            score += 25;
            reasons.push('snowy conditions');
        } else {
            reasons.push('no snow');
        }

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

        if (isRainy(weather.weatherCode)) {
            score -= 20;
            reasons.push('rainy conditions');
        }

        if (isClear(weather.weatherCode)) {
            score += 10;
            reasons.push('clear visibility');
        }

        const finalScore = Math.max(0, Math.min(100, score));
        return {
            type: ActivityType.SKIING,
            score: finalScore,
            reason: reasons.join(', '),
            recommended: finalScore >= 50,
        };
    }

    private rankSurfing(weather: WeatherForecast): RankedActivity {
        let score = 0;
        const reasons: string[] = [];

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

        const wind = weather.windSpeed;
        if (wind >= 15 && wind <= 35) {
            score += 30;
            reasons.push('good wind for waves');
        } 
        else if (wind > 35 && wind <= 50) {
            score += 15;
            reasons.push('strong winds');
        } else if (wind < 15) {
            score += 10;
            reasons.push('light winds');
        } else {
            score -= 20;
            reasons.push('dangerous winds');
        }

        if (isClear(weather.weatherCode) || isCloudy(weather.weatherCode)) {
            score += 20;
            reasons.push('suitable weather');
        }

        if (isStormy(weather.weatherCode)) {
            score -= 50;
            reasons.push('dangerous thunderstorms');
        }

        const rain = weather.precipitation;
        if (rain > 10) {
            score -= 20;
            reasons.push('heavy rain');
        } else if (rain > 5) {
            score -= 10;
            reasons.push('moderate rain');
        } 
        else if (rain > 0 && rain <= 2) {
            score += 10; 
        }

        const finalScore = Math.max(0, Math.min(100, score));
        return {
            type: ActivityType.SURFING,
            score: finalScore,
            reason: reasons.join(', '),
            recommended: finalScore >= 50,
        };
    }

    private rankIndoorSightseeing(weather: WeatherForecast): RankedActivity {
        let score = 50; 
        const reasons: string[] = ['comfortable indoor environment'];

        if (isRainy(weather.weatherCode)) score += 25, reasons.push('rainy outside');
        if (isSnowy(weather.weatherCode)) score += 20, reasons.push('snowy outside');
        if (isStormy(weather.weatherCode)) score += 30, reasons.push('stormy outside');

        const avgTemp = (weather.temperatureMax + weather.temperatureMin) / 2;
        
        if (avgTemp < 0 || avgTemp > 35) {
            score += 15;
            reasons.push('extreme temperature outside');
        }

        if (weather.windSpeed > 40) {
            score += 15;
            reasons.push('high winds outside');
        }

        if (isClear(weather.weatherCode) && avgTemp >= 15 && avgTemp <= 25) {
            score -= 20;
            reasons.push('beautiful weather outside');
        }

        const finalScore = Math.max(0, Math.min(100, score));
        return {
            type: ActivityType.INDOOR_SIGHTSEEING,
            score:  finalScore,
            reason:reasons.join(', '),
            recommended: finalScore >= 50
        };
    }

    private rankOutdoorSightseeing(weather: WeatherForecast): RankedActivity {
        let score = 0;
        const reasons: string[] = [];
        
        const temp = (weather.temperatureMax + weather.temperatureMin) / 2;

        
        if (temp >= 15 && temp <= 25) {
            score += 35;
            reasons.push('perfect temperature');
        } 
        else if (temp >= 10 && temp < 15) {
            score += 25;
            reasons.push('pleasant temperature');
        } else if (temp > 25 && temp <= 30) {
            score += 20;
            reasons.push('warm but manageable');
        } else if (temp > 30) {
            score += 5;
            reasons.push('hot weather');
        } 
        else {
            score += 10;
            reasons.push('cool weather');
        }

     
        if (isClear(weather.weatherCode)) {
            score += 40;
            reasons.push('clear skies');
        } else if (isCloudy(weather.weatherCode)) {
            score += 25;
            reasons.push('partly cloudy');
        }

        
        const precip = weather.precipitation;
        if (precip === 0) {
            score += 15;
            reasons.push('no rain');
        }else if (precip <= 2) {
            score += 5;
            reasons.push('light rain possible');
        } 
        else if (precip <= 5) {
            score -= 10;

            reasons.push('moderate rain expected');
        } else {
             score -= 30;
            reasons.push('heavy rain expected');
        }

       
        if (weather.windSpeed < 20) {
            score += 10;
            reasons.push('calm conditions');
        } else if (weather.windSpeed > 40) {
            score -= 20;
            reasons.push('very windy');
        }

        if (isStormy(weather.weatherCode)) {
        score -= 50;
              reasons.push('thunderstorms');
        }

        const finalScore = Math.max(0, Math.min(100, score));
        return {
             type: ActivityType.OUTDOOR_SIGHTSEEING,
            score: finalScore,
            reason: reasons.join(', '),
            recommended: finalScore >= 50,
        };
    }
}

export default ActivityRankingService;
