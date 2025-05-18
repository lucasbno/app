import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Calendar, Phone, MapPin, Info, Share2 } from 'lucide-react-native';
import { getAnimalById, updateAnimalStatus } from '@/services/animalService';
import { toggleFavorite, checkIfFavorite } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import { Animal } from '@/types/animal';
import { categories } from '@/constants/categories';

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadAnimal();
    }
  }, [id]);

  const loadAnimal = async () => {
    try {
      setLoading(true);
      const animalData = await getAnimalById(id);
      
      if (animalData) {
        setAnimal(animalData);
        
        if (user) {
          const favoriteStatus = await checkIfFavorite(id, user.uid);
          setIsFavorite(favoriteStatus);
        }
      }
    } catch (error) {
      console.error('Error loading animal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      await toggleFavorite(id, newFavoriteState);
    } catch (error) {
      setIsFavorite(isFavorite);
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAdoptPress = () => {
    if (!user) {
      Alert.alert(
        'Atenção',
        'Você precisa estar logado para solicitar uma adoção',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Entrar', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    Alert.alert(
      'Solicitar Adoção',
      `Você tem certeza que deseja solicitar a adoção de ${animal?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            try {
              if (animal) {
                await updateAnimalStatus(animal.id, 'pending');
                Alert.alert(
                  'Solicitação Enviada',
                  'Sua solicitação de adoção foi enviada com sucesso! Entraremos em contato em breve.',
                  [{ text: 'OK', onPress: () => router.replace('/') }]
                );
              }
            } catch (error) {
              console.error('Error requesting adoption:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao solicitar a adoção. Tente novamente mais tarde.');
            }
          }
        }
      ]
    );
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Outro';
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!animal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Animal não encontrado</Text>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: animal.images[currentImageIndex] }}
          style={styles.image}
        />
        
        {animal.images.length > 1 && (
          <View style={styles.imageDots}>
            {animal.images.map((_, index) => (
              <Pressable 
                key={index}
                style={[
                  styles.imageDot,
                  currentImageIndex === index && styles.imageDotActive
                ]}
                onPress={() => setCurrentImageIndex(index)}
              />
            ))}
          </View>
        )}
        
        <Pressable 
          style={styles.backIconButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        
        <View style={styles.actionButtonsContainer}>
          <Pressable 
            style={[
              styles.actionIconButton,
              isFavorite && styles.favoriteButtonActive
            ]}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart 
              size={20} 
              color={isFavorite ? '#FFFFFF' : '#333333'}
              fill={isFavorite ? '#FF5252' : 'transparent'}
            />
          </Pressable>
          
          <Pressable 
            style={styles.actionIconButton}
            onPress={() => {
              // Share functionality
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Share2 color="#333333" size={20} />
          </Pressable>
        </View>
        
        {animal.status === 'adopted' && (
          <View style={styles.adoptedBanner}>
            <Text style={styles.adoptedBannerText}>Adotado</Text>
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.detailsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{animal.name}</Text>
            <Text style={styles.category}>{getCategoryName(animal.category)}</Text>
          </View>
          
          <View style={styles.ageBadge}>
            <Calendar color="#4CAF50" size={16} style={styles.ageBadgeIcon} />
            <Text style={styles.ageBadgeText}>{formatAge(animal.age)}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.description}>{animal.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Info color="#4CAF50" size={20} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>
                  {animal.status === 'available' ? 'Disponível' : 
                   animal.status === 'pending' ? 'Em processo' : 'Adotado'}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Calendar color="#4CAF50" size={20} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Idade</Text>
                <Text style={styles.infoValue}>{formatAge(animal.age)}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          
          <Pressable style={styles.contactButton}>
            <Phone color="#4CAF50" size={20} style={styles.contactButtonIcon} />
            <Text style={styles.contactButtonText}>(11) 98765-4321</Text>
          </Pressable>
          
          <Pressable style={styles.contactButton}>
            <MapPin color="#4CAF50" size={20} style={styles.contactButtonIcon} />
            <Text style={styles.contactButtonText}>Ver localização</Text>
          </Pressable>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {animal.status === 'available' && (
        <View style={styles.footer}>
          <Pressable 
            style={styles.adoptButton}
            onPress={handleAdoptPress}
          >
            <Text style={styles.adoptButtonText}>Solicitar Adoção</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  imageDotActive: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  backIconButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    flexDirection: 'row',
  },
  actionIconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 100,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  favoriteButtonActive: {
    backgroundColor: '#FF5252',
  },
  adoptedBanner: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: '#9C27B0',
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  adoptedBannerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 24,
    paddingBottom: 16,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  category: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666666',
  },
  ageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  ageBadgeIcon: {
    marginRight: 6,
  },
  ageBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactButtonIcon: {
    marginRight: 12,
  },
  contactButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4CAF50',
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
  },
  adoptButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 100,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adoptButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});