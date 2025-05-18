import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { PawPrint } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <PawPrint size={80} color="#4CAF50" />
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.text}>
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </Text>
        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Voltar para início</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#333333',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
    textAlign: 'center',
    color: '#666666',
    maxWidth: 320,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});