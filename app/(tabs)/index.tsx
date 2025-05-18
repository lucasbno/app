import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Filter, Bell } from 'lucide-react-native';
import { AnimalCard } from '@/components/AnimalCard';
import { getAnimals } from '@/services/animalService';
import { Animal } from '@/types/animal';
import { categories } from '@/constants/categories';

export default function HomeScreen() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const fetchedAnimals = await getAnimals();
      setAnimals(fetchedAnimals);
    } catch (error) {
      console.error('Error loading animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnimals();
    setRefreshing(false);
  };

  const filteredAnimals = selectedCategory === 'all' 
    ? animals 
    : animals.filter(animal => animal.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Olá!</Text>
          <Text style={styles.title}>Pata Solidária</Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable style={styles.iconButton}>
            <Bell color="#333333" size={24} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Filter color="#333333" size={24} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Faça a diferença</Text>
            <Text style={styles.bannerSubtitle}>Adote um amigo, transforme uma vida</Text>
            <Pressable style={styles.bannerButton} onPress={() => router.push('/search')}>
              <Text style={styles.bannerButtonText}>Ver todos</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollView}
          >
            <Pressable 
              style={[
                styles.categoryButton, 
                selectedCategory === 'all' && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === 'all' && styles.categoryButtonTextActive
              ]}>Todos</Text>
            </Pressable>
            
            {categories.map((category) => (
              <Pressable 
                key={category.id}
                style={[
                  styles.categoryButton, 
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.categoryButtonTextActive
                ]}>{category.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Esperando por um lar</Text>
          <Pressable onPress={() => router.push('/search')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : filteredAnimals.length > 0 ? (
          <View style={styles.animalsGrid}>
            {filteredAnimals.map((animal) => (
              <AnimalCard 
                key={animal.id}
                animal={animal}
                onPress={() => router.push({
                  pathname: `/(tabs)/animal/${animal.id}`,
                })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum animal encontrado nesta categoria.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#333333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 24,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4CAF50',
  },
  categoriesContainer: {
    marginVertical: 8,
  },
  categoriesScrollView: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#9C27B0',
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});