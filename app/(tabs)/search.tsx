import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';
import { AnimalCard } from '@/components/AnimalCard';
import { getAnimals } from '@/services/animalService';
import { Animal } from '@/types/animal';
import { categories } from '@/constants/categories';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAnimals();
  }, []);

  useEffect(() => {
    filterAnimals();
  }, [searchQuery, selectedCategory, animals]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const fetchedAnimals = await getAnimals();
      setAnimals(fetchedAnimals);
      setFilteredAnimals(fetchedAnimals);
    } catch (error) {
      console.error('Error loading animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnimals = () => {
    let filtered = animals;

    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(animal => animal.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(animal => 
        animal.name.toLowerCase().includes(query) || 
        animal.description.toLowerCase().includes(query)
      );
    }

    setFilteredAnimals(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Encontre um amigo</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#999999" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <Pressable onPress={clearSearch}>
              <X color="#999999" size={18} />
            </Pressable>
          )}
        </View>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter color={showFilters ? '#4CAF50' : '#666666'} size={20} />
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterSectionTitle}>Categorias</Text>
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
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredAnimals.length > 0 ? (
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
              <Text style={styles.emptyTitle}>Nenhum animal encontrado</Text>
              <Text style={styles.emptyText}>
                Tente outras palavras-chave ou remova os filtros.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#333333',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 100,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: '#F8F8F8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  categoriesScrollView: {
    paddingBottom: 8,
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
  scrollContent: {
    paddingBottom: 24,
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});