import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { PawPrint } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to main app if already logged in
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(76, 175, 80, 0.8)', 'rgba(156, 39, 176, 0.8)']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.logoContainer}>
        <PawPrint size={80} color="#FFFFFF" />
        <Text style={styles.logoText}>Pata Solidária</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>
          Ajude a encontrar um lar para nossos amigos de quatro patas
        </Text>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.button, styles.buttonPrimary]} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={() => router.push('/signup')}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Criar Conta</Text>
          </Pressable>
          
          <Pressable 
            style={styles.buttonGuest} 
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.buttonGuestText}>Continuar como convidado</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '60%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
  button: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#4CAF50',
  },
  buttonGuest: {
    marginTop: 16,
    padding: 8,
  },
  buttonGuestText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});