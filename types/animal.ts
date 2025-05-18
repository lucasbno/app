export interface Animal {
  id: string;
  name: string;
  age: number; // in months
  description: string;
  category: string; // dog, cat, other
  status: 'available' | 'pending' | 'adopted';
  createdBy: string; // user ID
  images: string[];
  createdAt: string;
  isFavorite?: boolean;
}