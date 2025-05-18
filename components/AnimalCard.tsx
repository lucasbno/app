import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Animal } from '@/types/animal';
import { useState } from 'react';
import { toggleFavorite } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

interface AnimalCardProps {
  animal: Animal;
  onPress: () => void;
}

export function AnimalCard({ animal, onPress }: AnimalCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(animal.isFavorite || false);

  const handleFavoritePress = async (event) => {
    event.stopPropagation();
    
    if (!user) {
      // Redirect to login if user is not authenticated
      router.push('/login');
      return;
    }
    
    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      await toggleFavorite(animal.id, newFavoriteState);
    } catch (error) {
      // Revert to original state if error
      setIsFavorite(isFavorite);
      console.error('Error toggling favorite:', error);
    }
  };

  // Format age for display
  const formatAge = (ageInMonths: number) => {
    if (ageInMonths < 12) {
      return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      
      if (months === 0) {
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      } else {
        return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
    }
  };

  return (
    <Pressable 
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: animal.images[0] }}
          style={styles.image}
        />
        
        <Pressable 
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive
          ]}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heart 
            size={18} 
            color={isFavorite ? '#FFFFFF' : '#666666'}
            fill={isFavorite ? '#FF5252' : 'transparent'}
          />
        </Pressable>
        
        {animal.status === 'adopted' && (
          <View style={styles.adoptedBadge}>
            <Text style={styles.adoptedBadgeText}>Adotado</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{animal.name}</Text>
        <Text style={styles.age}>{formatAge(animal.age)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 100,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#FF5252',
  },
  adoptedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#9C27B0',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  adoptedBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  content: {
    padding: 12,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  age: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
});