export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees?: number;
  createdBy: string; // user ID
}