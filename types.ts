export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ClientDetails {
  name: string;
  company: string;
  email: string;
  address: string;
}

export interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  website?: string;
}

export interface QuoteData {
  id: string;
  date: string;
  dueDate: string;
  client: ClientDetails;
  business: BusinessDetails;
  items: LineItem[];
  currency: string;
  taxRate: number; // Percentage, e.g., 10 for 10%
  notes: string;
  terms: string;
}

export enum AIActionType {
  ENHANCE_ITEM = 'ENHANCE_ITEM',
  GENERATE_TERMS = 'GENERATE_TERMS',
  GENERATE_EMAIL = 'GENERATE_EMAIL',
}