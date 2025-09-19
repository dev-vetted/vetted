import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Text, View, Button, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@vetted/query';
import { usePets, useCreatePet } from '@vetted/query/hooks/pets-rest';

const queryClient = makeQueryClient();

type Health = { ok: boolean; ts: string } | null;

function PetsScreen() {
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const { data: pets, isLoading, error } = usePets('1');
  const createPet = useCreatePet('1');

  const handleCreatePet = () => {
    if (petName && petSpecies) {
      createPet.mutate(
        { name: petName, species: petSpecies },
        {
          onSuccess: () => {
            setPetName('');
            setPetSpecies('');
            Alert.alert('Success', 'Pet added successfully!');
          },
          onError: (error) => {
            Alert.alert('Error', (error as Error).message);
          },
        }
      );
    } else {
      Alert.alert('Error', 'Please enter both name and species');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mobile Pet Management</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Pet</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet name"
          value={petName}
          onChangeText={setPetName}
        />
        <TextInput
          style={styles.input}
          placeholder="Species"
          value={petSpecies}
          onChangeText={setPetSpecies}
        />
        <Button
          title={createPet.isLoading ? 'Adding...' : 'Add Pet'}
          onPress={handleCreatePet}
          disabled={createPet.isLoading}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Pets</Text>
        {isLoading && <Text>Loading pets...</Text>}
        {error && <Text style={styles.error}>Error: {(error as Error).message}</Text>}
        {pets && pets.length === 0 && <Text>No pets found.</Text>}
        {pets && pets.length > 0 && (
          <View>
            {pets.map((pet: any) => (
              <View key={pet.id} style={styles.petItem}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petSpecies}>({pet.species})</Text>
                <Text style={styles.petDate}>
                  Added: {new Date(pet.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <StatusBar style="auto" />
    </ScrollView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PetsScreen />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  petItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  petSpecies: {
    fontSize: 14,
    color: '#666',
  },
  petDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
});


