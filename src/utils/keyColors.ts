/**
 * Key and Door Colors
 * Maps key/door IDs to their respective colors
 */

export const KEY_COLORS: Record<string, string> = {
    red: '#ef4444',      // Red
    blue: '#3b82f6',     // Blue
    green: '#10b981',    // Green
    yellow: '#f59e0b',   // Yellow/Amber
    purple: '#a855f7',   // Purple
    orange: '#f97316',   // Orange
    pink: '#ec4899',     // Pink
    cyan: '#06b6d4',     // Cyan
};

/**
 * Get color for a key/door ID
 */
export const getKeyColor = (id: string): string => {
    return KEY_COLORS[id] || '#fbbf24'; // Default to golden
};
