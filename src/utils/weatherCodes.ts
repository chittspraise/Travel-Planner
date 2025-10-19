/**
 * Weather Codes from WMO conversion.
 */
export const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};

/**
 * Get human-readable weather description from WMO code
 */
export function getWeatherDescription(code: number): string {
    return WEATHER_CODE_DESCRIPTIONS[code] || 'Unknown weather condition';
}

/**
 * Categorize weather conditions
 */
export function isSnowy(weatherCode: number): boolean {
return [71, 73, 75, 77, 85, 86].includes(weatherCode);
}

export function isRainy(weatherCode: number): boolean {
     return [
        51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82,
    ].includes(weatherCode);
}

 export function isClear(weatherCode: number): boolean {
      return   [0, 1, 2].includes(weatherCode);
}

  export function isStormy(weatherCode: number): boolean {
return [95, 96, 99].includes(weatherCode);
}

 export function isCloudy(weatherCode: number): boolean {
    return [3, 45, 48].includes(weatherCode);
}

