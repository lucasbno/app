import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar as CalendarIcon, MapPin, Clock, Users } from 'lucide-react-native';
import { getEvents } from '@/services/eventService';
import { Event } from '@/types/event';

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabSelected, setTabSelected] = useState('upcoming');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) > now);
  const pastEvents = events.filter(event => new Date(event.date) <= now);

  const displayEvents = tabSelected === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
      </View>

      <View style={styles.tabsContainer}>
        <Pressable 
          style={[styles.tab, tabSelected === 'upcoming' && styles.tabActive]}
          onPress={() => setTabSelected('upcoming')}
        >
          <Text style={[styles.tabText, tabSelected === 'upcoming' && styles.tabTextActive]}>
            Próximos
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, tabSelected === 'past' && styles.tabActive]}
          onPress={() => setTabSelected('past')}
        >
          <Text style={[styles.tabText, tabSelected === 'past' && styles.tabTextActive]}>
            Passados
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : displayEvents.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {displayEvents.map((event) => (
            <Pressable 
              key={event.id}
              style={styles.eventCard}
              onPress={() => router.push({
                pathname: `/(tabs)/event/${event.id}`,
              })}
            >
              <Image
                source={{ uri: event.imageUrl }}
                style={styles.eventImage}
              />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                
                <View style={styles.eventDetailsRow}>
                  <CalendarIcon color="#666666" size={16} style={styles.eventIcon} />
                  <Text style={styles.eventDetailText}>
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                
                <View style={styles.eventDetailsRow}>
                  <Clock color="#666666" size={16} style={styles.eventIcon} />
                  <Text style={styles.eventDetailText}>
                    {new Date(event.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                
                <View style={styles.eventDetailsRow}>
                  <MapPin color="#666666" size={16} style={styles.eventIcon} />
                  <Text style={styles.eventDetailText} numberOfLines={1}>
                    {event.location}
                  </Text>
                </View>

                <View style={styles.eventFooter}>
                  <View style={styles.eventDetailsRow}>
                    <Users color="#666666" size={16} style={styles.eventIcon} />
                    <Text style={styles.eventDetailText}>
                      {event.attendees || 0} participantes
                    </Text>
                  </View>

                  {tabSelected === 'upcoming' && (
                    <Pressable 
                      style={styles.eventButton}
                      onPress={() => {
                        // Implement participation logic
                        router.push({
                          pathname: `/(tabs)/event/${event.id}`,
                        });
                      }}
                    >
                      <Text style={styles.eventButtonText}>Participar</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            Nenhum evento {tabSelected === 'upcoming' ? 'agendado' : 'passado'}
          </Text>
          <Text style={styles.emptyText}>
            {tabSelected === 'upcoming' 
              ? 'Fique atento para novos eventos que serão realizados em breve.'
              : 'Ainda não temos eventos passados registrados.'}
          </Text>
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  tabTextActive: {
    color: '#4CAF50',
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 12,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    marginRight: 8,
  },
  eventDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  eventButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  eventButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});