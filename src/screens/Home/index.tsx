import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';

import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import { HomeHeader } from '../../components/HomeHeader';

import { useQuery, useRealm } from '../../lib/realm';
import { Historic } from '../../lib/realm/schemas/History';

import { CarStatus } from '../CarStatus';

import { Container, Content, Label, Title } from './styles';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );

  const { navigate } = useNavigation();

  const historic = useQuery(Historic);
  const realm = useRealm();
  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse._id.toString() });
    } else {
      navigate('departure');
    }
  }

  function fetchVehicleInUse() {
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

  function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format(
            `[Saída em] DD/MM/YYYY [às] HH:mm`
          ),
        };
      });

      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      console.log(error);
      Alert.alert('Histórico', 'Não foi possivel carregar o histórico');
    }
  }

  function handleHistoricDetails(id: string) {
    navigate('arrival', { id });
  }

  function progressNotification(transferred: number, transferable: number) {
    const percentage = (transferred / transferable) * 100;

    console.log('Transferindo => ', `${percentage}%`);
  }

  // USE EFFECT PARA TRAZER O VEÍCULO EM USO
  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  // USE EFFECT PARA SABER SE O USUÁRIO ESTÁ CONECTADO OU NÃO
  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => {
      // Se o realm está disponível e não está desconectado, então chamamos o método abaixo
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse);
      }
    };
  }, [realm]);

  // USE EFFECT PARA ACOMPANHAR O PROGRESSO DE ENVIO DE DADOS
  useEffect(() => {
    const syncSession = realm.syncSession;

    // Se a sincronização não estiver disponível, então não continuamos com o fluxo da aplicação
    if (!syncSession) {
      return;
    }

    // Registrando o progresso
    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return () => syncSession.removeProgressNotification(progressNotification);
  }, []);

  // USE EFFECT PARA TRAZER O HISTÓRICO
  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />

        <Title>Histórico</Title>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nenhum veículo utilizado.</Label>}
        />
      </Content>
    </Container>
  );
}
