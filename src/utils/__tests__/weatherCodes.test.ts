import {
    getWeatherDescription,
    isSnowy,
    isRainy,
    isClear,
    isStormy,
    isCloudy,
    WEATHER_CODE_DESCRIPTIONS,
} from '../weatherCodes';

describe('weatherCodes', () => {
    describe('getWeatherDescription', () => {
        it('should return correct descriptions for known codes', () => {
            expect(getWeatherDescription(0)).toBe('Clear sky');
            expect(getWeatherDescription(1)).toBe('Mainly clear');
            expect(getWeatherDescription(61)).toBe('Slight rain');
            expect(getWeatherDescription(71)).toBe('Slight snow fall');
            expect(getWeatherDescription(95)).toBe('Thunderstorm');
        });

        it('should return default message for unknown codes', () => {
            
            expect(getWeatherDescription(999)).toBe('Unknown weather condition');
         expect(getWeatherDescription(-1)).toBe('Unknown weather condition');
        });

        it('should have all expected weather codes', () => {
            const expectedCodes = [
                0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75,
                77, 80, 81, 82, 85, 86, 95, 96, 99,
            ];

            
            expectedCodes.forEach((code) => {
                expect(WEATHER_CODE_DESCRIPTIONS[code]).toBeDefined();
                expect(typeof WEATHER_CODE_DESCRIPTIONS[code]).toBe('string');
            });
        });
    })

    describe('isSnowy', () => {
        it('should return true for snowy weather codes', () => {
            const snowyCodes = [71, 73, 75, 77, 85, 86];
            snowyCodes.forEach((code) => {
                expect(isSnowy(code)).toBe(true);
            });
        });

        it('should return false for non-snowy weather codes', () => {
            const nonSnowyCodes = [0, 1, 2, 3, 61, 63, 95];
            nonSnowyCodes.forEach((code) => {
                expect(isSnowy(code)).toBe(false);
            });
        });
    });

    describe('isRainy', () => {
        it('should return true for rainy weather codes', () => {
            const rainyCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
            rainyCodes.forEach((code) => {
                expect(isRainy(code)).toBe(true);
            });
        });

        it('should return false for non-rainy weather codes', () => {
            const nonRainyCodes = [0, 1, 2, 3, 71, 73, 95];
            nonRainyCodes.forEach((code) => {
                expect(isRainy(code)).toBe(false);
            });
        });
    });

    describe('isClear', () => {
        it('should return true for clear weather codes', () => {
            const clearCodes = [0, 1, 2];
            clearCodes.forEach((code) => {
                expect(isClear(code)).toBe(true);
            });
        });

        it('should return false for non-clear weather codes', () => {
            const nonClearCodes = [3, 45, 61, 71, 95];
            nonClearCodes.forEach((code) => {
                expect(isClear(code)).toBe(false);
            });
        });
    });

    describe('isStormy', () => {
        it('should return true for stormy weather codes', () => {
            const stormyCodes = [95, 96, 99];
            stormyCodes.forEach((code) => {
                expect(isStormy(code)).toBe(true);
            });
        });

        it('should return false for non-stormy weather codes', () => {
            const nonStormyCodes = [0, 1, 2, 3, 61, 71];
            nonStormyCodes.forEach((code) => {
                expect(isStormy(code)).toBe(false);
            });
        });
    });

    describe('isCloudy', () => {
        it('should return true for cloudy weather codes', () => {
            const cloudyCodes = [3, 45, 48];
            cloudyCodes.forEach((code) => {
                expect(isCloudy(code)).toBe(true);
            });
        });

        it('should return false for non-cloudy weather codes', () => {
            const nonCloudyCodes = [0, 1, 2, 61, 71, 95];
            nonCloudyCodes.forEach((code) => {
                expect(isCloudy(code)).toBe(false);
            });
        });
    });

    describe('weather categorization completeness', () => {
        it('should categorize all weather codes', () => {
            const allCodes = Object.keys(WEATHER_CODE_DESCRIPTIONS).map(Number);

            allCodes.forEach((code) => {
                const categorized =
                    isSnowy(code) ||
                    isRainy(code) ||
                    isClear(code) ||
                    isStormy(code) ||
                    isCloudy(code);

                expect(categorized).toBe(true);
            });
        });
    });
});

