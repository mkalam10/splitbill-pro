
import { Bill } from '../types';

const HISTORY_KEY = 'splitbill_pro_history';

export const getBills = (): Bill[] => {
    try {
        const billsJson = localStorage.getItem(HISTORY_KEY);
        if (!billsJson) return [];
        const bills = JSON.parse(billsJson) as Bill[];
        // Basic validation to ensure it's an array of objects with an id.
        if (Array.isArray(bills) && bills.every(b => typeof b === 'object' && b.id)) {
            return bills;
        }
        return [];
    } catch (error) {
        console.error("Failed to parse bills from localStorage", error);
        localStorage.removeItem(HISTORY_KEY); // Clear corrupted data
        return [];
    }
};

export const saveBills = (bills: Bill[]): void => {
    try {
        const billsJson = JSON.stringify(bills);
        localStorage.setItem(HISTORY_KEY, billsJson);
    } catch (error) {
        console.error("Failed to save bills to localStorage", error);
    }
};
