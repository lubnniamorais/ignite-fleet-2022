import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { HomeHeader } from '../../components/HomeHeader';

import { useQuery } from '../../lib/realm';
import { Historic } from '../../lib/realm/schemas/History';
import { CarStatus } from '../CarStatus';

import { Container, Content } from './styles';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);

  const { navigate } = useNavigation();

  const historic = useQuery(Historic);
  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse._id.toString() });
    } else {
      navigate('departure');
    }
  }

  function fetchVehicle() {
    try {
      // Para trazer apenas um veículo, colocamos entre colchetes o número zero
      const vehicle = historic.filtered('status = `departure`')[0];

      // Atualizando o estado
      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert(
        'Veículo em uso',
        'Nao foi possivel carregar o veiculo em uso'
      );
      console.log(error);
    }
  }

  useEffect(() => {
    fetchVehicle();
  }, []);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />
      </Content>
    </Container>
  );
}
