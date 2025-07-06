
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'expense' | 'income';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
}

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];
