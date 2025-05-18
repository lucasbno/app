import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, ActivityIndicator, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2 } from 'lucide-react-native';
import { getEventById, registerForEvent } from '@/services/eventService';
import { useAuth } from '@/hooks/useAuth';
import { Event } from '@/types/event';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const eventData = await getEventById(id);
      setEvent(eventData);
      
      // Check if user is registered (mock implementation)
      if (user) {
        setIsRegistered(Math.random() > 0.7);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      Alert.alert(
        'Atenção',
        'Você precisa estar logado para participar deste evento',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Entrar', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    try {
      await registerForEvent(id, user.uid);
      setIsRegistered(true);
      Alert.alert(
        'Sucesso',
        'Você está registrado para este evento! Enviaremos um lembrete por email antes do evento.'
      );
    } catch (error) {
      console.error('Error registering for event:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao registrar sua participação. Tente novamente mais tarde.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://maps.google.com/?q=${encodedLocation}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o mapa');
        }
      })
      .catch(error => console.error('Error opening maps:', error));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Evento não encontrado</Text>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: event.imageUrl }}
          style={styles.image}
        />
        
        <Pressable 
          style={styles.backIconButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </Pressable>
        
        <Pressable 
          style={styles.shareIconButton}
          onPress={() => {
            // Share functionality
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Share2 color="#FFFFFF" size={20} />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.detailsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Calendar color="#4CAF50" size={20} style={styles.infoIcon} />
            <Text style={styles.infoText}>{formatDate(event.date)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock color="#4CAF50" size={20} style={styles.infoIcon} />
            <Text style={styles.infoText}>{formatTime(event.date)}</Text>
          </View>
        </View>
        
        <Pressable 
          style={styles.locationContainer}
          onPress={() => openMaps(event.location)}
        >
          <MapPin color="#4CAF50" size={20} style={styles.locationIcon} />
          <Text style={styles.locationText}>{event.location}</Text>
        </Pressable>
        
        {event.attendees && (
          <View style={styles.attendeesContainer}>
            <Users color="#4CAF50" size={20} style={styles.attendeesIcon} />
            <Text style={styles.attendeesText}>{event.attendees} participantes</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {!isPastEvent && (
        <View style={styles.footer}>
          <Pressable 
            style={[
              styles.registerButton,
              isRegistered && styles.registeredButton
            ]}
            onPress={handleRegister}
            disabled={isRegistered}
          >
            <Text style={styles.registerButtonText}>
              {isRegistered ? 'Inscrito' : 'Participar'}
            </Text>
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
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
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
  shareIconButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
    flex: 1,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  attendeesIcon: {
    marginRight: 8,
  },
  attendeesText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
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
  registerButton: {
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
  registeredButton: {
    backgroundColor: '#81C784',
  },
  registerButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});