import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from './firebase';
import { Animal } from '@/types/animal';

export async function getAnimals(): Promise<Animal[]> {
  // This is a mock implementation that returns dummy data.
  // In a real app, this would fetch from Firebase Firestore.
  return [
    {
      id: '1',
      name: 'Max',
      age: 24,
      description: 'Max é um cachorro muito amigável e brincalhão. Ele adora passar o tempo correndo e brincando com bolas.',
      category: 'dog',
      status: 'available',
      createdBy: 'user1',
      images: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Luna',
      age: 12,
      description: 'Luna é uma gatinha muito carinhosa e dócil. Ela adora dormir no colo e receber carinho.',
      category: 'cat',
      status: 'available',
      createdBy: 'user1',
      images: ['https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Bob',
      age: 36,
      description: 'Bob é um coelho muito calmo e silencioso. Ele é ótimo para apartamentos.',
      category: 'other',
      status: 'available',
      createdBy: 'user2',
      images: ['https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Bella',
      age: 18,
      description: 'Bella é uma cachorrinha muito doce e obediente. Ela já está treinada para fazer suas necessidades fora de casa.',
      category: 'dog',
      status: 'adopted',
      createdBy: 'user3',
      images: ['https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg'],
      createdAt: new Date().toISOString(),
    }
  ];
}

export async function getAnimalById(id: string): Promise<Animal | null> {
  // In a real app, this would fetch a specific animal from Firebase Firestore.
  const animals = await getAnimals();
  return animals.find(animal => animal.id === id) || null;
}

export async function addAnimal(animalData: Omit<Animal, 'id' | 'createdAt'>): Promise<string> {
  // In a real app, this would add a new animal to Firebase Firestore.
  console.log('Adding animal:', animalData);
  
  // Mock successful addition
  return 'new-animal-id';
}

export async function updateAnimalStatus(id: string, status: string): Promise<void> {
  // In a real app, this would update an animal's status in Firebase Firestore.
  console.log(`Updating animal ${id} status to ${status}`);
}

export async function getFavoriteAnimals(userId: string): Promise<Animal[]> {
  // In a real app, this would fetch user's favorite animals from Firebase Firestore.
  const animals = await getAnimals();
  return animals.filter(animal => Math.random() > 0.5); // Mock implementation
}