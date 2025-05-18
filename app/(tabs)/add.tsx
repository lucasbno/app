import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Plus } from 'lucide-react-native';
import { addAnimal } from '@/services/animalService';
import { categories } from '@/constants/categories';
import { useAuth } from '@/hooks/useAuth';

export default function AddAnimalScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('O nome do animal é obrigatório');
      return false;
    }
    if (!age.trim()) {
      setError('A idade do animal é obrigatória');
      return false;
    }
    if (!category) {
      setError('A categoria do animal é obrigatória');
      return false;
    }
    if (!description.trim()) {
      setError('A descrição do animal é obrigatória');
      return false;
    }
    if (images.length === 0) {
      setError('Pelo menos uma foto do animal é obrigatória');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Atenção', 'Você precisa estar logado para cadastrar um animal');
      router.push('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await addAnimal({
        name,
        age: parseInt(age),
        description,
        category,
        images,
        createdBy: user.uid,
        status: 'available',
      });

      Alert.alert(
        'Sucesso',
        'Animal cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar animal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar Animal</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.label}>Fotos</Text>
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <Pressable 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X color="#FFFFFF" size={16} />
                </Pressable>
              </View>
            ))}
            
            {images.length < 5 && (
              <Pressable style={styles.addImageButton} onPress={pickImage}>
                <Plus color="#666666" size={32} />
              </Pressable>
            )}
          </View>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Rex"
            placeholderTextColor="#999999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Idade (meses)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 24"
            placeholderTextColor="#999999"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          <Text style={styles.label}>Categoria</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((cat) => (
              <Pressable 
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.id && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat.id && styles.categoryButtonTextActive
                ]}>{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva o animal, sua personalidade, necessidades especiais, etc."
            placeholderTextColor="#999999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Cadastrar</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#333333',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    padding: 24,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F8F8',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF5252',
    borderRadius: 100,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginVertical: 8,
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
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#D32F2F',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 100,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});