import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { XIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { LatLng } from 'react-native-maps';
import { BSON } from 'realm';

import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Header } from '../../components/Header';
import { Loading } from '../../components/Loading';
import { LocationInfoProps } from '../../components/LocationInfo';
import { Locations } from '../../components/Locations';
import { Map } from '../../components/Map';
import { getLastSyncTimestamp } from '../../lib/asyncStorage/asyncStorage';
import { getStorageLocations } from '../../lib/asyncStorage/locationStorage';
import { useObject, useRealm } from '../../lib/realm';
import { Historic } from '../../lib/realm/schemas/History';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';
import { getAddressLocation } from '../../utils/getAddressLocation';
import {
  AsyncMessage,
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from './styles';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);

  // Teremos um array de coordenadas (latitude e longitude)
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();

  const { id } = route.params as RouteParamsProps;
  const realm = useRealm();
  const { goBack } = useNavigation();

  // const historic = useObject('Historic', id);
  const historic = useObject<Historic>('Historic', new BSON.UUID(id));

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeVehicleUsage() },
    ]);
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();

    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo.'
        );
      }

      // Recuperando as coordenadas salvas pelo AsyncStorage
      const locations = await getStorageLocations();

      // Aqui garantimos que historic não é null
      if (historic) {
        realm.write(() => {
          historic.status = 'arrival';
          historic.updated_at = new Date();

          // Pegando todas as coordenadas obtidas pelo AsyncStorage e adicionando no
          // banco de dados
          historic.coords.push(...locations);
        });

        // Depois que salvamos no banco, aí paramos a tarefa
        await stopLocationTask();

        Alert.alert('Chegada', 'Chegada registrada com sucesso.');
        goBack();
      } else {
        Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo.'
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo');
    }
  }

  async function getLocationsInfo() {
    if (!historic) {
      return;
    }

    const lastSync = await getLastSyncTimestamp();
    const updatedAt = historic.updated_at.getTime();
    setDataNotSynced(updatedAt > lastSync);

    if (historic?.status === 'departure') {
      // Recuperando as coordenadas que foram obtidas pela tarefa em background
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      setCoordinates(historic?.coords ?? []);
    }

    // Se temos coordendas vamos pegar o nome da rua, de onde o vaículo está saindo
    if (historic?.coords[0]) {
      const departureStreetName = await getAddressLocation(historic?.coords[0]);

      setDeparture({
        label: `Saindo em ${departureStreetName ?? ''}`,
        description: dayjs(new Date(historic.coords[0].timestamp)).format(
          'DD/MM/YYYY [às] HH:mm'
        ),
      });
    }

    if (historic.status === 'arrival') {
      // Obtendo a última posição do veículo
      const lastLocation = historic.coords[historic.coords.length - 1];

      const arrivalStreetName = await getAddressLocation(lastLocation);

      setArrival({
        label: `Chegando em ${arrivalStreetName ?? ''}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          'DD/MM/YYYY [às] HH:mm'
        ),
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    // Obtendo a data da ultima sincronização
    getLocationsInfo();
  }, [historic]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title={title} />

      {/* Se temos coordenadas, vamos renderizar o mapa */}
      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Locations departure={departure} arrival={arrival} />

        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={XIcon} onPress={handleRemoveVehicleUsage} />

          <Button title='Registrar chegada' onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da
          {historic?.status === 'departure' ? 'partida' : 'chegada'}
          pendente
        </AsyncMessage>
      )}
    </Container>
  );
}
