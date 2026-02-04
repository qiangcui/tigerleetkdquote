export interface CostItem {
  label: string;
  current: string | number;
  new: string | number;
  note?: string;
}

export interface ClientData {
  clientName: string;
  developerName: string;
  date: string;
  quoteNumber: string;
  websiteLink: string; // Added dynamic link
}

export interface PricingData {
  newCreation: number;
  newHosting: number;
  newMaintenance: number;
  currentHosting: number;
  currentMaintenance: number;
  hostingDiscount: number; // Amount covered by developer
  creationDiscountPercent?: number; // e.g. 50 for 50% off website creation
}