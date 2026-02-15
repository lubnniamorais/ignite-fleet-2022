import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria uma chave para armazenar a localização
const STORAGE_KEY = '@ignitefleet:location';

type LocationProps = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

// Função para obter as localizações do storage

// Vamos utilizar o asyncStorage para guardar as localizações/coordenadas
// no dispositivo e depois salvar no banco.
export async function getStorageLocations() {
  const storage = await AsyncStorage.getItem(STORAGE_KEY);

  const response = storage ? JSON.parse(storage) : [];

  return response;
}

// Função para salvar as localizações
export async function saveStorageLocation(newLocation: LocationProps) {
  // Recuperando o que está salvo no storage
  const storage = await getStorageLocations();

  // Adicionando a nova localização
  storage.push(newLocation);

  // Salvando no storage
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

// Função para limpar o storage, pois iremos levar os dados para dentro do banco de dados
export async function removeStorageLocations() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
