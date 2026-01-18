import { QuoteData } from './types';

export const DEFAULT_QUOTE: QuoteData = {
  id: `QT-${new Date().getFullYear()}-001`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  currency: '$',
  taxRate: 0,
  client: {
    name: '',
    company: '',
    email: '',
    address: '',
  },
  business: {
    name: 'My Awesome Business',
    email: 'contact@mybusiness.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Dr, Tech City, TC 90210',
    website: 'www.mybusiness.com'
  },
  items: [
    {
      id: '1',
      description: 'Consulting Services',
      quantity: 1,
      unitPrice: 150.00,
    }
  ],
  notes: 'Thank you for your business!',
  terms: 'Payment is due within 14 days. Please include the quote number on your check.',
};

export const CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
];
