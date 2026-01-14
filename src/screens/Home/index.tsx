import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { CloudArrowUpIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import { HomeHeader } from '../../components/HomeHeader';
import { TopMessage } from '../../components/TopMessage';
import {
  getLastSyncTimestamp,
  saveLastSyncTimestamp,
} from '../../lib/asyncStorage/asyncStorage';
import { useQuery, useRealm } from '../../lib/realm';
import { Historic } from '../../lib/realm/schemas/History';
import { CarStatus } from '../CarStatus';
import { Container, Content, Label, Title } from './styles';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

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

  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const lastSync = await getLastSyncTimestamp();

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at.getTime(),
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

  async function progressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = (transferred / transferable) * 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();
      await fetchHistoric();

      // Se o percentual está em 100%, então atribuímos null ao percentageToSync
      setPercentageToSync(null);

      Toast.show({
        type: 'info',
        text1: 'Todos os dados estão sincronizados.',
      });
    }

    if (percentage < 100) {
      // A função toFixed(0) é para retirar as casas decimais
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`);
    }
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
      {percentageToSync && (
        <TopMessage title={percentageToSync} icon={CloudArrowUpIcon} />
      )}

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
