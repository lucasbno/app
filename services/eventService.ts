import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { firestore } from './firebase';
import { Event } from '@/types/event';

export async function getEvents(): Promise<Event[]> {
  // This is a mock implementation that returns dummy data.
  // In a real app, this would fetch from Firebase Firestore.
  
  const currentDate = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(currentDate.getDate() + 7);
  
  const lastWeek = new Date();
  lastWeek.setDate(currentDate.getDate() - 7);
  
  return [
    {
      id: '1',
      title: 'Feira de Adoção',
      description: 'Venha conhecer nossos animais e quem sabe encontrar um novo amigo para a vida!',
      date: nextWeek.toISOString(),
      location: 'Parque da Cidade, São Paulo',
      imageUrl: 'https://images.pexels.com/photos/7788657/pexels-photo-7788657.jpeg',
      attendees: 34,
      createdBy: 'admin',
    },
    {
      id: '2',
      title: 'Campanha de Vacinação',
      description: 'Traga seu pet para receber vacinas gratuitas e check-up veterinário.',
      date: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Clínica Veterinária Amigo Fiel, Av. Paulista, 1000',
      imageUrl: 'https://images.pexels.com/photos/6235945/pexels-photo-6235945.jpeg',
      attendees: 18,
      createdBy: 'admin',
    },
    {
      id: '3',
      title: 'Workshop: Cuidados Básicos com Pets',
      description: 'Aprenda sobre alimentação, higiene e cuidados básicos para manter seu pet saudável e feliz.',
      date: lastWeek.toISOString(),
      location: 'Online (Zoom)',
      imageUrl: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg',
      attendees: 65,
      createdBy: 'admin',
    }
  ];
}

export async function getEventById(id: string): Promise<Event | null> {
  // In a real app, this would fetch a specific event from Firebase Firestore.
  const events = await getEvents();
  return events.find(event => event.id === id) || null;
}

export async function registerForEvent(eventId: string, userId: string): Promise<void> {
  // In a real app, this would register a user for an event in Firebase Firestore.
  console.log(`Registering user ${userId} for event ${eventId}`);
}