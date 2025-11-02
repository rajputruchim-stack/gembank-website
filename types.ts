
export interface LOIFormData {
  companyName: string;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  city: string;
  gstin?: string;
  businessType: 'Manufacturer' | 'Retail' | 'Wholesale' | 'Distributor' | 'Other';
  turnover: string;
  interestLevel: string;
  authorization: boolean;
}

export interface BlogPost {
  slug: string;
  title: { [key: string]: string };
  author: string;
  date: string;
  excerpt: { [key: string]: string };
  content: { [key: string]: string };
}

export interface Invoice {
  id: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  date: string;
  customerName: string;
  customerEmail: string;
}
