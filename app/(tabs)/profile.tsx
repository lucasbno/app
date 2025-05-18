import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Image, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Heart, LogOut, Settings, Bell, CircleHelp as HelpCircle, ChevronRight, Shield, User as UserIcon, Phone } from 'lucide-react-native';
import { getFavoriteAnimals } from '@/services/animalService';
import { AnimalCard } from '@/components/AnimalCard';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLogIn = () => {
    router.push('/login');
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: handleSignOut, style: 'destructive' }
      ]
    );
  };

  const MenuOption = ({ icon, title, onPress, showBadge = false, value = null, isToggle = false }) => (
    <Pressable
      style={styles.menuOption}
      onPress={onPress}
      disabled={isToggle}
    >
      <View style={styles.menuOptionLeft}>
        {icon}
        <Text style={styles.menuOptionTitle}>{title}</Text>
      </View>
      <View style={styles.menuOptionRight}>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        )}
        {isToggle ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
          />
        ) : (
          <ChevronRight color="#999999" size={20} />
        )}
      </View>
    </Pressable>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>
        
        <View style={styles.notLoggedInContainer}>
          <UserIcon size={64} color="#CCCCCC" />
          <Text style={styles.notLoggedInTitle}>Você não está logado</Text>
          <Text style={styles.notLoggedInText}>
            Faça login para acessar seu perfil, favoritos e gerenciar suas adoções.
          </Text>
          <Pressable style={styles.loginButton} onPress={handleLogIn}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user.displayName || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <Pressable 
            style={styles.editProfileButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </Pressable>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          
          <MenuOption
            icon={<Bell color="#333333" size={20} style={styles.menuIcon} />}
            title="Notificações"
            isToggle={true}
            value={notificationsEnabled}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          
          <MenuOption
            icon={<Settings color="#333333" size={20} style={styles.menuIcon} />}
            title="Configurações"
            onPress={() => router.push('/settings')}
          />
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <MenuOption
            icon={<Shield color="#333333" size={20} style={styles.menuIcon} />}
            title="Política de Privacidade"
            onPress={() => router.push('/privacy-policy')}
          />
          
          <MenuOption
            icon={<HelpCircle color="#333333" size={20} style={styles.menuIcon} />}
            title="Ajuda e Suporte"
            onPress={() => router.push('/help')}
          />
        </View>
        
        <Pressable style={styles.logoutButton} onPress={confirmSignOut}>
          <LogOut color="#D32F2F" size={20} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
        
        <Text style={styles.appVersion}>Versão 1.0.0</Text>
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
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#333333',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileImageText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  editProfileButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
  },
  menuSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuOptionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
  },
  menuOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF9800',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
    paddingHorizontal: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#D32F2F',
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 40,
  },
  notLoggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notLoggedInTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  notLoggedInText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});