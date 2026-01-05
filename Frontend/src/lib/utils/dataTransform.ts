/**
 * Data transformation utilities for converting between
 * backend snake_case and frontend camelCase formats
 */

/**
 * Convert a string from snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert a string from camelCase to snake_case
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Recursively transform object keys from snake_case to camelCase
 */
export function transformKeysToCamel<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => transformKeysToCamel(item)) as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = snakeToCamel(key);
            result[camelKey] = transformKeysToCamel(obj[key]);
            return result;
        }, {} as any) as T;
    }

    return obj;
}

/**
 * Recursively transform object keys from camelCase to snake_case
 */
export function transformKeysToSnake<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => transformKeysToSnake(item)) as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = camelToSnake(key);
            result[snakeKey] = transformKeysToSnake(obj[key]);
            return result;
        }, {} as any) as T;
    }

    return obj;
}

/**
 * Format a date for backend (ISO 8601 date only: YYYY-MM-DD)
 */
export function formatDateForBackend(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}

/**
 * Parse a date from backend (handles both date and datetime strings)
 */
export function parseDateFromBackend(dateStr: string): Date {
    return new Date(dateStr);
}

/**
 * Format time for backend (HH:MM format)
 */
export function formatTimeForBackend(time: Date | string): string {
    if (typeof time === 'string') {
        // If already in HH:MM format, return as is
        if (/^\d{2}:\d{2}$/.test(time)) {
            return time;
        }
        const d = new Date(time);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
}

/**
 * Transform backend API response to frontend format
 */
export function transformBackendResponse<T = any>(data: any): T {
    return transformKeysToCamel<T>(data);
}

/**
 * Transform frontend data to backend format
 */
export function transformFrontendRequest<T = any>(data: any): T {
    return transformKeysToSnake<T>(data);
}
